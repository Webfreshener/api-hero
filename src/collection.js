import Model from "./model";
import {RxVO} from "rxvo";
import Query from "./query";
import foreach from "lodash.foreach";
import map from "lodash.map";
import uniqueid from "lodash.uniqueid";
import {_cids, _requests} from "./_references";

const _models = new WeakMap();
const _queries = new WeakMap();
const resolveData = (data) => {
    return ("$model" in data) ? data.$model.data : data;
};

const _createReference = (model, collection) => {
    // creates new Model Class to point to RxVO weak-reference
    const _mC = new (collection.modelClass)();
    // sets RxVO weak-reference / is referenced by Collection UID
    _cids.get(collection)[_mC.$cid] = model;
    // sets back-ref to the Model on the RxVO data element
    Object.defineProperty(model, "$model", {
        get: () => _mC,
        enumerable: false,
    });
};

/**
 * RESTful Collection Management Class
 */
class Collection {
    /**
     * @param schema Collection RxVO Schema
     * @returns {boolean}
     */
    constructor(schema) {
        const _self = this;
        const _q = new Query();

        // define read-only $collection property on Query
        Object.defineProperty(_q, "$collection", {
            get: () => _self,
        });

        // stores Query Object to Weakmap
        _queries.set(this, _q);

        // defines Query property on this Collection
        Object.defineProperty(this, "query", {
            get: () => _queries.get(_self),
        });

        // defines schema getter on Collection
        Object.defineProperty(this, "$schema", {
            get: () => schema,
        });

        // creates RxVO and subscribes to events on root
        try {
            // const _colSchema = {
            //     type: "array",
            //     "$schema": "http://json-schema.org/draft-07/schema#",
            //     items: {
            //         type: "object",
            //         properties: schema.properties
            //     },
            // };
            const _colSchema = {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                    }
                }
            };
            const _rxvo = new RxVO(_colSchema);
            _rxvo.subscribe({
                next: (d) => {
                    foreach(d.models, (m) => this.create(m));
                },
                error: (e) => {
                    console.log(`e: ${e}`);
                },
            });

            // stores RxVO ref to WeakMap
            _models.set(this, _rxvo);
        } catch (e) {
            console.error(`${this.$classname}: invalid schema: ${e}`);
            return false;
        }
        _cids.set(this, {});
        // set timeout to allow subclasses to construct before sealing
        setTimeout((() => Object.seal(this)), 0);
        // returns
        return;
    }

    /**
     *
     * @returns {*}
     */
    get models() {
        return _models.get(this).model;
        // return _models.get(this).model;
    }

    /**
     *
     * @param models
     * @returns {Collection}
     */
    set models(data) {
        // helper to determine how to handle incoming data properties
        const _derive = (m) => {
            return (m instanceof Model ? m.data : m);
        };

        // tests for array and maps or wraps single element into an array
        const _m = Array.isArray(data) ? map(data, _derive) : [_derive(data)];
        _models.get(this).model = _m;

        // applies the Model back-refs onto the dataset
        foreach(_models.get(this).model, (m) => _createReference(m, this));
        return this;
    }

    /**
     * Get an iterator of all models in this collection
     * @returns {CollectionIterator}
     */
    values() {
        return new CollectionIterator(this, ITERATOR_VALUES);
    }

    // Get an iterator of all model IDs in this collection.
    keys() {
        return new CollectionIterator(this, ITERATOR_KEYS);
    }

    /**
     * Get an iterator of all [ID, model] tuples in this collection.
     * @returns {CollectionIterator}
     */
    entries() {
        return new CollectionIterator(this, ITERATOR_KEYSVALUES);
    }

    /**
     * alias for `length`
     * @returns {number}
     */
    count() {
        return this.length;
    }

    /**
     * Returns current `models` length
     * @returns {number}
     */
    get length() {
        return this.models.length;
    }

    /**
     * getter for API URI for Collection
     * @returns {string}
     */
    get url() {
        let _req = _requests.get(this) || void(0);
        let q = `${this.$scope.$utils.apiUrl}/${this.$className}`;
        if (_req && _req.method === "read") {
            // let p = this.$scope.querify(this.__params);
            // if (p.length) {
            //     q = `${q}?${p}`;
            // }
        }
        return encodeURI(q);
    }

    /**
     * Resets collection to empty `Array`
     * @returns {Collection}
     */
    reset() {
        this.models = [];
        return this;
    }

    /**
     * Performs REST::GET Operation to populate collection
     * note: uses Query if present
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    fetch() {
        let _req = {
            method: this.$scope.options.CRUD_METHODS.read,
            id: uniqueid(`${this.$collectionName}-read-`),
        };
        _requests.set(this, _req);

        return this.$scope.sync(_req.method, this, {}).then((res) => {
            this.models = res;
            _requests.delete(this);
        });
    }

    /**
     *
     * @param data
     */
    newModel(data) {
        data = resolveData(data);

        // seems model contamination is occuring here
        // todo: dig into this
        const _s = {
            properties: JSON.parse(JSON.stringify(this.$schema.properties)),
        };

        const _rxvo = new RxVO(_s);

        _rxvo.model = ((data) && (typeof data) !== "null") ? data : {};
        _createReference(_rxvo.model, this);

        let _inst = {};

        Object.keys(this.$schema.properties).forEach((prop) => {
            Object.defineProperty(_inst, prop, {
                get: () => _rxvo.model[prop],
                set: (val) => _rxvo.model[prop] = val,
                enumerable: true,
            });
        });

        Object.defineProperty(_inst, "$model", {
            get: () => _rxvo.model.$model,
            enumerable: false,
        });

        return _inst;
    }

    /**
     * Adds Model to Collection and saves to remote collection by default
     * @param data
     * @param immediate - set to `false` to add to collection without saving to remote
     * @returns {Model}
     */
    create(data, immediate = true) {
        data = this.newModel(data);
        this.add(data);
        if (immediate) {
            return data.$model.save();
        } else {
            return data.$model;
        }
    }

    /**
     * Adds Object to Model without updating remote collection
     * @param data
     * @returns {Collection}
     */
    add(data) {
        this.models.$model.addItem(resolveData(data));
        return this;
    }

    /**
     * Get the model at the given index
     * @param idx
     * @returns {*}
     */
    at(idx) {
        if (idx < 0) idx += this.length;
        return this.models[idx];
    }

    // Define how to uniquely identify models in the collection.
    modelId(attrs) {
        return attrs["name"];
    }

    /**
     * Getter for Model Class with embedded back-references to this NS::Collection
     * @returns {Class}
     */
    get modelClass() {
        const _self = this;
        const $cid = uniqueid(_self.$className);
        return class extends Model {
            constructor() {
                super(_self);
                Object.defineProperty(this, "$cid", {
                    get: () => $cid,
                    enumerable: false,
                });

                // defines getter for owner Collection reference
                Object.defineProperty(this, "$collection", {
                    get: () => _self,
                    enumerable: false,
                });

                Object.defineProperty(this, "$scope", {
                    get: () => _self.$scope,
                    enumerable: false,
                });
            }
        };
    }

    /**
     * Batch saves Objects that are new or need updating
     * @param options
     * @returns {*}
     */
    save(options) {
        const batch = new Batch(_.compact(
            _.map(this.models, function (v, k) {
                if (v.isNew() || v.dirty()) {
                    return v;
                }
            })));
        // loops on `models` and maps array of items that need to be saved
        return batch.exec(options);
    }

    /**
     * TODO: should be observable
     */
    subscribe() {
        //TODO: implement this or something to this effect
    }

    /**
     * Accessor for Collection's Primitive Value
     * @returns {Object}
     */
    valueOf() {
        return _models.get(this).valueOf();
    }

    /**
     * Accessor for Collection's `JSON` representation
     * @returns {*}
     */
    toJSON() {
        return _models.get(this).toJSON();
    }

    /**
     * Accessor for Collection's `String` representation
     * @returns {string}
     */
    toString() {
        return _models.get(this).toString();
    }
}

let $$iterator = typeof Symbol === "function" && Symbol.iterator;

if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
}

// /**
//  * CollectionIterator
//  * implementation of BackBoneJS CollectionIterator
//  * @param collection
//  * @param kind
//  * @constructor
//  */
class CollectionIterator {
    constructor(collection, kind) {
        this._collection = collection;
        this._kind = kind;
        this._index = 0;
    }

    next() {
        if (this._collection) {
            // Only continue iterating if the iterated collection is long enough.
            if (this._index < this._collection.length) {
                let model = this._collection.at(this._index);
                this._index++;

                // Construct a value depending on what kind of values should be iterated.
                let value;
                if (this._kind === ITERATOR_VALUES) {
                    value = model;
                } else {
                    let id = this._collection.modelId(model.$model.data);
                    if (this._kind === ITERATOR_KEYS) {
                        value = id;
                    } else { // ITERATOR_KEYSVALUES
                        value = [id, model];
                    }
                }
                return {value: value, done: false};
            }
            // Once exhausted, remove the reference to the collection so future
            // calls to the next method always return done.
            this._collection = void 0;
        }

        return {value: void 0, done: true};
    };
};

const ITERATOR_VALUES = 1;
const ITERATOR_KEYS = 2;
const ITERATOR_KEYSVALUES = 3;

// All Iterators should themselves be Iterable.
if ($$iterator) {
    CollectionIterator.prototype[$$iterator] = function () {
        return this;
    };
}

export default Collection;

import Model from "./model";
import {JSD} from "jsd";
import Query from "./query";
import foreach from "lodash.foreach";
import map from "lodash.map";
import uniqueid from "lodash.uniqueid";
import {_cids} from "./_references";
const _models = new WeakMap();
const _queries = new WeakMap();

/**
 *
 */
class Collection {
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

        // creates JSD and subscribes to events on root
        try {
            const _jsd = new JSD([{
                type: "Object",
                elements: schema.properties
            }]);
            _jsd.document.subscribe({
                next: (d) => {
                    foreach(d.models, (m) => {
                        const _model = new this.modelClass(m);
                        _cids.get(this)[_model.$cid] = m;
                        Object.defineProperty(m.$ref, "$model", {
                            value: _model,
                            enumerable: false,
                            writable: false,
                        });
                    });
                },
                error: (e) => {
                },
            });

            // stores JSD ref to WeakMap
            _models.set(this, _jsd);
        } catch (e) {
            console.error(`${this.$classname}: invalid schema: ${e}`);
            return false;
        }

        _cids.set(this, {});
        // set timeout to allow subclasses to construct before sealing
        // setTimeout((() => Object.seal(this)), 0);
    }

    /**
     *
     * @returns {*}
     */
    get models() {
        return map(_models.get(this).document.model, (m) => m.$model);
    }

    /**
     *
     * @param models
     * @returns {Collection}
     */
    set models(data) {
        const _derive = (m) => m instanceof Model ? m.data : m;
        const _m = Array.isArray(data) ? map(data, _derive) : [_derive(data)];
        _models.get(this).document.model = _m;
        return this;
    }

    // Get an iterator of all models in this collection.
    values() {
        return new CollectionIterator(this.models, ITERATOR_VALUES);
    }

    // Get an iterator of all model IDs in this collection.
    keys() {
        return new CollectionIterator(this.models, ITERATOR_KEYS);
    }

    // Get an iterator of all [ID, model] tuples in this collection.
    entries() {
        return new CollectionIterator(this.models, ITERATOR_KEYSVALUES);
    }

    /**
     * Returns current `models` length
     * @returns {*}
     */
    count() {
        return this.models.length;
    }

    get length() {
        return this.models.length;
    }

    /**
     * returns uri encoded Query String
     * @returns {string}
     */
    url() {
        let q = `${this.$scope.getAPIUrl()}/${this.$className}`;
        if (this.__method === "read") {
            let p = this.$scope.querify(this.__params);
            if (p.length) {
                q = `${q}?${p}`;
            }
        }
        return encodeURI(q);
    }

    reset() {
        this.models = [];
    }

    fetch() {

    }

    /**
     * Adds model to collection and saves to remote collection
     * @param data
     * @returns {*}
     */
    create(data) {
        return new this._modelClass(data);
    }

    /**
     * Adds Object to Model without updating remote collection
     * @param data
     * @returns {Collection}
     */
    add(data) {
        this.models.document.addItem(data);
        return this;
    }

    /**
     *
     * @returns {Class}
     */
    get modelClass() {
        const _self = this;
        return class extends Model {
            constructor(data = null) {
                super(data, _self);
                const _cid = uniqueid(_self.$className);
                console.log(`_self.$className: ${_self.$className}`);
                // defined getter for private cid attribute
                Object.defineProperty(this, "$cid", {
                    get: () => _cid,
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
     * should be oberservable
     */
    subscribe() {
        //TODO: implement this
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

CollectionIterator.prototype.next = function () {
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
                let id = this._collection.modelId(model.attributes);
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

export default Collection;

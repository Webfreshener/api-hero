import {RxVO} from "rxvo";
import {BehaviorSubject} from "rxjs/Rx";
import {_cids, _modelClassRefs, _subjects, _modelStats, _modelRefs} from "../src/_references";
import {NSElement} from "../src/ns_element";
import {Utils} from "../src/utils";
import foreach from "lodash.foreach";
const _queries = new WeakMap();
/**
 * RESTful Collection Management Class
 */
class Collection extends NSElement {
    /**
     * @param schema Collection RxVO Schema
     * @returns {boolean}
     */
    constructor(schema) {
        super(schema);
        console.log(`schema: ${JSON.stringify(schema, null, 2)}`);
        // defines Namespace reference on Collection
        Object.defineProperty(this, "$scope", {
            get: () => arguments[1],
            enumerable: true,
            configurable: false,
        });

        _subjects.set(this, new BehaviorSubject().skip(1));
        _cids.set(this, {});
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
        return _modelClassRefs.get(this);
    }

    /**
     *
     * @param handlers
     * @returns {*}
     */
    subscribe(handlers) {
        return _subjects.get(this).subscribe(handlers)
    }

    /**
     * Accessor for Collection's Primitive Value
     * @returns {Object}
     */
    valueOf() {
        return this.models.valueOf();
    }

    /**
     * Accessor for Collection's `JSON` representation
     * @returns {*}
     */
    toJSON() {
        return this.models.map((m) => m.toJSON());
    }

    /**
     * Accessor for Collection's `String` representation
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }

}

let $$iterator = typeof Symbol === "function" && Symbol.iterator;

if ($$iterator) {
    Collection.prototype[$$iterator] = Collection.prototype.values;
}

/**
 * CollectionIterator
 * implementation of BackBoneJS CollectionIterator
 * @param collection
 * @param kind
 * @constructor
 */
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

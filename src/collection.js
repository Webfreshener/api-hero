import Model from "./model";
import {JSD} from "jsd";

const _schemas = new WeakMap();
const _models = new WeakMap();
const _queries = new WeakMap();

class Collection {
    constructor(models, opts = {}) {
        _models.set(this, new JSD([{
            type: "Object",
            elements: opts.properties || {
                "*": {
                    type: "*"
                }
            }
        }]));
        _queries.set(this, {});
        // lets subclasses construct before sealing
        setTimeout((() => Object.seal(this)), 0);
    }

    get models() {
        return _models.get(this).document.model;
    }

    /**
     * Returns current `models` length
     * @returns {*}
     */
    count() {
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


    /**
     *
     * @param obj
     * @param prefix
     * @returns {*}
     */
    schemaAdd(obj, prefix) {
        return this.__schema.add(obj, prefix);
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    schemaGet(key) {
        return this.__schema.get(key);
    }

    /**
     *
     * @param key
     * @param value
     * @param _tags
     * @returns {*}
     */
    schemaSet(key, value, _tags) {
        return this.__schema.set(key, value, _tags);
    }

    /**
     *
     * @param fields
     * @param opts
     * @returns {*}
     */
    schemaIndex(fields, opts) {
        return this.__schema(fields, opts);
    }

    /**
     *
     * @param name
     * @param fn
     */
    schemaMethod(name, fn) {
        return this.__schema.method(name, fn);
    }

    /**
     *
     * @param name
     * @param fn
     * @returns {*|{init, get, set}}
     */
    schemaStatic(name, fn) {
        return this.__schema.static(name, fn);
    }

    /**
     *
     * @param name
     * @param fn
     * @returns {*}
     */
    schemaVirtual(name, fn) {
        return this.__schema.virtuals(name, fn);
    }

    /**
     *
     * @returns {*}
     */
    schemaReserved() {
        return $scope.Schema.reserved();
    }

    /**
     * Applies `Query` to collection and fetches result
     * ```
     * query : (query, options={})=> this.fetch(assign(options, where:query))
     * ```
     * @returns {$scope.Query|*}
     */
    query() {
        if (_queries.get(this) === null) {
            _queries.set(this, new Query(this.className));
        }
        return _queries.get(this);
    }

    /**
     *
     * @returns {*}
     */
    findAll() {
        return this.query().limit();
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

    // Query Methods

    /**
     *
     * @param queries
     * @returns {Collection}
     */
    or(...queries) {
        this.query().or($scope.Query.or(queries));
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    equalTo(col, value) {
        (!this.__query ? this.query() : this.__query).equalTo(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    notEqualTo(col, value) {
        (!this.__query ? this.query() : this.__query).notEqualTo(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    greaterThan(col, value) {
        (!this.__query ? this.query() : this.__query).greaterThan(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    greaterThanOrEqualTo(col, value) {
        (!this.__query ? this.query() : this.__query).greaterThanOrEqualTo(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    lessThan(col, value) {
        (!this.__query ? this.query() : this.__query).lessThan(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    lessThanOrEqualTo(col, value) {
        (!this.__query ? this.query() : this.__query).lessThanOrEqualTo(col, value);
        return this;
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Collection}
     */
    contains(col, value) {
        (!this.__query ? this.query() : this.__query).contains(col, value);
        return this;
    }

    /**
     * Sets condition that column value must be an array containing all items in given array
     * @param col
     * @param array
     * @returns {Collection}
     */
    containsAll(col, array) {
        (!this.__query ? this.query() : this.__query).containsAll(col, array);
        return this;
    }

    /**
     * Sets condition that column value must be an array containing
     * any of the items in given array
     * @param col
     * @param array
     * @returns {Collection}
     */
    containedIn(col, array) {
        (!this.__query ? this.query() : this.__query).containedIn(col, array);
        return this;
    }

    /**
     * Sets condition that column value must be an array containing
     * none of the items in given array
     * @param col
     * @param array
     * @returns {Collection}
     */
    notContainedIn(col, array) {
        (!this.__query ? this.query() : this.__query).notContainedIn(col, array);
        return this;
    }

    /**
     *
     * @param col
     * @param query
     * @returns {Collection}
     */
    inQuery(col, query) {
        (!this.__query ? this.query() : this.__query).inQuery(col, query);
        return this;
    }

    /**
     *
     * @param col
     * @param query
     * @returns {Collection}
     */
    notInQuery(col, query) {
        (!this.__query ? this.query() : this.__query).notInQuery(col, query);
        return this;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    include(value) {
        if (!(value instanceof String)) {
            return (() => {
                throw new Error("limit requires String value was {typeof value}");
            })();
        }
        return this.__params.include = `${value}`;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    keys(value) {
        if (!(value instanceof Array)) {
            return (() => {
                throw new Error("keys requires Array value was {typeof value}");
            })();
        }
        return this.__params.keys = `${value}`;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    count(value) {
        if (!(value instanceof Boolean)) {
            return (() => {
                throw new Error("count requires Boolean value was {typeof value}");
            })();
        }
        return this.__params.count = value || true;
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    order(value) {
        return this.__params.order = `${value}`;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    limit(value) {
        if (!(value instanceof Number)) {
            return (() => {
                throw new Error("limit requires Number value was {typeof value}");
            })();
        }
        return this.__params.limit = value;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    skip(value) {
        if (!(value instanceof Number)) {
            return (() => {
                throw new Error("skip requires Number value was {typeof value}");
            })();
        }
        return this.__params.skip = value;
    }

    //# Static (ActiveRecord Style) Query Methods
//### equalTo:(col, value)
    static equalTo(col, value) {
        return (new (this)).equalTo(col, value);
    };

//### equalTo:(col, value)
    static notEqualTo(col, value) {
        return (new (this)).notEqualTo(col, value);
    };

//### greaterThan:(col, value)
    static greaterThan(col, value) {
        return (new (this)).greaterThan(col, value);
    };

//### greaterThanOrEqualTo:(col, value)
    static greaterThanOrEqualTo(col, value) {
        return (new (this)).greaterThanOrEqualTo(col, value);
    };

//### greaterThan:(col, value)
    static lessThan(col, value) {
        return (new (this)).lessThan(col, value);
    };

//### greaterThanOrEqualTo:(col, value)
    static lessThanOrEqualTo(col, value) {
        return (new (this)).lessThanOrEqualTo(col, value);
    };

//### contains:(col, value)
    static contains(col, value) {
        return (new (this)).contains(col, value);
    };

//### contains:(col, array)
    static containsAll(col, array) {
        return (new (this)).containsAll(col, array);
    };

//### containedIn:(col, array)
    static containedIn(col, array) {
        return (new (this)).containedIn(col, array);
    };

    /**
     *
     * @param col
     * @param array
     * @returns {Collection}
     */
    static notContainedIn(col, array) {
        return (new (this)).notContainedIn(col, array);
    };

    /**
     *
     * @param col
     * @param query
     * @returns {Collection}
     */
    static inQuery(col, query) {
        return (new (this)).inQuery(col, query);
    };

    /**
     *
     * @param col
     * @param query
     * @returns {Collection}
     */
    static notInQuery(col, query) {
        return (new (this)).notInQuery(col, query);
    };

    /**
     *
     * @param queries
     * @returns {void|*}
     */
    static orQuery(...queries) {
        return (new (this)).orQuery(queries);
    };

    /**
     *
     * @param value
     * @returns {*}
     */
    static include(value) {
        return (new (this)).include = value;
    };

    /**
     *
     * @param array
     * @returns {*}
     */
    static keys(array) {
        return (new (this)).keys = value;
    };

    /**
     *
     * @param bool
     * @returns {*}
     */
    static count(bool) {
        return (new (this)).count = bool;
    };

    /**
     *
     * @param value
     * @returns {*}
     */
    static order(value) {
        return (new (this)).order = value;
    };

    /**
     *
     * @param value
     * @returns {*}
     */
    static limit(value) {
        return (new (this)).limit = value;
    };

    /**
     *
     * @param value
     * @returns {*}
     */
    static skip(value) {
        return (new (this)).skip = value;
    };
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
const CollectionIterator = function (collection, kind) {
    this._collection = collection;
    this._kind = kind;
    this._index = 0;
};

let ITERATOR_VALUES = 1;
let ITERATOR_KEYS = 2;
let ITERATOR_KEYSVALUES = 3;

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
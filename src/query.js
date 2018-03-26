import forEach from "lodash.foreach";
import flatten from "lodash.flatten";
import map from "lodash.map";
const __q = new WeakMap();
const __meta = new WeakMap();

export default class {
    constructor() {
        // TODO: review this for necessity or alternative solutions
        this.or = this._or;
        this.in = this._in;
        this.clear();
    }

    /**
     *
     */
    clear() {
        __meta.set(this, {
            include: [],
            limit: -1,
            skip: 0,
            extraOpts: {},
        })
        __q.set(this, {});
    }

    /**
     * Executes query and returns all results
     * @param opts
     * @returns {PromiseLike<T> | Promise<T>}
     */
    find(opts = {}) {
        if (typeof this.objectClass !== "function") {
            throw "valid Class required";
        }
        let crud = this.$scope.options.CRUD_METHODS.read;
        return (new this.objectClass).sync(crud, [], _.extend(opts, {where:this.__q})
        ).then((s, r, o)=> {
            return forEach(r.results, (v, k)=> {
                let obj = v.className ?
                    new (this.$scope[v.className])() :
                    (new this.objectClass())._finishFetch(v, true);
                return obj;
            });
        });
    }

    /**
     * Executes query and returns only the first result
     * @param opts
     * @returns {PromiseLike<T>|Promise<T>}
     */
    first(opts = {}) {
        return this.find(_.extend(opts, {skip:0, limit:1}));
    }

    /**
     *
     * @param col
     * @param key
     * @param val
     * @returns {Query}
     */
    set(col, key, val){
        if (col != null) {
            if (this.__q[col] == null) {
                this.__q[col] = {};
            }
        }
        (__q.get(this)[col] || __q.get(this))[key] = val;
        return this;
    }

    /**
     *
     * @returns {string}
     */
    getParams() {
        return (_.map(_.pairs(__q.get(this), (v,k)=> v.join("="))) ).join("&");
    }

    /**
     *
     * @returns {*}
     */
    toJSON() {
        return __q.get(this);
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Query}
     */
    equalTo(col, value){
        return this.set(null, col, value);
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Query}
     */
    notEqualTo(col, value){
        return this.set(col, "$ne", value);
    }

    /**
     *
     * @param query
     * @returns {Query}
     */
    dontSelect(query) {
        return this.set(null, "$dontSelect", {query});
    }

    /**
     * Sets condition that column must exist
     * @param col
     * @returns {Query}
     */
    exists(col) {
        return this.set(col, "$exists", true);
    }

    /**
     * Sets condition that column must not exist
     * @param col
     * @returns {Query}
     */
    doesNotExist(col) {
        return this.set(col, "$exists", false);
    }

    /**
     * Sets condition that column value must be greater than given value
     * @param col
     * @param val
     * @returns {Query}
     */
    greaterThan(col, val) {
        return this.set(col, "$gt", val);
    }

    /**
     * Sets condition that column value must be greater than or equal to the given value
     * @param col
     * @param val
     * @returns {Query}
     */
    greaterThanOrEqualTo(col, val) {
        return this.set(col, "$gte", val);
    }

    /**
     * Sets condition that column value must be less than given value
     * @param col
     * @param value
     * @returns {Query}
     */
    lessThan(col, value) {
        return this.set(col, "$lt", value);
    }

    /**
     * Sets condition that column value must be less than or equal to the given value
     * @param col
     * @param value
     * @returns {Query}
     */
    lessThanOrEqualTo(col, value) {
        return this.set(col, "$lte", value);
    }

    /**
     *
     * @param col
     * @param val
     * @returns {Query}
     */
    contains(col, val) {
        return this.set(col, "$regex", val); //"#{$scope.Query._quote val}"
    }

    /**
     * Sets condition that column value must be an array containing all items in given array
     * @param col
     * @param array
     * @returns {Query}
     */
    containsAll(col,array) {
        return this.set(null, "$all");
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Query}
     */
    containedIn(col, value) {
        return this.set(col, "$in", array);
    }

    /**
     *
     * @param col
     * @param array
     * @returns {Query}
     */
    notContainedIn(col, array) {
        return this.set(col, "$nin", array);
    }

    /**
     *
     * @param col
     * @param query
     * @returns {Query}
     */
    select(col, query) {
        return this.set(col, "$select", {query});
    }

    /**
     *
     * @param col
     * @param query
     * @returns {Query}
     */
    inQuery(col,query) {
        return this.set(col, "$inQuery", {where:query});
    }

    /**
     *
     * @param col
     * @param query
     * @returns {Query}
     */
    notInQuery(col,query) {
        return this.set(col, "$notInQuery", {where:query});
    }

    /**
     *
     * @param queries
     * @returns {*[]}
     * @private
     */
    _or(...queries) {
        const _q = __q.get(this);
        const _or = (_q["$or"] != null ? _q["$or"] : (_q["$or"] = []));
        return _q["$or"] = _or.concat(this.$scope.Query.or(queries));
    }

    /**
     *
     * @param object
     * @param key
     * @returns {Query}
     */
    relatedTo(object, key) {
        if ((!(object instanceof this.$scope.Model)) ||
            (object.$className === null)) {
            const eMsg = `${namespace}.Query.$relatedTo required object be of Type ${namespace}.Object`;
            throw new Error();
        }
        return this.set(null, "$relatedTo", {
                object: {
                    __type: "Pointer",
                    objectId: object.get("objectId"),
                    className: object.className
                },
                key:`${key}`
            }
        );
    }

    /**
     *
     * @param value
     * @returns {Query}
     */
    include(value) {
        return this.set(null, "include", `${value}`);
    }

    /**
     *
     * @param val
     * @returns {Query}
     */
    keys(val) {
        return this.set(null, "keys", `${value}`);
    }

    /**
     *
     * @param value
     * @returns {Query}
     */
    count(value) {
        return this.set(null, "count", `${value}`);
    }

    /**
     *
     * @param value
     * @returns {Query}
     */
    order(value) {
        return this.set(null, "order", `${value}`);
    }

    /**
     *
     * @param value
     * @returns {Query}
     */
    limit(value) {
        return this.set(null, "limit", `${value}`);
    }

    /**
     *
     * @param value
     * @returns {Query}
     */
    skip(value) {
        return this.set(null, "skip", `${value}`);
    }

    /**
     *
     * @param col
     * @param value
     * @returns {Query}
     */
    arrayKey(col,value) {
        return this.set(null, col, `${value}`);
    }

    ///
    // Static Methods
    //

    /**
     *
     * @param queries
     * @returns {Array}
     */
    static or(...queries) {
        return map(flatten(queries), (v, k) => {
            if (v.query !== null) {
                return v.query().__q || v;
            }
            return null;
        });
    }

    /**
     * Implementation of Parse _quote to create RegExp from string value
     * @param string
     * @returns {string}
     * @private
     */
    static _quote(string) {
        return `\\Q${s}\\E`;
    };
};

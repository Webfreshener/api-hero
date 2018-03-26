import {JSD} from "jsd";
import MetaData from "./metadata";
import {_cids} from "./_references";

const _modelRefs = new WeakMap();

export default class {
    constructor(collection) {
        // defines getter for owner Collection reference
        Object.defineProperty(this, "$collection", {
            get: () => collection,
            enumerable: false,
        });
        const _mdRef = new MetaData(this);
        Object.defineProperty(this, "$metadata", {
            get: () => _mdRef,
            enumerable: false,
        });
    }

    //
    // Accessor Methods
    //

    /**
     * returns data from JSD Document
     */
    get data() {
        return _cids.get(this.$collection)[this.$cid];
    }

    /**
     * sets data to JSD Document
     * @param d
     */
    set data(d) {
        this.data.$ref.model = d;
        return this;
    }

    /**
     * alias for data getter
     * @returns {*}
     */
    get attrs() {
        return this.data;
    }

    /**
     * alias for data setter
     * @param d
     * @returns {*}
     */
    set attrs(d) {
        return this.data = d;
    }

    /**
     * retrieves data at key
     * @param key
     */
    get(key) {
        return this.data[key];
    }

    /**
     * sets data upon key
     * @param data
     */
    set(key, val) {
        this.data.$ref.set(key, val);
        return this;
    }

    //
    // MetaData Accessors
    //

    /**
     * returns creation time of Model in Application
     * @returns {*}
     */
    get modelCreatedOn() {
        return this.$metadata.createdOn;
    }

    /**
     * returns last updated time of Model in Application
     * @returns {null|*}
     */
    get modelUpdatedOn() {
        return this.$metadata.updatedOn;
    }


    //
    // RXJS
    //

    /**
     *
     * @param handler
     */
    subscribe(handler) {
        // return this.data.$ref.subscribe(handler);
    }

    //
    // Validation Methods
    //

    /**
     * @returns {boolean|string}
     */
    validate() {
        return this.data.$ref.validate();
    }

    /**
     *
     * @returns {boolean}
     */
    get isValid() {
        return this.data.$ref.isValid();
    }

    /**
     *
     * @returns {string}
     */
    get url() {
        // const base    = $scope.getAPIUrl();
        // const ref     = !$scope.CAPITALIZE_CLASSNAMES ? this.className.toLowerCase() : this.className;
        // const item    = !this.isNew() ? `/${this.get(this.idAttribute)}` : '';
        // // search  = if (p=$scope.querify @__op).length then "?#{p}" else ''
        // const _preQ  = (this.params != null) ? this.params : '?';
        // const _query = $scope.querify(this.__op);
        // const search = _query.length ? `${_preQ}&${_query}` : _preQ;
        // return `${base}/${ref}${item}${search}`;
        return "";
    }

    //
    // REST Life-Cycle
    //

    /**
     *
     */
    fetch() {

    }

    /**
     *
     */
    save() {

    }

    /**
     *
     */
    sync() {

    }

    /**
     *
     */
    destroy() {

    }

    /**
     *
     */
    reset() {

    }

    //
    // translation
    //

    /**
     *
     * @returns {string}
     */
    valueOf() {
        return this.data.$ref.valueOf();
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return this.data.$ref.toString();
    }

    /**
     * @returns {JSON}
     */
    toJSON() {
        return this.data.$ref.toJSON();
    }
}

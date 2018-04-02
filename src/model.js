import {JSD} from "jsd";
import MetaData from "./metadata";
import {_cids, _requests} from "./_references";
import uniqueid from "lodash.uniqueid";

const _modelRefs = new WeakMap();

export default class {
    constructor(collection) {
        // defines getter for owner Collection reference
        Object.defineProperty(this, "$collection", {
            get: () => collection,
            enumerable: false,
        });

        Object.defineProperty(this, "$scope", {
            get: () => this.$collection.$scope,
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
     * sets value upon key
     * @param key
     * @param val
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

    get isNew() {
        return (!Object.keys(this.data).length || !this.data.id);
    }

    /**
     *
     * @returns {string}
     */
    get url() {
        const base    = this.$scope.$utils.apiUrl;
        // TODO: work out classname casing/transform
        const ref     = !this.$scope.options.CAPITALIZE_CLASSNAMES ?
            this.$collection.$className :
            this.$collection.$className;
        const item    = !this.isNew ? `/${this.get(this.idAttribute)}` : "";
        // search  = if (p=$scope.querify @__op).length then "?#{p}" else ''
        // const _preQ  = (this.params != null) ? this.params : "?";
        // const _query = $scope.querify(this.__op);
        const search = ""; // _query.length ? `${_preQ}&${_query}` : _preQ;
        let _url =  `${base}/${ref}${item}${search}`;
        console.log(_url);
        return _url;
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
        let _req = {
            method: this.$scope.options.CRUD_METHODS.create,
            id: uniqueid(`${this.$collectionName}-create-`),
        };
        _requests.set(this, _req);
        return this.$scope.sync(_req.method, this, {}).then((res) => {
            // this.data = res;
            console.log(`res: ${JSON.stringify(res)}`);
            _requests.delete(this);
        })
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

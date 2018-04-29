import {RxVO} from "rxvo";
import MetaData from "./metadata";
import {_cids, _requests} from "./_references";
import uniqueid from "lodash.uniqueid";

const _modelRefs = new WeakMap();

export default class {
    constructor(collection) {
        setTimeout(() => {
            const _mdRef = new MetaData(this);
            Object.defineProperty(this, "$metadata", {
                get: () => _mdRef,
                enumerable: false,
            });
        }, 0);
    }

    //
    // Accessor Methods
    //

    /**
     * retrieves ID of record if set
     * @returns {string|number|UUID|null}
     */
    get id() {
        return this.data["id"] || null;
    }

    /**
     * sets ID of record
     * @param value {string|number|UUID|null}
     */
    set id(value) {
        this.data["id"] = value;
        return this;
    }

    /**
     * returns data from RxVO Document
     * @returns {*}
     */
    get data() {
        return _cids.get(this.$collection)[this.$cid];
    }

    /**
     * sets data to RxVO Document
     * @param d
     */
    set data(d) {
        // this.data.$model.model = d;
        // let _rxvo = new RxVO(this.$collection.$schema.properties);
        // _rxvo.model = d;
        _cids.get(this.$collection)[this.$cid].$model.model = d;
        // this.data = d;
        return this;
    }

    // /**
    //  * alias for data getter
    //  * @returns {*}
    //  */
    // get attrs() {
    //     return this.data;
    // }
    //
    // /**
    //  * alias for data setter
    //  * @param d
    //  * @returns {*}
    //  */
    // set attrs(d) {
    //     return this.data = d;
    // }
    //
    // /**
    //  * retrieves data at key
    //  * @param key
    //  */
    // get(key) {
    //     return this.data.$model.get(key);
    // }
    //
    // /**
    //  * sets value upon key
    //  * @param key
    //  * @param val
    //  */
    // set(key, val) {
    //     this.data.$model.set(key, val);
    //     return this;
    // }

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
        // return this.data.$model.subscribe(handler);
    }

    //
    // Validation Methods
    //

    /**
     * @returns {boolean|string}
     */
    validate() {
        return this.data.$model.validate();
    }

    /**
     *
     * @returns {boolean}
     */
    get isValid() {
        return _cids.get(this.$collection)[this.$cid].$model.isValid;
    }

    get isNew() {
        return (!("id" in this.data));
    }

    get isDirty() {
        return !this.isNew;
    }

    /**
     *
     * @returns {string}
     */
    get url() {
        const base = this.$scope.$utils.apiUrl;
        // TODO: work out classname casing/transform
        const ref = !this.$scope.options.CAPITALIZE_CLASSNAMES ?
            this.$collection.$className :
            this.$collection.$className;
        const item = !this.isNew ? `/${this.id}` : "";
        // search  = if (p=$scope.querify @__op).length then "?#{p}" else ''
        // const _preQ  = (this.params != null) ? this.params : "?";
        // const _query = $scope.querify(this.__op);
        const search = ""; // _query.length ? `${_preQ}&${_query}` : _preQ;
        let _url = `${base}/${ref}${item}${search}`;
        return _url;
    }

    //
    // REST Life-Cycle
    //

    /**
     *
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>|{$ref}}
     */
    fetch(id = null) {
        let _req = {
            method: this.$scope.options.CRUD_METHODS.read,
            id: uniqueid(`${this.$collectionName}-read-`),
        };

        if (id !== null) {
            this.id = id;
        }

        _requests.set(this, _req);

        return this.$scope.sync(_req.method, this, {}).then((res) => {
            this.data = res.body;
            _requests.delete(this);
        });
    }

    /**
     *
     */
    save() {
        let _method = !this.isNew && this.isDirty ?
            this.$scope.options.CRUD_METHODS.update :
            this.$scope.options.CRUD_METHODS.create;
        let _req = {
            method: _method,
            id: uniqueid(`${this.$collectionName}-create-`),
        };
        _requests.set(this, _req);
        return this.$scope.sync(_req.method, this, {body: `${this.data.$model}`}).then((res) => {
            if (res.body) {
                this.data = res.body;
            }
            _requests.delete(this);
        });
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
    // toString() {
    //     return JSON.stringify(this.data);
    // }

    /**
     * @returns {JSON}
     */
    toJSON() {
        // return _cids.get(this.$collection)[this.$cid];
    }
}

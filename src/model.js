import {JSD} from "jsd";

const _modelRefs = new WeakMap();

export default class {
    constructor(attrs, opts = {}) {
        _modelRefs.set(this, new JSD(this.$schema));
    }

    /**
     *
     */
    get() {
        return _modelRefs.get(this).document.model;
    }

    /**
     *
     * @param data
     */
    set(data) {
        _modelRefs.get(this).document.model = data;
        return this;
    }

    /**
     *
     * @param handler
     */
    subscribe(handler) {
        return _modelRefs.get(this).document.subscribe(handler);
    }

    /**
     * @returns {boolean|string}
     */
    validate() {
        return _modelRefs.get(this).document.validate();
    }

    /**
     *
     * @returns {boolean}
     */
    get isValid() {
        return _modelRefs.get(this).document.isValid();
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

    /**
     *
     */
    sync() {

    }
}

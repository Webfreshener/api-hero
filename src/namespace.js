import {JSD} from "jsd";
import map from "lodash.map";
import pairs from "lodash.pairs";
import foreach from "lodash.foreach";
import "cross-fetch/polyfill";
import {_namespaces, _nsCollections} from "./_references";
import Collection from "./collection";
import ns_schema from "./ns_schema";

/**
 * Namespace
 * * Defines and Manages Collections
 * * Initializes Options
 * * Provides utility methods
 */
class NS {
    /**
     * @constructor
     * @param config
     */
    constructor(config) {
        const _schema = new JSD(ns_schema);
        _schema.document.model = config;
        _namespaces.set(this, _schema);
        let _cols = {};
        const _self = this;
        // defines utilies reference on Namespace
        Object.defineProperty(this, "$utils", {
            value: new Utils(this),
            enumerable: false,
            writable: false,
        });

        let o = {};
        // iterates through collections on Schema and defined Collections on NS
        Object.keys(_schema.document.model.collections).forEach((col) => {
            o[col] = class extends Collection {
                constructor() {
                    super(_schema.document.model.collections[col]);
                    // defines className reference on Collection
                    Object.defineProperty(this, "$className", {
                        get: () => col,
                        enumerable: false,
                    });
                    // defines Namespace reference on Collection
                    Object.defineProperty(this, "$scope", {
                        get: () => _self,
                        enumerable: false,
                    });
                }
            };
            // applies Collection instance to Namespace
            this.addCollection(col, o[col]);
        });

        _nsCollections.set(this, _cols);
    }

    /**
     * Accessor for defined API Options for Namespace
     * @returns {*}
     */
    get options() {
        return _namespaces.get(this).document.model.options;
    }

    /**
     * Setter for Namespace API Options
     * @param value
     * @returns {NS}
     */
    set options(value) {
        _namespaces.get(this).document.model.options = value;
        return this;
    }

    /**
     * Accessor for Option at Key
     * @param key
     */
    getOption(key) {
        return _namespaces.get(this).document.model.options[key];
    }

    /**
     * Sets individual Option at Key
     * @param key
     * @param value
     * @returns {NS}
     */
    setOption(key, value) {
        _namespaces.get(this).document.model.options[key] = value;
        return this;
    }

    /**
     * Accessor for Schema Collections Map
     * @returns {*}
     */
    get collections() {
        return _nsCollections.get(this);
    }

    /**
     * Retrieved list of registered Collection names
     * @returns {string[]}
     */
    listCollections() {
        return Object.keys(_namespaces.get(this));
    }

    /**
     * Adds Collection to Namespace
     * @param name
     * @param col
     * @returns {NS}
     */
    addCollection(name, col) {
        if (!this.hasOwnProperty(name)) {
            Object.defineProperty(this, name, {
                get: () => {
                    let _s = _namespaces.get(this).document;
                    return new col(_s.model.collections[name]);
                },
                enumerable: true,
            });
        }
        return this;
    }

    /**
     * Removes Collection from Namespace
     * @param name
     * @returns {NS}
     */
    removeCollection(name) {
        if (_namespaces.get(this).hasOwnProperty(name)) {
            Object.defineProperty(_namespaces.get(this), name, {
                get: () => null,
                writable: false,
            });
        }
        return this;
    }

    sync(method, model, options = {}) {
        let opts = this.$utils.apiOptions;
        Object.assign(opts, {method: method});
        return fetch(model.url, opts).then((res) => {
            return res.json();
        });
    }
}

/**
 * Utility Methods
 */
class Utils {
    /**
     *
     * @param $scope
     */
    constructor($scope) {
        Object.defineProperty(this, "$scope", {
            get: () => $scope,
            enumerable: false,
        });
    }

    /**
     * Helper Method returns REST Request Headers from Config
     * @returns {*}
     */
    get apiOptions() {
        let o;
        (o = {
                contentType: "application/json",
                processData: false,
                dataType: "json",
                data: null,
                headers: {
                    "Content-Type": "application/json",
                    "X-Application-Id": this.$scope.options.APP_ID || null,
                    "X-REST-API-Key": this.$scope.options.REST_KEY || null,
                    "X-CSRF-Token": this.$scope.options.CSRF_TOKEN || null,
                    "X-User-Email": this.$scope.options.USER_EMAIL || null,
                },
            }
        );

        if (this.$scope.options.SESSION_KEY) {
            o.headers[this.$scope.options.SESSION_KEY] = this.$scope.options.SESSION_TOKEN;
        }

        return o;
    }

    /**
     * Helper Method generates URL for REST Requests
     * @returns {string}
     */
    get apiUrl() {
        const _pcl = this.$scope.options.PROTOCOL.toLowerCase();
        const _host = this.$scope.options.HOST;
        const _port = this.$scope.options.PORT;
        const _path = this.$scope.options.BASE_PATH.replace(/^\//, "");
        const _vers = this.$scope.options.API_VERSION;
        return `${_pcl}://${_host}${_port !== 80 ? `:${_port}` : ""}/${_path}/${_vers}`;
    }

    /**
     *
     * @param route
     * @returns {boolean}
     */
    validateRoute(route) {
        const Rx = `^(${this.$scope.regEscape(this.getAPIUrl())}\/)+`;
        // throws error if route does not pass validation
        if (!route.match(new RegExp(Rx))) {
            throw `Bad route: ${route}`;
        }
        // returns true if no error thrown
        return true;
    }

    /**
     * Implementation of Parse._parseDate used to parse iso8601 UTC formatted `datetime`
     * @param iso8601
     * @returns {*}
     */
    parseDate(iso8601) {
        // returns null if `iso8601` argument fails `RegExp`
        let t;
        let Rx = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
        if ((t = `${iso8601}`.match(Rx)) === null) {
            return null;
        }
        t = t.map((i) => i && i.match(/^[\d]+$/) !== null ? parseInt(i, 10) : null)
            .filter((i) => i !== null);
        t[1] = t[1] - 1;
        return new Date(Date.UTC.apply(this, t));
    }

    /**
     * Returns passes object as Key/Value paired string
     * @param obj
     * @returns {string}
     */
    querify(obj) {
        return (map(pairs(obj || {}), (v, k) => v.join("="))).join("&");
    }
}

/**
 *
 * @param config - JSON Config file (see: [defaults.js](./file/src/defaults.js.html))
 * @returns {NS}
 */
export default (config) => {
    return new NS(config);
}
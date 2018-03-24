import {_namespaces, _nsCollections} from "./_references";
import ns_schema from "./ns_schema";
import map from "lodash.map";
import pairs from "lodash.pairs";
import {JSD} from "jsd";
import Collection from "./collection";
/**
 *
 */
class NS {
    /**
     *
     * @param name
     * @param config
     */
    constructor(config) {
        const _schema = new JSD(ns_schema);
        _schema.document.model = config;
        _namespaces.set(this, _schema);
        let _cols = {};
        const _self = this;

        Object.defineProperty(this, "$utils", {
            value: new Utils(this),
            enumerable: false,
            writable: false,
        });

        let o = {};
        Object.keys(_schema.document.model.collections).forEach((col) => {
            o[col] = class extends Collection {
                constructor() {
                    super([], _schema.document.model.collections[col].properties);
                    Object.defineProperty(this, "$className", {
                        get: () => col,
                        enumerable: false,
                    });
                    Object.defineProperty(this, "$scope", {
                        get: () => _self,
                        enumerable: false,
                    });
                    Object.defineProperty(this, "$schema", {
                        get: () => _schema.document.model.collections[col],
                        enumerable: false,
                    });
                }
            };
            this.addCollection(col, o[col]);
        });

        _nsCollections.set(this, _cols);
    }

    /**
     *
     */
    get options() {
        return _namespaces.get(this).document.model.options;
    }

    /**
     *
     * @param value
     * @returns {NS}
     */
    set options(value) {
        _namespaces.get(this).document.model.options = value;
        return this;
    }

    /**
     *
     * @param key
     */
    getOption(key) {
        return _namespaces.get(this).document.model.options[key];
    }

    /**
     *
     * @param key
     * @param value
     * @returns {NS}
     */
    setOption(key, value) {
        _namespaces.get(this).document.model.options[key] = value;
        return this;
    }

    /**
     *
     */
    get collections() {
        return _nsCollections.get(this);
    }

    listCollections() {
        return Object.keys(_namespaces.get(this));
    }

    /**
     *
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
     *
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


};

class Utils {
    constructor($scope) {
        Object.defineProperty(this, "$scope", {
            get: () => $scope,
            enumerable: false,
        });
    }
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
     *
     * @returns {string}
     */
    get apiUrl() {
        const _pcl  = this.$scope.options.PROTOCOL.toLowerCase();
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
        t = t.map((i) =>  i && i.match(/^[\d]+$/) !== null ? parseInt(i, 10) : null )
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

export default (config) => {
    return new NS(config);
};
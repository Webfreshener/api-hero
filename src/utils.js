import pairs from "lodash.pairs";
import map from "lodash.map";
import deepEqual from "deep-equal";
import uniqWith from "lodash.uniqwith";
import uniqueid from "lodash.uniqueid";

/**
 * Utility Methods
 */
export class Utils {
    /**
     *
     * @param $scope
     */
    constructor($scope) {
        Object.defineProperty(this, "$scope", {
            get: () => $scope,
            enumerable: false,
            configurable: false,
        });
    }

    /**
     * Helper Method returns REST Request Headers from Config
     * @returns {*}
     */
    get apiOptions() {
        let o;
        // TODO: Clean this up
        o = {
            contentType: "application/json",
            // processData: false,
            dataType: "json",
            // data: null,
            headers: {
                "Content-Type": "application/json",
                // "X-Application-Id": this.$scope.options.APP_ID || null,
                // "X-REST-API-Key": this.$scope.options.REST_KEY || null,
                // "X-CSRF-Token": this.$scope.options.CSRF_TOKEN || null,
                // "X-User-Email": this.$scope.options.USER_EMAIL || null,
            },
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        };

        return o;
    }

    /**
     * Returns true if polyfill is set on `fetch` function
     * @returns {boolean}
     */
    get isFetchPolyfill() {
        const _env = (global || window);
        return _env.fetch.hasOwnProperty("polyfill");
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

    /**
     * generates unique Request ID
     * @param target
     * @param type
     * @returns {string}
     */
    createRequestId(target, type) {
        return uniqueid(`${target.$className}-${type}-`);
    }

    // STATIC METHODS

    /**
     *
     * @param $ref
     * @param schema
     * @returns Object | null
     */
    static getComponent($ref, schema) {
        if (!schema.hasOwnProperty("components")) {
            return null;
        }

        $ref = $ref.replace(/#\/?components\/schemas\//, "");
        return schema.components.schemas.hasOwnProperty($ref) ? schema.components.schemas[$ref] : null;

    };

    static getLookupQuery(model) {

    }

    /**
     * TODO: remove if defunct/unused
     * @param model
     * @param collection
     * @private
     */
    static createReference(model, collection) {
        const _ref = collection.createModelRef();
        return new _ref(model);
    };

    /**
     *
     * @param content
     * @returns {boolean|string|object}
     */
    static getSchemaRef(content) {
        let $ref = false;
        if (content.hasOwnProperty("application/json")) {
            let _sPath = content["application/json"].schema;

            if (_sPath.hasOwnProperty("$ref")) {
                $ref = _sPath.$ref;
            } else if (_sPath.hasOwnProperty("items")) {
                $ref = _sPath.items.$ref;
            } else if (_sPath.hasOwnProperty("properties")) {
                $ref = _sPath;
            }
        }
        return $ref;
    }

    static getRequestParamsSchema(operation) {

    }

    /**
     *
     * @param operation
     * @returns {*}
     */
    static getResponseSchema(operation) {
        const _codes = Object.keys(operation.responses);
        const successRx = new RegExp("^2+[0-9]{2}$");
        const _successCode = _codes.find((code) => successRx.exec(code) !== null);
        if (_successCode) {
             let _res = Utils.getSchemaRef(operation.responses[_successCode].content);
             if (typeof _res === "string") {
                 _res = {$ref: _res};
             }

             return _res;
        }

        return false;
    }

    /**
     * Retrieves schema or schema ref for operation request
     *
     * @param operation
     * @returns {*}
     */
    static getRequestSchema(operation) {
        const _pVals = ["requestBody", "content", "application/json", "schema"];
        let _schema = operation;
        _pVals.forEach((val) => {
            try {
                _schema = _schema[val];
            } catch (e) {
                _schema = null;
                throw new Error(e);
            }
        });

        return _schema;
    }

    /**
     * Attempts to derive model schema from element
     *
     * @param elPath
     * @returns {*}
     * @private
     */
    static derivefromElement(elPath) {
        let $ref = null;
        let _respSchema;
        if (!elPath.hasOwnProperty("operations")) {
            return elPath;
        }

        const _ops = Object.keys(elPath.operations)
            .filter((op) => op.match(/^(get|post)+$/));

        // console.log(`get op: ${JSON.stringify(elPath.operations[_ops[0]], null, 2)}`);

        if (_ops.length > 1) {
            $ref = {anyOf: []};
            _ops.forEach((op) => {
                _respSchema = Utils.getResponseSchema(elPath.operations[op]);
                if (_respSchema !== false) {
                    $ref.anyOf.push(_respSchema);
                }
            });
            $ref.anyOf = uniqWith($ref.anyOf, deepEqual);
        } else {
            $ref = {
                anyOf: [
                    Utils.getResponseSchema(elPath.operations[_ops[0]]),
                ]
            };
        }

        return $ref;
    };

    /**
     * Attempts to derive model schema from GET response
     *
     * @param schema
     * @param scopeSchema
     * @returns {*}
     * @private
     */
    static deriveSchema(schema, scopeSchema) {
        let $ref = Utils.derivefromElement(schema);
        const _rx = new RegExp("^(allOf|anyOf|anyOf)+$");
        if (Object.keys($ref).some((k) => _rx.exec(k) !== null)) {
            return $ref;
        }

        if ($ref !== null) {
            if ((typeof $ref) === "object") {
                return $ref;
            } else {
                schema = Utils.getComponent($ref, scopeSchema);
                if (schema.hasOwnProperty("type") && schema.type === "array") {
                    $ref = schema.items.$ref;
                    schema = Utils.getComponent($ref, scopeSchema);
                }
            }
        }

        return schema;
    };
}

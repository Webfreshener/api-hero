import pairs from "lodash.pairs";
import map from "lodash.map";
import uniqueid from "lodash.uniqueid";
import Collection from "./collection";

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
            // contentType: "application/json",
            // processData: false,
            // dataType: "json",
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

        // if (this.$scope.options.SESSION_KEY) {
        //     o.headers[this.$scope.options.SESSION_KEY] = this.$scope.options.SESSION_TOKEN;
        // }

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
     * Helper Method generates URL for REST Requests
     * @returns {string}
     */
    get apiUrl() {
        const _schemes = this.$scope.schema.schemes;
        const _host = this.$scope.schema.host;
        const _basePath = this.$scope.schema.basePath;
        const _scheme = _schemes.indexOf("https") ? "https" : "http";
        return `${_scheme}://${_host}${_basePath}`;
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

    createRequestId(target, type) {
        return uniqueid(`${target.$className}-${type}-`);
    }

    /**
     *
     * @param $ref
     * @param schema
     * @returns Object | null
     */
    static getDefinition($ref, schema) {
        if (schema.hasOwnProperty("openapi")) {
            if (!schema.hasOwnProperty("components")) {
                return null;
            }
            $ref = $ref.replace(/#\/?components\/schemas\//, "");
            return schema.components.schemas.hasOwnProperty($ref) ? schema.components.schemas[$ref] : null;
        }

        if (schema.hasOwnProperty("swagger")) {
            if (!schema.hasOwnProperty("definitions")) {
                return null;
            }
            $ref = $ref.replace(/#\/?definitions\//, "");
            return schema.definitions.hasOwnProperty($ref) ? schema.definitions[$ref] : null;
        }

        return null;
    };

    /**
     *
     * @param model
     * @param collection
     * @private
     */
    static createReference(model, collection) {
        const _ref = Collection.createModelRef(collection);
        return new _ref(model);
    };

    /**
     * @param elPath
     * @returns {*}
     * @private
     */
    static derivefromElement(elPath) {
        let $ref = null;
        // console.log(`elPath: ${JSON.stringify(elPath, null, 2)}`);
        // console.log(`elPath: ${Object.keys(elPath)}`);
        if (elPath.operations.hasOwnProperty("get")) {
            const _sPath = elPath.operations.get.responses["200"]
                .content["application/json"].schema;
            if (_sPath.hasOwnProperty("$ref")) {
                $ref = _sPath.$ref;
            }

            if (_sPath.hasOwnProperty("items")) {
                $ref = _sPath.items.$ref;
            }
        }

        // if not fetcahble, attempts from POST params
        else if (elPath.operations.hasOwnProperty("post")) {
            $ref = elPath.operations.post.parameters.schema.$ref;
        }

        return $ref;
    };

    /**
     * @param schema
     * @param scopeSchema
     * @returns {*}
     * @private
     */
    static deriveSchema(schema, scopeSchema) {
        // attempts to derive model schema from GET response
        let $ref = Utils.derivefromElement(schema);

        if ($ref !== null) {
            schema = Utils.getDefinition($ref, scopeSchema);
            if (schema.hasOwnProperty("type") && schema.type === "array") {
                $ref = schema.items.$ref;
                schema = Utils.getDefinition($ref, scopeSchema);
            }
        }

        return schema;
    };

    /**
     *
     * @param pathElement
     * @returns {*}
     */
    static reformatV2Response(pathElement) {
        let _element = Object.assign({}, pathElement);
        let _responses = {};
        let _mimeType = "application/json";

        if (_element.hasOwnProperty("produces")) {
            _mimeType =  Array.isArray(_element.produces) ?
                _element.produces[0] :
                _element.produces;

            delete _element.produces;
        }

        Object.keys(_element.responses).forEach((code) => {
            _responses[code] = {
                description: _element.responses[code].description,
                content: {}
            };
            _responses[code].content[_mimeType] = {
                schema: Object.assign({}, _element.responses[code].schema),
            };
        });

        _responses.default = {
            description: "unexpected error",
            content: {}
        };
        _responses.default.content[_mimeType] = {
            schema: {
                type: "object",
                required: [
                    "code",
                    "message"
                ],
                properties: {
                    code: {
                        type: "integer",
                        format: "int32"
                    },
                    message: {
                        type: "string"
                    }
                }
            }
        };

        _element.responses = _responses;
        return _element;
    }
}
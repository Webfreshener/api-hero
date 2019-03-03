import "cross-fetch/polyfill";
import {RestResponse} from "./rest-response";
import {RequestParams} from "./params/request-params";
import {Obj} from "ofs-utils";
import * as inflection from "inflection";
import {default as template} from "url-template";

export class RestRequest {
    /**
     *
     * @param method
     * @param model
     * @param options
     */
    constructor(method, model, options) {
        Object.defineProperty(this, "method", {
            get: () => method,
            enumerable: true,
            configurable: false,
        });

        Object.defineProperty(this, "model", {
            get: () => model,
            enumerable: true,
            configurable: false,
        });

        Object.defineProperty(this, "options", {
            get: () => Object.assign({cookie: {}, headers: {}, path: {}, query: {}}, options),
            enumerable: true,
            configurable: false,
        });

        const _opElement = model.$schema.operations[method.toLowerCase()];

        Object.defineProperty(this, "parameters", {
            value: new RequestParams(model, _opElement.parameters || [], this.options),
            enumerable: true,
            configurable: false,
        });

    }

    /**
     *
     * @returns {*}
     */
    get url() {
        let _query = "";
        if (this.model.hasOwnProperty("url")) {
            return this.model.url;
        }

        const _t = template["parse"](this.model["schemaPath"]);
        const _path = _t.expand(Object.assign({}, this.pathValues));
        const _qParams = this.options.query;
        if (Object.keys(_qParams || {}).length) {
            _query = `?${Obj.objectToQuery(_qParams)}`;
        }

        return `${this.model.$scope.apiUrl}${_path}${_query}`;
    }

    /**
     *
     */
    get pathValues() {
        const __ = {};

        if (this.model["isModel"] && this.model["pathIDKey"] !== null) {
            const _idKey = `${inflection.underscore(this.model.pathIDKey)}`.split("_").pop();
            const _keys = this.parameters.path.propertyNames;
            _keys[_keys.indexOf(this.model.pathIDKey)] = _idKey;
            _keys.forEach((k) => {
                __[k === _idKey ? this.model.pathIDKey : k] = this.model.data[k]
            });
        }

        return __;
    }

    /**
     *
     * @returns {RestResponse}
     */
    exec() {
        let opts = this.model.$scope.$utils.apiOptions;
        const _cookie = Obj.objectToQuery(this.options.cookie).replace("&", ";");
        Object.assign(opts, this.options, this.options.headers, {Cookie: _cookie, method: this.method});

        const _reqObj = {
            request: () => {
                return new Promise((resolve, reject) => {
                    fetch(this.url, opts)
                        .then((d) => resolve(d))
                        .catch((e) => reject(e));
                })
            },
            options: opts,
            follow: (url) => {
                const _model = {
                    url: url,
                    $scope: this.model.$scope,
                    $schema: this.model.$schema,
                };
                delete opts.body;
                return new RestRequest("GET", _model, opts);
            },
        };

        // handle Fetch's Promise and update Rx Subject
        return new RestResponse(_reqObj);
    }
}

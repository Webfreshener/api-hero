import __defaults__ from "./defaults";
import OpenAPIv3 from "./schemas/OpenAPIv3";
import {default as _hero} from "./schemas/api-hero.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import createNS from "./namespace";
import assign from "lodash.assign";
import {RxVO} from "rxvo";

let app;

// holder for all namespace scopes
const __hero = {};

/**
 *
 * @returns {*}
 * @private
 */
const __init = (() => {
    /**
     *
     * @param ns
     * @param config
     * @param rxvo
     * @returns {NS}
     * @private
     */
    const _appLayer = (ns, config, rxvo) => {
        return createNS(assign(__defaults__, config, rxvo));
    };

    /**
     * Creates and returns new Namespace Scope or returns existing one
     * @param ns
     * @param config
     * @param rxvo
     * @returns {*}
     */
    const createScope = (ns, config = {}, rxvo) => {
        if (!__hero.hasOwnProperty(ns)) {
            Object.defineProperty(__hero, ns, {
                value: _appLayer(ns, config, rxvo),
                enumerable: true,
                configurable: false,
            });
        }
        return __hero[ns];
    };

    return app = {
        /**
         * API entry-point to configure Namespace Clients
         * @param config
         * @returns {app}
         */
        init(config) {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3],
                schemas: [_hero],
                options: config.hasOwnProperty("ajvOptions") ? config.ajvOptions : {},
                use: "http://api-hero.webfreshener.com/v1/schema.json#",
            });

            // defines `namespaces` on instance
            Object.defineProperty(__hero, "namespaces", {
                get: () => _rxvo.model["namespaces"]["$model"].toJSON(),
                enumerable: false,
                configurable: false,
            });

            // defines `errors` getter on instance
            Object.defineProperty(__hero, "errors", {
                get: () => _rxvo.errors,
                enumerable: true,
                configurable: false
            });

            _rxvo.model = config;

            // creates immutable addNameSpace method
            Object.defineProperty(__hero, "addNamespace", {
                value: (nsName, schema) => {
                    if (!__hero.hasOwnProperty(nsName)) {
                        _rxvo.model["namespaces"][nsName] = {name: nsName, schema: schema};
                        if (_rxvo.model["namespaces"].hasOwnProperty(nsName)) {
                            createScope(nsName, _rxvo.model["namespaces"][nsName], _rxvo);
                        }
                    }
                    return this;
                },
                enumerable: true,
                configurable: false,
            });

            // creates namespace scopes
            Object.keys(_rxvo.model["namespaces"]).forEach((nsName) => {
                createScope(nsName, _rxvo.model["namespaces"][nsName], _rxvo);
            });

            return __hero;
        },
    };
})();

export {__init as ApiHero};

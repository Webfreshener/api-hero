import __defaults__ from "./defaults";
import createNS from "./namespace";
import assign from "lodash.assign";
import OpenAPIv2 from "./schemas/OpenAPIv2";
import OpenAPIv3 from "./schemas/OpenAPIv3";
import {RxVO} from "rxvo";
import {default as jisty} from "./schemas/jisty.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";

let app;
let $extend = {};
const _local = {};
const _ns = {};
const _scopes = new WeakMap();
/**
 *
 * @returns {*}
 * @private
 */
const __init = (() => {
    /**
     *
     * @param ns
     * @private
     */
    const _appLayer = (ns, config, rxvo) => {
        const nsItm = createNS(assign(__defaults__, config, rxvo));
        return (_ns[ns] = nsItm);
    };
    /**
     *
     * @param ns
     * @param config
     * @returns {*}
     */
    const createScope = (ns, config = {}, rxvo) => {
        if (_ns.hasOwnProperty(ns)) {
            return _ns[ns];
        }

        _ns[ns] = _appLayer(ns, config, rxvo);
        return _ns[ns];
    };

    return app = {
        init(config) {
            const _rxvo = new RxVO({schemas: [jsonSchema, OpenAPIv2, OpenAPIv3, jisty]});
            Object.defineProperty(this, "rxvo", {
                get: () => _rxvo,
            });

            _rxvo.model = config;

            Object.keys(_rxvo.model.namespaces).forEach((nsName) => {
                createScope(nsName, _rxvo.model.namespaces[nsName], _rxvo);
                Object.defineProperty(this, nsName, {
                    get: () => _ns[nsName],
                    enumerable: true,
                });
            });
            return this;
        },
        extend(schema) {
            assign($extend, schema);
        }
    };
})();

export {__init as Jisty};

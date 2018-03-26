import __defaults__ from "./defaults";
import createNS from "./namespace";
import assign from "lodash.assign";

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
    const _appLayer = (ns, config) => {
        const nsItm = createNS(assign(__defaults__, config));
        return (_ns[ns] = nsItm);
    };
    /**
     *
     * @param ns
     * @param config
     * @returns {*}
     */
    const createScope = (ns, config = {}) => {
        if (_ns.hasOwnProperty(ns)) {
            return _ns[ns];
        }

        _ns[ns] = _appLayer(ns, config);
        return _ns[ns];
    };

    return app = {
        init(config) {
            Object.keys(config).forEach((nsName) => {
                createScope(nsName, config[nsName]);
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

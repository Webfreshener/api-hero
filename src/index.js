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
        let type;
        if (ns == null) {
            throw new ReferenceError("Required argument 'ns' was not defined");
        }

        if ((type = typeof ns) !== "string") {
            throw new TypeError(`Namespace required to be type 'String'. Type was '<${type}>'`);
        }

        const nsItm = createNS(assign(__defaults__, config));
        _ns[ns] = nsItm;
        return nsItm;
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

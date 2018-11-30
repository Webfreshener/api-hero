import {BehaviorSubject} from "rxjs/Rx";
import {RxVO} from "rxvo";
import "cross-fetch/polyfill";
import {_modelClassRefs, _namespaces, _nsCollections} from "./_references";
import Collection from "./collection";
import {default as jistySchema, default as Jisty} from "./schemas/jisty.schema";
import {default as nsSchema} from "./schemas/namespace.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {assignTraits} from "./traits";
import {Utils} from "./utils";

const generateCollections = (schema) => {
    const _cols = {};
    Object.keys(schema.model.paths).forEach((path) => {
        const _p = path.match(/^\/([a-zA-Z0-9\-_])[^\/]$/);
        // if (_p !== null &&
        //     _uName.indexOf(_p[1]) > -1) {
        //    _cols[path] = schema.model.paths[path];
        // }
    });

    return _cols;
};

// const initModelRef = (collection) => {
//     try {
//         const _rxvo = new RxVO({
//             schemas: [{
//                 id: "root",
//                 type: "array",
//                 items: Collection.getModelSchema(collection),
//             }],
//         });
//         _models.set(collection, _rxvo);
//     } catch (e) {
//         throw(e);
//     }
// };

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
        const _schema = new RxVO({
            meta: [jsonSchema, jistySchema],
            schemas: [nsSchema],
            use: "http://webfreshener.com/v1/jisty/namespace.json#",
        });

        // todo: remove options from NS Config
        delete config.options;
        _schema.model = (typeof config === "object") ? config : JSON.parse(config);
        _namespaces.set(this, _schema);
        let _cols = {};
        const _self = this;

        // defines utilities reference on Namespace
        Object.defineProperty(this, "$utils", {
            value: new Utils(_self),
            enumerable: false,
            writable: false,
        });

        // defines getter for namespace schema
        Object.defineProperty(this, "schema", {
            get: () => config.schema,
            enumerable: true,
            configurable: false,
        });

        const _p = {};
        // iterates through path items on open-api schema
        Object.keys(_schema.model.schema.paths).forEach((path) => {
            // console.log(`path: ${path}`);
            const _parts = path.split("/");
            const colName = _parts[1];
            let _op = {};

            if (colName && colName.length) {
                Object.keys(_schema.model.schema.paths[path]).forEach((op) => {
                    const _opSchema = _schema.model.schema.paths[path][op];
                    _op[op] = (this.schemaType.type === "openapi") ?
                        _opSchema :
                        Utils.reformatV2Response(_opSchema);
                });

                if (_p.hasOwnProperty(colName)) {
                    const _name = _parts[2] && _parts[2] !== "" ? _parts[2] : "/";
                    Object.defineProperty(_p[colName].modelPaths, _name, {
                        value: _op,
                        configurable: false,
                        enumerable: true,
                    });
                } else {
                    _p[colName] = {
                        name: _parts[1],
                        operations: _op,
                        modelPaths: {}
                    }
                }
            }
        });

        let o = {};
        // iterates through collections on Schema and defined Collections on NS
        Object.keys(_p).forEach((col) => {
            o[col] = class extends Collection {
                constructor() {
                    super(_p[col], _self);
                    // defines className reference on Collection
                    Object.defineProperty(this, "$className", {
                        get: () => col,
                        enumerable: false,
                        configurable: false,
                    });

                    const _ref = Collection.createModelRef(this);
                    _modelClassRefs.set(this, _ref);
                    assignTraits(this);
                }

            };

            // applies Collection Class to Namespace
            this.addCollection(col, o[col]);
        });

        _nsCollections.set(this, o);
    }

    get errors() {
        return _namespaces.get(this).errors;
    }

    /**
     * Accessor for defined API Options for Namespace
     * @returns {*}
     */
    get options() {
        return _namespaces.get(this).model.options;
    }

    /**
     * Getter for Schema type (openapi, swagger etc) and version
     * @returns {type: string, verson: string} | null
     */
    get schemaType() {
        const _schema = _namespaces.get(this);
        let _schemaData = null;
        ["openapi", "swagger"].forEach((type) => {
            if (_schema.model.schema.hasOwnProperty(type)) {
                _schemaData = {
                    type: type,
                    version: _schema.model.schema[type],
                };
            }
        });

        return _schemaData;
    }

    /**
     * Getter for Schema Info Element
     * @returns object | null
     */
    get info() {
        return _schema.model.schema.info || null
    }

    /**
     * Setter for Namespace API Options
     * @param value
     * @returns {NS}
     */
    set options(value) {
        _namespaces.get(this).model.options = value;
        return this;
    }

    /**
     * Accessor for Option at Key
     * @param key
     */
    getOption(key) {
        return _namespaces.get(this).model.options[key];
    }

    /**
     * Sets individual Option at Key
     * @param key
     * @param value
     * @returns {NS}
     */
    setOption(key, value) {
        _namespaces.get(this).model.options[key] = value;
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
        return Object.keys(this.collections);
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
                    let _s = _namespaces.get(this);
                    return new col();
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

    /**
     * Performs HTTP Operations using the Fetch API
     * @param method
     * @param model
     * @param options
     * @returns {BehaviorSubject<any>}
     */
    sync(method, model, options = {}) {
        if (!options.hasOwnProperty("$subj")) {
            const _subj = new BehaviorSubject().skip(1);
            Object.defineProperty(options, "$subj", {
                get: () => _subj,
                enumerable: false,
                configurable: false,
            });
        }
        let opts = this.$utils.apiOptions;
        Object.assign(opts, options, {method: method});
        // sets model as body on POST and PUT requests
        if (method === "POST" || method === "PUT") {
            opts.body = model.toString();
        } else {

        }
        // handle Fetch's Promise and update Rx Subject
        fetch(model.url, opts)
            .then((res) => {
                if (this.$utils.isFetchPolyfill) {
                    const _location = res.headers.get("location");
                    if (_location !== null) {
                        this.sync("GET", {url: _location}, options);
                    } else {
                        options.$subj.next(res);
                    }
                } else {
                    // sends response object to subscriber
                    options.$subj.next(res);
                }
            })
            .catch((e) => {
                // sends error to subscriber
                options.$subj.error(e);
            });

        return options.$subj;
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

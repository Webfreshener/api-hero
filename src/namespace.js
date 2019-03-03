import {RxVO} from "rxvo";
import {_namespaces, _nsElements} from "./_references";
import {createElementClass} from "./ns_element";
import {default as jistySchema} from "./schemas/jisty.schema";
import {default as nsSchema} from "./schemas/namespace.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {Utils} from "./utils";
import {mix} from "../vendor/mixwith";
import {SchemaBuilder} from "./schema-builder";
import {NSOptions} from "./ns-options";

const _builders = new WeakMap();
const NSElementFactory = (ns) => {
    return (name, schema, parent=null) => {
        const NSElement = createElementClass(ns, name, schema, parent);
        const _element = mix(NSElement);
        const traits = NSElement["getTraitAssignments"](ns, schema, parent);
        return class extends _element.with.apply(_element, traits) {
            constructor(__data) {
                super(__data);
            }
        };
    };
};

/**
 * Namespace
 * * Defines and Manages Elements
 * * Initializes Options
 * * Provides utility methods
 */
class NS {
    /**
     * @constructor
     * @param config
     */
    constructor(config={}) {
        const _schema = new RxVO({
            meta: [jsonSchema, jistySchema],
            schemas: [nsSchema],
            use: "http://webfreshener.com/v1/jisty/namespace.json#",
        });

        // retains user options if exists
        const _opts = Object.assign({}, config.options || {});

        // removes user options form namespace config
        if (config.hasOwnProperty("options")) {
            delete config.options;
        }

        const _options = new NSOptions(_opts);

        Object.defineProperty(this, "options", {
            get: () => _options,
            enumerable: false,
            configurable: false,
        });

        _schema.model = (typeof config === "object") ? config : JSON.parse(config);
        _namespaces.set(this, _schema);

        const _self = this;
        const _elFactory = NSElementFactory(_self);

        // defines utilities reference on Namespace
        Object.defineProperty(this, "$utils", {
            value: new Utils(_self),
            enumerable: false,
            writable: false,
        });

        // defines getter for namespace schema
        Object.defineProperty(this, "schema", {
            get: () => _namespaces.get(this).model.schema,
            enumerable: true,
            configurable: false,
        });

        // defines util method to create child element
        Object.defineProperty(this, "createElement", {
            value: _elFactory,
            enumerable: false,
            configurable: false,
        });

        _builders.set(this, new SchemaBuilder(this));

        let o = {};
        // iterates through elements on Schema and defined Elements on NS
        Object.keys(this.schema.paths).forEach((key) => {
            if (key === "/") {
                return;
            }

            if (key.match(/[a-z0-9_\-\s%]+\/+\{[a-z0-9_]+\}$/i) === null) {
                const _pathSchema = this.builder.schemaForPath(key);
                o[_pathSchema.name] = this.createElement(_pathSchema.name, _pathSchema);
                // applies Collection Class to Namespace
                this.addCollection(_pathSchema.name, o[_pathSchema.name]);
            }


        });
        // stores reference to path elements
        _nsElements.set(this, o);
    }

    //
    // GETTERS
    //

    /**
     * Helper Method generates URL for REST Requests
     * @returns {string|null}
     */
    get apiUrl() {
        const _idx = this.options.serverIndex;
        const _params = this.options.serverParameters;
        let _url = null;
        if (this.schema.servers.length >= (_idx - 1)) {
            _url = this.schema.servers[_idx].url || null;

            if (_url !== null && _params.length) {
                _params.forEach((_pO) => {
                    let _rx = new RegExp(`\{${_pO.name}\}+`);
                    _url = _rx.replace(_url, _pO.value);
                });
            }
        }

        return _url;
    }

    /**
     *
     * @returns {*}
     */
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
     * @returns object | null
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
     * Getter for schema builder instance
     * @returns {any}
     */
    get builder() {
        return _builders.get(this);
    }

    /**
     * Getter for Schema Info Element
     * @returns object | null
     */
    get info() {
        return this.schema.info || null
    }

    /**
     * Setter for Namespace API Options
     * @param value
     */
    set options(value) {
        _namespaces.get(this).model.options = value;
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
     * Accessor for Schema Elements Map
     * @returns {*}
     */
    get elements() {
        return _nsElements.get(this);
    }

    /**
     * Retrieved list of registered Collection names
     * @returns {string[]}
     */
    listElements() {
        return Object.keys(this.elements);
    }

    /**
     * Adds Collection to Namespace
     * @param name
     * @param col<NSElement>
     * @returns {NS}
     */
    addCollection(name, col) {
        if (!this.hasOwnProperty(name)) {
            Object.defineProperty(this, name, {
                get: () => {
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
}

/**
 *
 * @param config - JSON Config file (see: [defaults.js](./file/src/defaults.js.html))
 * @returns {NS}
 */
export default (config) => {
    return new NS(config);
}

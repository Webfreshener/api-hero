import {Utils} from "./utils";
const _namespaces = new WeakMap();

export class SchemaBuilder {
    constructor(ns) {
        _namespaces.set(this, ns);
    }

    /**
     *
     * @returns {any}
     */
    get namespace() {
        return _namespaces.get(this);
    }

    /**
     *
     * @param schemaPathElement
     */
    getOperations(schemaPathElement) {
        const _ops = {};
        const _s = (this.namespace.schemaType.type === "openapi") ?
            schemaPathElement : schemaPathElement.operations;
        Object.keys(_s).forEach((op) => {
            const _opSchema = _s[op];
            _ops[op] = (this.namespace.schemaType.type === "openapi") ?
                _opSchema :
                Utils.reformatV2Response(_s[op]);
        });

        return _ops;
    };



    /**
     *
     * @param forPath
     */
    schemaForPath(forPath) {
        const _schema = this.namespace.schema.$model.toJSON();

        const _rx = new RegExp(`^${forPath}+`);
        const _p = {};
        let elName;

        // creates a sorted array of matching paths/subpaths
        const _pKeys = Object.keys(_schema.paths).filter((pK) => _rx.exec(pK) !== null);
        _pKeys.sort();

        // traverses paths to build schema object
        _pKeys.forEach((path) => {
            elName = forPath.split("/").pop();
            const _parts = path.split("/");
            const _op = this.getOperations({operations: _schema.paths[path]});
            if (path === forPath) {
                _p[elName] = {
                    name: elName,
                    operations: _op.hasOwnProperty("operations") ? _op.operations : {},
                    path: path,
                    components: this.namespace.schema.components,
                    childPaths: {}
                }
            } else {
                if (`${_parts}` !== "") {
                    const _mPathName = path.split("/").pop();
                    if (!_p[elName].childPaths.hasOwnProperty(_mPathName)) {
                        Object.defineProperty(_p[elName].childPaths, _mPathName, {
                            value: Object.assign({}, {name: _mPathName, path: path}, _op),
                            configurable: false,
                            enumerable: true,
                        });
                    }
                }
            }
        });
        return _p.hasOwnProperty(elName) ? _p[elName] : {};
    }
}

import {_cids, _modelStats, _subjects, _traits} from "./_references";
import {RxVO} from "rxvo";
import {Utils} from "./utils";
import {CreatableTrait} from "./traits/creatable.trait";
import {ListableTrait} from "./traits/listable.trait";
import {FetchableTrait} from "./traits/fetchable.trait";
import {UpdatableTrait} from "./traits/updatable.trait";
import {DeletableTrait} from "./traits/deletable.trait";
import {PatchableTrait} from "./traits/patchable.trait";
import {AccessibleTrait} from "./traits/accessible.trait";
import {SavableTrait} from "./traits/savable.trait";
import {CollectionMixin, ModelMixin} from "./mixins";
import {BehaviorSubject} from "rxjs";
import * as inflection from "inflection";

const _traitMap = {
    get: [FetchableTrait, ListableTrait],
    post: CreatableTrait,
    put: UpdatableTrait,
    patch: PatchableTrait,
    options: AccessibleTrait,
    delete: DeletableTrait,
};
/**
 *
 * @param schema
 * @returns {*}
 */
const getRefDefType = (scope, schema) => {
    let refDef;
    let _refDefType;
    const _content = schema.operations.get.responses["200"].content["application/json"].schema;

    if (_content.hasOwnProperty("$ref")) {
        refDef = Utils.getComponent(_content.$ref, scope.schema);
    } else {
        refDef = _content;
    }

    if ((_refDefType = refDef.type) === void (0)) {
        const _type = Object.keys(refDef)[0];
        // if (["allOf", "anyOf", "oneOf"].indexOf(_type) >= 0) {
        _refDefType = "object";
        // }
    }
    return _refDefType;
};

const createElementClass = (_scope, _name, _schema, _parent = null) => {
    return class {
        constructor() {
            _traits.set(this, []);
            _cids.set(this, {});
            _modelStats.set(this, {isDirty: false, isNew: false});
            _subjects.set(this, new BehaviorSubject().skip(1));

            /**
             * FINAL Methods & Properties
             */

            // defines schema getter on Collection
            Object.defineProperty(this, "$schema", {
                get: () => _schema,
                enumerable: false,
                configurable: false,
            });

            Object.defineProperty(this, "$className", {
                get: () => {
                    const __ = `${_name}${this.isModel && (_name.match(/.*Model+$/) === null) ? "Model" : ""}`;
                    return inflection.camelize(__);
                    },
                enumerable: false,
                configurable: false,
            });

            // defines namespace reference as $scope
            Object.defineProperty(this, "$scope", {
                get: () => _scope,
                enumerable: true,
                configurable: false,
            });

            // defines namespace reference as $scope
            Object.defineProperty(this, "$parent", {
                get: () => _parent,
                enumerable: true,
                configurable: false,
            });

            Object.defineProperty(this, "getChildSchema", {
                value: (forPath) => {
                    return this["$scope"].builder.schemaForPath(forPath);
                }
            });

            Object.defineProperty(this, "createModelRef", {
                value: (_data) => {
                    // regexp to match model path item
                    const _pathRx = new RegExp(`^${this.modelPath}\/\{[a-zA-Z0-9_]{1,}\}$`);
                    // finds child path for model in paths object
                    const _childPath = this.childPaths.find(p => _pathRx.exec(p) !== null);
                    // collection schema
                    const _cSchema = this.getChildSchema(_childPath);
                    // model item schema
                    const _modelSchema = Utils.deriveSchema(_cSchema, this.$scope.schema);
                    // model class
                    const _elRef = this.$scope.createElement(this.$className, _cSchema, this);
                    // returns instance of model class
                    return new _elRef(_data);
                },
                enumerable: false,
                configurable: false,
            })
        }

        /**
         *
         * @param handlers
         * @returns {*}
         */
        subscribe(handlers) {
            return _subjects.get(this).subscribe(handlers);
        }

        get childPaths() {
            const _cPaths = this["$schema"].childPaths;
            return Object.keys(_cPaths).map(cKey => _cPaths[cKey].path);
        }

        get modelPath() {
            return `${this["$schema"].path}`;
        }

        get schemaPath() {
            const _ownerPath = this["$owner"] && this["$owner"] !== null ? this["$owner"]["schemaPath"] : "";
            return `${_ownerPath}${this.modelPath}`;
        }

        /**
         *
         * @param {string} traitName
         * @returns {boolean}
         */
        hasTrait(traitName) {
            return this.traits.indexOf(traitName) > -1;
        }

        /**
         *
         * @returns {string[]}
         */
        get traits() {
            return _traits.get(this);
        }

        /**
         *
         * @returns {boolean}
         */
        get hasParent() {
            return this.$parent !== null
        }

        /**
         * todo: implement this
         */
        get pathParams() {

        }

        /**
         * todo: implement this
         */
        get queryParams() {
            console.log(this.$schema);
        }

        /**
         * returns true if element has Accessible Trait
         * @returns {boolean}
         */
        get isAccessible() {
            return this.traits.indexOf(AccessibleTrait.Name) > -1;
        }

        /**
         * returns true if element has Creatable Trait
         * @returns {boolean}
         */
        get isCreatable() {
            return this.traits.indexOf(CreatableTrait.Name) > -1;
        }

        /**
         * returns true if element has Deletable Trait
         * @returns {boolean}
         */
        get isDeletable() {
            return this.traits.indexOf(DeletableTrait.Name) > -1;
        }

        /**
         * returns true if element has Fetchable Trait
         * @returns {boolean}
         */
        get isFetchable() {
            return this.traits.indexOf(FetchableTrait.Name) > -1;
        }

        /**
         * returns true if element has Listable Trait
         * @returns {boolean}
         */
        get isListable() {
            return this.traits.indexOf(ListableTrait.Name) > -1;
        }

        /**
         * returns true if element has Savable Trait
         * @returns {boolean}
         */
        get isSavable() {
            return this.traits.indexOf(SavableTrait.Name) > -1;
        }

        /**
         * returns true if element has Updatable Trait
         * @returns {boolean}
         */
        get isUpdatable() {
            return this.traits.indexOf(UpdatableTrait.Name) > -1;
        }

        /**
         * returns true if element has Collection Mixin
         * @returns {boolean}
         */
        get isCollection() {
            return this.traits.indexOf(CollectionMixin.Name) > -1;
        }

        /**
         * returns true if element has Model Mixin
         * @returns {boolean}
         */
        get isModel() {
            return this.traits.indexOf(ModelMixin.Name) > -1;
        }

        /**
         * returns path key for id lookup key
         * @returns string|null
         */
        get pathIDKey() {
            if (!this.isModel) {
                return null;
            }
            const _matched = this.schemaPath.match(/[a-z0-9_%\/]*\/+\{+([a-z0-9_]*)\}+$/i);
            return _matched !== null ? _matched[1] : null
        }

        /**
         *
         * @param scope
         * @param schema
         * @param parent
         * @returns {Array}
         */
        static getTraitAssignments(scope, schema, parent) {
            if (parent !== null &&
                !schema.operations.hasOwnProperty("post")) {
                if (parent.$schema.operations.hasOwnProperty("post")) {
                    schema.operations.post = parent.$schema.operations.post;
                }
            }
            const traits = [];
            let _addedSavable = false;
            Object.keys(schema.operations).forEach((key) => {
                if (key === "get") {
                    if (schema.operations.get.hasOwnProperty("responses")
                        && schema.operations.get.responses.hasOwnProperty("200")) {
                        const _refDefType = getRefDefType(scope, schema);
                        switch (_refDefType) {
                            case "object":
                                traits.push(_traitMap.get[0]);
                                break;
                            case "array":
                                traits.push(_traitMap.get[0]);
                                traits.push(ListableTrait);
                                break;
                            default:
                                throw `Invalid Response Type for ${key}`;
                                break;
                        }
                    }
                } else {
                    // Adds Savable Dependency to Create and Edit Methods
                    // TODO: investigate adding Dependency directly onto MIXIN class
                    if ((key.match(/^(post|put|patch)+$/) !== null) && !_addedSavable) {
                        traits.push(SavableTrait);
                        _addedSavable = true;
                    }
                    const _t = _traitMap[key];

                    if (_t && _t !== null) {
                        traits.push(_t);
                    }

                }
            });
            const _names = traits.map((t) => t.Name);
            if (traits.length) {
                // tests for ListableTrait
                if (_names.indexOf(ListableTrait.Name) >= 0) {
                    traits.push(CollectionMixin);
                } else {
                    traits.push(ModelMixin);
                }
            }

            return traits;
        };

        static get $scope() {
            return _scope;
        }

        static get $schema() {
            return _schema;
        }

        static get $className() {
            return _name;
        }
    };
};

export {createElementClass};

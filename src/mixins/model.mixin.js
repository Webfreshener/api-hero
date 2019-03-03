import uniqueid from "lodash.uniqueid";
import deepEqual from "deep-equal";
import {_cids, _modelRefs, _subjects, _traits} from "../_references";
import {Utils} from "../utils";
import {RxVO} from "rxvo";
import {Str} from "ofs-utils";
import {default as jsonSchema} from "../schemas/json-schema-draft04";

const _modelSchemas = new WeakMap();
const _stateRefs = new WeakMap();
const _modelStats = new WeakMap();

/**
 *
 * @param model
 * @param state
 */
const setState = (model, state) => {
    const _states = _stateRefs.get(model);
    const _isInitial = isInitialState(model);
    const isEqual = deepEqual(getLastState(model), state);
    if (model.data.hasOwnProperty(model.idKey) && model.data[model.idKey]) {
        _modelStats.get(model).isNew = false;
    }

    _modelStats.get(model).isDirty = !_modelStats.get(model).isNew && (!_isInitial && !isEqual);
    _states.splice(_states.length - 1, 0, state);

    if (_states.length > 2) {
        _states.shift();
    }
};

/**
 *
 * @param model
 * @returns {*|{}}
 */
const getLastState = (model) => {
    const _states = [].concat(_stateRefs.get(this));
    return _states[_states.length - 1] || {};
};

/**
 *
 * @param model
 * @returns {boolean}
 */
const isInitialState = (model) => {
    return [].concat(_stateRefs.get(model)).length === 1;
};

/**
 *
 * @param superclass
 * @param collection
 * @returns Class<ModelMixin>
 */
const mixin = (superclass) => {
    return class extends superclass {
        constructor(__data={}) {
            super();
            let $cid = uniqueid(Str.capitalize(this.$className)).toUpperCase();
            Object.defineProperty(this, "$cid", {
                value: $cid,
                enumerable: false,
                configurable: false,
            });

            if (this.$parent !== null) {
                _cids.get(this.$parent)[this.$cid] = this;
            }

            const _derived = Utils.deriveSchema(this.$schema, this.$scope.schema);
            let _rSchema = null;

            if (this.hasParent && this.$parent.isCreatable) {
                _rSchema = Utils.getRequestSchema(this.$parent.$schema.operations.post);
            } else {
                if (this.isCreatable) {
                    _rSchema = Utils.getRequestSchema(this.$schema.operations.post);
                }
            }

            if (_rSchema !== null) {
                _derived.anyOf.push(_rSchema);
            }

            const _base = {
                $id: `${this.$className}Schema#`,
                components: this.$scope.schema.components,
            };

            const _ajvSchema = Object.assign(_base, _derived);

            delete _ajvSchema.type;

            _stateRefs.set(this, [{}]);

            // creates RxVO and subscribes to observables on root
            try {
                const _rxvo = new RxVO({
                    meta: [jsonSchema],
                    schemas: [this.$scope.schema, _ajvSchema],
                    use: `${this.$className}Schema#`
                }, {
                    ajvOptions: {
                        removeAdditional: "all",
                    }
                });
                _rxvo.subscribe({
                    next: (d) => {
                        _modelStats.set(this, {
                            isNew: !this.data.hasOwnProperty(this.idKey) && !this.data[this.idKey],
                            isDirty: !this.data.hasOwnProperty(this.idKey) && !this.data[this.idKey],
                            isUpdating: _rxvo.model["$model"].isDirty,
                        });

                        setState(this, d.toJSON());
                        _subjects.get(this).next(d);
                    },
                    error: (e) => {
                        _subjects.get(this).error(e);
                    },
                    complete: () => {
                        _subjects.get(this).complete();
                    }
                });

                // stores RxVO ref to WeakMap
                _modelRefs.set(this, _rxvo);

                // stored ajvSchema to WeakMap
                _modelSchemas.set(this, _ajvSchema);

                this.data = __data;
                _modelStats.set(this, {
                    isNew: !this.data.hasOwnProperty(this.idKey) && !this.data[this.idKey],
                    isDirty: !this.data.hasOwnProperty(this.idKey) && !this.data[this.idKey],
                    isUpdating: _rxvo.model["$model"].isDirty,
                });

            } catch (e) {
                return false;
            }

            _traits.get(this).push(mixin.Name);
        }

        //
        // Accessor Methods
        //

        /**
         * retrieves ID of record if set
         * @returns {string|number|null}
         */
        get id() {
            return this.data[this.idKey] || null;
        }

        /**
         *
         * @returns {}
         */
        get data() {
            return _modelRefs.get(this).model;
        }

        /**
         * sets data to RxVO Document
         * @param d
         */
        set data(d) {
            _modelRefs.get(this).model = d;
        }

        get modelSchema() {
            return Object.assign({}, _modelSchemas.get(this));
        }

        //
        // MetaData Accessors
        //

        /**
         * returns creation time of Model in Application
         * @returns {*}
         */
        get modelCreatedOn() {
            return this.$metadata.createdOn;
        }

        /**
         * returns last updated time of Model in Application
         * @returns {null|*}
         */
        get modelUpdatedOn() {
            return this.$metadata.updatedOn;
        }

        //
        // Validation Methods
        //

        /**
         * Tests value for validation without setting value to Model
         * @returns {boolean|string}
         */
        validate(data) {
            return this.data.$model.validate(data);
        }

        /**
         * Returns JSON-Schema validation errors
         */
        get errors() {
            return this.data["$model"].rxvo.errors;
        }

        /**
         * Returns true if model has Validation errors
         * @returns {boolean}
         */
        get isValid() {
            return this.errors === null;
        }

        /**
         * returns true if Model is incomplete
         * @returns {boolean|*}
         */
        get isNew() {
            return !this.data.hasOwnProperty(this.idKey) && _modelStats.get(this).isNew;
        }

        /**
         * returns true if Model has been updated since last validation
         * @returns {boolean}
         */
        get isDirty() {
            const _states = [].concat(_stateRefs.get(this));
            return _states.length && !deepEqual(_states.pop() || {}, this.toJSON());
        }

        // -- NS_ELEMENT Overides

        /**
         * overrides ns_element `isCollection`
         *
         * @returns {boolean}
         */
        get isCollection() {
            return false
        }

        /**
         * overrides ns_element `isModel`
         *
         * @returns {boolean}
         */
        get isModel() {
            return true;
        }

        /**
         * returns idAttribute from namespace options
         * @returns {string}
         */
        get idKey() {
            return "id"; // this.$scope.options.idKey;
        }

        /**
         * returns model's JSON data
         * @returns {*}
         */
        toJSON() {
            return _modelRefs.get(this).toJSON();
        }

        /**
         * returns model's JSON data as string
         * @returns {string}
         */
        toString() {
            return JSON.stringify(this.toJSON());
        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(mixin, "Name", {
    get: () => "ModelMixin",
    enumerable: true,
    configurable: false,
});
export {mixin as ModelMixin};

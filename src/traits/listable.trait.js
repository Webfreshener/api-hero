import {_traits, _models} from "../_references";
import foreach from "lodash.foreach";
import {FetchableTrait} from "./fetchable.trait";
import {CollectionProxy} from "../collection-proxy";

/**
 *
 * @param superclass
 * @returns Class<Trait>
 */
const trait = (superclass) => {
    return class extends superclass {
        constructor() {
            super();
            if (!this["isFetchable"]) {
                throw(`${trait.Name} requires ${FetchableTrait.Name}`);
            }

            _models.set(this, CollectionProxy.create(this));

            // defines getter/setter for models
            Object.defineProperty(this, "models", {
                get: () => _models.get(this),
                set: (data) => this.setModels(data),
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, "length", {
                get: () => this.models.length,
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(_traits.get(this), trait.Name, {
                get: () => this,
                enumerable: true,
                configurable: false,
            });

            _traits.get(this).push(trait.Name);
        }

        /**
         *
         * @returns {*}
         */
        getModels() {
            return _models.get(this);
        }

        /**
         *
         * @param data
         * @returns {Collection}
         */
        setModels(data) {
            if (!Array.isArray(data)) {
                throw "setModels requires array";
            }
            foreach(data, m => this.add(m));
            return this;
        }

        /**
         * Adds Object to Model without updating remote collection
         * @param data
         * @returns {Collection}
         */
        add(data) {
            const _model = this["createModelRef"](data);
            if (!_model.errors || _model.errors === null) {
                this.models.push(_model);
            }

            return this;
        }

        /**
         * Get the model at the given index
         * @param idx
         * @returns {*}
         */
        at(idx) {
            if (idx < 0) idx += this.this.length;
            return this.models[idx];
        }

        /**
         * Retrieves model with matching id
         * @param id
         * @returns {*}
         */
        findById(id) {
            return this.models.find((m) => m.id === id);
        }

        /**
         * Resets collection to empty `Array`
         * @returns {Collection}
         */
        reset() {
            this.models.splice(0, this.models.length);
            return this;
        }

        // /**
        //  * Getter for Model Class with embedded back-references to this NS::Collection
        //  * @returns {Class}
        //  */
        // get modelClass() {
        //     // return _modelClassRefs.get(this);
        //     this.createModelRef();
        // }

        /**
         * Accessor for Collection's Primitive Value
         * @returns {Object}
         */
        valueOf() {
            return this.models.valueOf();
        }

        /**
         * Accessor for Collection's `JSON` representation
         * @returns {*}
         */
        toJSON() {
            return this.models.map((m) => m.toJSON());
        }

        /**
         * Accessor for Collection's `String` representation
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
Object.defineProperty(trait, "Name", {
    get: () => "ListableTrait",
    enumerable: true,
    configurable: false,
});
export {trait as ListableTrait};

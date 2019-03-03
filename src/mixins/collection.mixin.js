import {_cids, _modelClassRefs, _subjects, _traits} from "../_references";
import {BehaviorSubject} from "rxjs";

/**
 *
 * @param superclass
 * @returns Class<CollectionMixin>
 */
const mixin = (superclass) => {
    return class extends superclass {
        /**
         *
         * @param __data
         */
        constructor(__data) {
            super();

            if (__data && this["isListable"]) {
                this.models = __data;
            }

            _traits.get(this).push(mixin.Name);
        }

        /**
         * Tests value for validation without setting value to Collection
         * @param data {object}
         * @returns {boolean|string}
         */
        validate(data) {
            return this.createModelRef().validate(data);
        }

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
Object.defineProperty(mixin, "Name", {
    get: () => "CollectionMixin",
    enumerable: true,
    configurable: false,
});
export {mixin as CollectionMixin};

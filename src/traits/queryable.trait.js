import Query from "../query";
import {_traits} from "../_references";
/**
 *
 * @param superclass
 * @returns Class<Trait>
 */
const trait = (superclass) => {
    return class extends superclass {
        constructor() {
            super();
            _traits.get(this).push(trait.Name);
        }

        /**
         * Batch saves Objects that are new or need updating
         * @returns {*}
         */
        query() {
            return new Query();
        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "QueryableTrait",
    enumerable: true,
    configurable: false,
});
export {trait as QueryableTrait};

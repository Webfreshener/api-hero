import {_traits} from "../_references";
/**
 *
 * @param superclass
 * @returns Class<Trait>
 */
const trait = (superclass) => {
    return class extends superclass {
        /**
         *
         * @param target
         */
        constructor() {
            super();
            _traits.get(this).push(trait.Name);
        }

        options() {

        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "AccessibleTrait",
    enumerable: true,
    configurable: false,
});
export {trait as AccessibleTrait};
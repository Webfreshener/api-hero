import {RxVO} from "rxvo";
import {default as PatchSchema} from "../schemas/patch.schema";
const _rxvo = new RxVO({schemas: [PatchSchema], use: "patch"});
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
         *
         * @param ops
         * @returns {*}
         */
        patch(ops) {
            const _isValid = _rxvo.validate("", ops);
            if (_isValid === true) {
                return this.$scope.sync("PATCH", ops, {});
            }

            return _isValid;
        }
    }
};

/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "PatchableTrait",
    enumerable: true,
    configurable: false,
});

export {trait as PatchableTrait};
import {RxVO} from "rxvo";
import {Trait} from "./trait";
import {default as PatchSchema} from "../schemas/patch.schema";
const _rxvo = new RxVO({schemas: [PatchSchema], use: "patch"});
export class PatchableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "PatchableTrait";
    }

    /**
     *
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["patch"]);
    }

    /**
     *
     * @param ops
     * @returns {*}
     */
    patch(ops) {
        const _isValid = _rxvo.validate("", ops);
        if (_isValid === true) {
            return this.$scope.sync("PATCH", ops, {

            });
        }

        return _isValid;
    }
}
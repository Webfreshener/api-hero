import {_traits} from "../_references";
import {SaveableTrait} from "./saveable.trait";

export class UpdateableTrait extends SaveableTrait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "UpdateableTrait";
    }

    constructor(target, schema) {
        super(target, schema);
        _traits.get(target).push("UpdateableTrait");
    }


    save() {
        return super.save();
    }
}
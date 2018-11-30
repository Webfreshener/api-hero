import {Trait} from "./trait";

export class AccessableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "BatchableTrait";
    }

    /**
     *
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["options"]);
    }

    options() {

    }
}
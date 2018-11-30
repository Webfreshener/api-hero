import {Trait} from "./trait";

/**
 *
 */
export class BatchableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "BatchableTrait";
    }

    /**
     * @constructor
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["saveAll"]);
    }

    /**
     * Batch saves Objects that are new or need updating
     * @param options
     * @returns {*}
     */
    saveAll(options) {
        // const batch = new Batch(_.compact(
        //     _.map(this.models, function (v, k) {
        //         if (v.isNew() || v.dirty()) {
        //             return v;
        //         }
        //     })));
        // // loops on `models` and maps array of items that need to be saved
        // return batch.exec(options);
        return false;
    }
}
import {Trait} from "./trait";
import Query from "./query";
/**
 *
 */
export class QueryableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "QueryableTrait";
    }

    /**
     *
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["query"]);
    }

    /**
     * Batch saves Objects that are new or need updating
     * @param options
     * @returns {*}
     */
    query() {
        return new Query();
    }
}
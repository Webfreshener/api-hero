import {_traits} from "./_references";
import {RxVO} from "rxvo";

export class NSElement {
    constructor(schema) {
        _traits.set(this, []);
        // defines schema getter on Collection
        Object.defineProperty(this, "$schema", {
            get: () => schema,
            enumerable: false,
            configurable: false,
        });
    }

    /**
     * getter for API URI for Collection
     * @returns {string}
     */
    get url() {
        return `${this.$scope.$utils.apiUrl}/${this.$className}`;
    }

    /**
     *
     * @param {string} traitName
     * @returns {boolean}
     */
    hasTrait(traitName) {
        return this.listTraits().indexOf(traitName) > -1;
    }

    /**
     *
     * @returns {string[]}
     */
    listTraits() {
        return _traits.get(this);
    }

    get pathParams() {

    }

    get queryParams() {
        console.log(this.$schema);
    }


}
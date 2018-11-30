import {_traits, _models} from "../_references";
import foreach from "lodash.foreach";
import map from "lodash.map";
import uniqueid from "lodash.uniqueid";
import {FetchableTrait} from "./fetchable.trait";
import {Utils} from "../utils";
import {CollectionProxy} from "../collection-proxy";

export class ListableTrait extends FetchableTrait {
    /**
     * holder for trait name
     * @returns {string}
     */
    static get Name() {
        return "ListableTrait";
    }

    /**
     *
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        _models.set(target, CollectionProxy.create(target));
        // defines getter/setter for models
        Object.defineProperty(target, "models", {
            get: () => _models.get(target),
            set: (data) => target.setModels(data),
            enumerable: true,
            configurable: false
        });

        Object.defineProperty(target, "length", {
            get: () => target.models.length,
            enumerable: true,
            configurable:false
        });

        Object.defineProperty(_traits.get(target), ListableTrait.Name, {
            get: () => this,
            enumerable: true,
            configurable: false,
        });

        this.defineTraitMethods(["add", "at", "getModels", "setModels", "reset"]);
    }

    /**
     *
     * @returns {*}
     */
    getModels() {
        return _models.get(this);
    }

    /**
     *
     * @param models
     * @returns {Collection}
     */
    setModels(data) {
        // helper to determine how to handle incoming data properties
        // const _derive = (m) => {
        //     return m.hasOwnProperty("body") ? m.body : m;
        // };

        // tests for array and maps or wraps single element into an array
        // const _m = Array.isArray(data) ? map(data, _derive) : [_derive(data)];
        // applies the Model back-refs onto the dataset
        foreach(data, (m) => {
            this.add(m)
        });

        return this;
    }

    /**
     * Adds Object to Model without updating remote collection
     * @param data
     * @returns {Collection}
     */
    add(data) {
        const _model = new Utils.createReference(data, this);
        if (_model.errors === null) {
            this.models.push(_model);
        }
        return this;
    }

    /**
     * Get the model at the given index
     * @param idx
     * @returns {*}
     */
    at(idx) {
        if (idx < 0) idx += this.target.length;
        return this.models[idx];
    }

    /**
     * Retrieves model with matching id
     * @param id
     * @returns {*}
     */
    findById(id) {
        return this.models.find((m) => m.id === id);
    }

    /**
     * Resets collection to empty `Array`
     * @returns {Collection}
     */
    reset() {
        this.models.splice(0, this.models.length);
        return this;
    }
}

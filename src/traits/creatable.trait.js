import {RxVO} from "rxvo";
import {ListableTrait} from "./listable.trait";
import {SaveableTrait} from "./saveable.trait";
import Collection from "../collection";

/**
 *
 * @param data
 * @returns {*}
 */
const resolveData = (data) => {
    return ("$model" in data) ? data.$model.data : data;
};

/**
 *
 */
export class CreateableTrait extends SaveableTrait {
    static get Name() {
        return "CreateableTrait";
    }

    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["create", "newModel"]);
    }

    newModel(data) {
        const _ref = Collection.createModelRef(this);
        if (data.hasOwnProperty("id")) {
            const _idx = this.models.findIndex((el) => el.hasOwnProperty("id") && el.id === data.id);
            if (_idx > -1) {
                const _m = this.models[_idx];
                _m.data = data;
                return _m;
            }
        }
        const _model = new _ref(data);
        if (_model.$collection.hasTrait("ListableTrait")) {
            _model.$collection.models.push(_model);
        }
        return _model;
    }

    /**
     * Adds Model to Collection and saves to remote collection by default
     * @param data
     * @param immediate - set to `false` to add to collection without saving to remote
     * @returns {Model}
     */
    create(data, immediate = true) {
        const model = this.newModel(data);
        if (this.hasTrait(ListableTrait.Name)) {
            this.add(model);
        }

        return immediate ? this.save() : this;

    }
}
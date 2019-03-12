import {SavableTrait} from "./savable.trait";
import {_traits} from "../_references";

/**
 *
 * @param superclass
 * @returns Class<Trait>
 */
const trait = (superclass) => {
    return class extends superclass {
        constructor() {
            super();
            if (!this["isSavable"]) {
                throw(`${trait.Name} requires ${SavableTrait.Name}`);
            }
            _traits.get(this).push(trait.Name);
        }

        /**
         * creates new model for path
         * @param data
         * @returns {*|string}
         */
        newModel(data) {
            if (data.hasOwnProperty("id")) {
                const _idx = this.models.findIndex((el) => {
                    return el.hasOwnProperty("id") && el.id === data.id;
                });
                
                if (_idx > -1) {
                    const _m = this.models[_idx];
                    _m.data = data;
                    return _m;
                }
            }

            const _model = this["createModelRef"]();

            if (_model.$parent !== null && _model.$parent["isListable"]) {
                _model.$parent.models.push(_model);
            }

            _model.data = data;

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
            if (this["isListable"]) {
                this.add(model);
            }

            return immediate ? this.save() : this;

        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "CreatableTrait",
    enumerable: true,
    configurable: false,
});
export {trait as CreatableTrait};

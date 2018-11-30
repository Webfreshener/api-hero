import {RxVO} from "rxvo";
import {_traits} from "../_references";
const _traitSchemas = new WeakMap();
export class Trait {
    constructor(target, schema) {
        _traits.get(target).push(this.constructor.name);
        _traitSchemas.set(this, schema);
        Object.defineProperty(this, "target", {
            get: () => target,
            enumerable: true,
            configurable: false
        });
    }

    /**
     *
     * @param names
     */
    defineTraitMethods(names) {
        const _rxvo = new RxVO({
            schemas: [{
                id: "root#",
                type: "array",
                items: {
                    type: "string",
                }
            }],
        });

        _rxvo.subscribe({
            error: (e) => {
                console.error(e);
            }
        });

        _rxvo.model = names;

        const _self = this;
        _rxvo.model.forEach((key) => {
            if (!_self.target.hasOwnProperty(key)) {
                Object.defineProperty(_self.target, key, {
                    value: _self[key],
                    enumerable: true,
                    configurable: true,
                });
            }
        });
    }
}
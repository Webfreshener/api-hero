import {Request} from "../request";
import {BehaviorSubject} from "rxjs";
import {_traits} from "../_references";
import {RestRequest} from "../rest-request";

/**
 *
 * @param superclass
 * @returns Class
 */
const trait = (superclass) => {
    return class extends superclass {
        constructor() {
            super();
            _traits.get(this).push(trait.Name);
        }

        destroy() {
            const _mSubj = new BehaviorSubject(this).skip(1);
            // if is new or is frozen, delete operation is not possible
            if (this.isNew || this.data["$model"].isFrozen) {
                // delay error notification to allow subscribers to catch
                setTimeout(() => _mSubj.error(`${this.$className} [cid: ${this.$cid}] is not deletable`), 10);
                return _mSubj;
            }

            const _sub = new RestRequest("DELETE", this, {})
                .exec().subscribe({
                    next: (res) => {
                        _sub.unsubscribe();
                        _mSubj.next(Request.getHeaders(res));
                        if (this["isListable"]) {
                            const _cModels = this.models;
                            _cModels.splice(0, _cModels.length - 1);
                        } else {
                            if (this.$parent !== null) {
                                const _cModels = this.$parent.models;
                                const _idx = _cModels.findIndex((el) => el.$cid === this.$cid);
                                _cModels.splice(_idx, 1);
                            }
                            // freezes model and send complete notification
                            this.data["$model"].freeze();
                        }
                        _mSubj.complete();
                    },
                    error: (e) => {
                        _sub.unsubscribe();
                        _mSubj.error(e);
                    }
                });
            return _mSubj;
        }
    }
};

/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "DeletableTrait",
    enumerable: true,
    configurable: false,
});

export {trait as DeletableTrait};

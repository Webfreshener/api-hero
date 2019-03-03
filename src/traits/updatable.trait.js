import {_traits} from "../_references";
import {SavableTrait} from "./savable.trait";
import {BehaviorSubject} from "rxjs";

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
         *
         * @param data
         * @returns {*}
         */
        update(data) {
            const _subj = new BehaviorSubject({}).skip(1);
            const _mSub = this.subscribe({
                next: () => {
                    const _sSub = this.save().subscribe({
                        next: (m) => {
                            _subj.next(m);
                            _sSub.unsubscribe();
                        },
                        error: (e) => {
                            _subj.error(e);
                            _sSub.unsubscribe();
                        },
                        complete: () => {
                            _subj.complete();
                            _sSub.unsubscribe();
                        }
                    });
                    _mSub.unsubscribe();
                },
                error: (e) => {
                    _subj.error(e);
                    _mSub.unsubscribe();
                }
            });

            if (data !== void(0) && data !== null) {
                this.data = data;
            }

            return _subj;
        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "UpdatableTrait",
    enumerable: true,
    configurable: false,
});

export {trait as UpdatableTrait};

import {_modelStats, _requests, _traits} from "../_references";
import {BehaviorSubject} from "rxjs/Rx";
import {RestRequest} from "../rest-request";
import {Request} from "../request";

const getSaveMode = (target) => {
    if (target["isCreatable"] && target.isNew) {
        return ["POST", "create"];
    }

    if (target["isUpdatable"] && target.isDirty) {
        return ["PUT", "update"];
    }

    return false;
};

/**
 *
 * @param superclass
 * @returns Class<Trait>
 */
const trait = (superclass) => {
    return class extends superclass {
        constructor() {
            super();
            _traits.get(this).push(trait.Name);
        }

        /**
         *
         * @param params
         * @returns {*}
         */
        save(params = {}) {
            if (params.hasOwnProperty("force")) {
                _modelStats.get(this).isDirty = true;
                delete params.force;
            }
            // tests if element is Collection
            if (this["isListable"]) {
                let _completed = 0;
                const _cSubj = new BehaviorSubject(this.models).skip(1);
                const _models = this.models.filter((m) => m.isNew || m.isDirty);
                _models.forEach((model) => {
                    return model.save().subscribe({
                        next: (res) => {
                            _cSubj.next(Request.getHeaders(res));
                            if (++_completed === this.models.length) {
                                _cSubj.complete();
                            }
                        },
                        error: (e) => {
                            _cSubj.error(e);
                        },
                    });
                });
                return _cSubj;
            } else {
                const _mSubj = new BehaviorSubject(this).skip(1);

                if (this.data["$model"].isFrozen) {
                    // if frozen no further operation are permitted
                    // delay error notification to allow subscribers to catch
                    setTimeout(() => _mSubj.error("model no longer savable"), 10);
                    return _mSubj;
                }

                let _mode = getSaveMode(this);
                if (_mode !== false) {

                    let _req = {
                        method: _mode[0],
                        id: this.$scope.$utils.createRequestId(this, _mode[1]),
                        idAttribute: this.idKey,
                    };

                    const _params = {
                        path: {
                            petId: this.data[this.idKey],
                        }
                    };

                    const _rest = new RestRequest(_req.method, this, _params);
                    const _mSyncSub = _rest.exec().subscribe({
                        next: (res) => {
                            const _headers = Request.getHeaders(res);
                            _mSubj.next(_headers);
                            if (_headers.status === 204) {
                                _mSubj.complete();
                                return;
                            }
                            res.json().then((_json) => {
                                this.data = _json;
                                _requests.delete(this);
                                _modelStats.set(this, {isDirty: false, isNew: false});
                                _mSyncSub.unsubscribe();
                                _mSubj.complete();
                            }).catch((e) => {
                                _requests.delete(this);
                                _mSyncSub.unsubscribe();
                                _mSubj.error(e);
                            });
                        },
                        error: (e) => {
                            _mSubj.error(e);
                            _mSyncSub.unsubscribe();
                        }
                    });

                } else {
                    // if no data we are already complete
                    // delay invocation to allow subscribers to catch
                    setTimeout(() => _mSubj.complete(), 10);
                }
                return _mSubj;
            }

        }
    }
};
/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "SavableTrait",
    enumerable: true,
    configurable: false,
});
export {trait as SavableTrait};

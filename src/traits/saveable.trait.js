import {Trait} from "./trait";
import {_modelStats, _requests} from "../_references";
import {BehaviorSubject} from "rxjs/Rx";
import {Request} from "../request";

const _traitModes = new WeakMap();

const getSaveMode = (target) => {
    if (target.hasTrait("CreateableTrait") && target.isNew) {
        return ["POST", "create"];
    }

    if (target.hasTrait("UpdateableTrait") && target.isDirty) {
        return ["PUT", "update"];
    }

    return false;
};

/**
 *
 */
export class SaveableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static Name() {
        return "SaveableTrait";
    }

    /**
     *
     * @param target
     * @param schema
     */
    constructor(target, schema) {
        super(target, schema);
        _traitModes.set(this, this.constructor.name);
        this.defineTraitMethods(["save"]);
    }

    /**
     *
     */
    save() {
        // tests if element is Collection
        if (this.hasTrait("ListableTrait")) {
            let _completed = 0;
            const _cSubj = new BehaviorSubject(this.models).skip(1);
            const _models = this.models.filter((m) => {
                return m.isNew || m.isDirty
            });
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
            let _mode = getSaveMode(this);
            if (_mode !== false) {
                let _req = {
                    method: _mode[0],
                    id: this.$scope.$utils.createRequestId(this, _mode[1]),
                };
                const _mSyncSub = this.$scope.sync(_req.method, this, {}).subscribe({
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
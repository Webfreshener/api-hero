import {Trait} from "./trait";
import {_modelStats, _requests} from "../_references";
import {ListableTrait} from "./listable.trait";
import {BehaviorSubject} from "rxjs/Rx";
const _doFetch = (_self, _model) => {
    let _req = {
        method: "GET",
        id: _self.$scope.$utils.createRequestId(_self, "read"),
    };
    const _subj = new BehaviorSubject(_self).skip(1);
    _requests.set(_self, _req);
    const _sub = _self.$scope.sync(_req.method, _self, _model)
        .subscribe({
            next: (res) => {
                _subj.next(res);
                res.json().then((_json) => {
                    if (_self.hasTrait(ListableTrait.name)) {
                        const _sIdx = _self.models.length >= 0 ? _self.models.length - 1 : 0;
                        let _idx = 0;
                        _self.setModels(_json);
                        const _ids = (Array.isArray(_json) ? _json : [_json]).map((itm) => itm.id);
                        const _fetchedModels = _self.models.filter((m) => {
                            return _ids.find((id) => id === m.id) !== void(0);
                        });
                        _fetchedModels.forEach((m) => {
                            if (_idx >= _sIdx) {
                                _modelStats.set(m, {
                                    isDirty: false,
                                    isNew: false
                                });
                                _idx++;
                            }
                        });
                    } else {
                        _self.data = _json;
                        _modelStats.set(_self, {isDirty: false, isNew: false});
                    }
                    _requests.delete(_self);
                    _sub.unsubscribe();
                    _subj.complete();
                });
            },
            error: (e) => {
                _subj.error(e);
                _sub.unsubscribe();
            }
        });
    return _subj;
}
export class FetchableTrait extends Trait {
    /**
     *
     * @returns {string}
     */
    static get Name() {
        return "FetchableTrait";
    }

    /**
     *
     * @param target
     */
    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["fetch"]);
    }

    /**
     * Performs REST::GET Operation to populate collection
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    fetch() {
        return _doFetch(this, {});
    }

    /**
     * Performs REST::GET Operation to retrieve model from remote collection
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    fetchById(id) {
        return _doFetch(this, {id: id});
    }
}
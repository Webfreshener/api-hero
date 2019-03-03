import {_requests, _traits,} from "../_references";
import {BehaviorSubject} from "rxjs/Rx";
import {RestRequest} from "../rest-request";

/**
 *
 * @param _self
 * @param _params
 * @returns {*}
 * @private
 */
const _doFetch = (_self, _params) => {
    let _req = {
        method: "GET",
        id: _self.$scope.$utils.createRequestId(_self, "read"),
    };

    const _subj = new BehaviorSubject(_self).skip(1);
    _requests.set(_self, _req);

    const _rest = new RestRequest(_req.method, _self, _params);
    const _sub = _rest.exec().subscribe({
        next: (res) => {
            _subj.next(res);
            res.json().then((_json) => {
                if (_self["isListable"]) {
                    const _sIdx = _self.models.length >= 0 ? _self.models.length - 1 : 0;
                    let _idx = 0;
                    _self["setModels"](_json);
                    const _ids = (Array.isArray(_json) ? _json : [_json]).map((itm) => itm.id);
                    const _fetchedModels = _self.models.filter((m) => {
                        return _ids.find((id) => id === m.id) !== void (0);
                    });
                    // _fetchedModels.forEach((m) => {
                    //     if (_idx >= _sIdx) {
                    //         _paramsStats.set(m, {
                    //             isDirty: false,
                    //             isNew: false
                    //         });
                    //         _idx++;
                    //     }
                    // });
                } else {
                    _self.data = _json;
                    // _paramsStats.set(_self, {isDirty: false, isNew: false});
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
         * Performs `GET` Operation to populate collection
         * @param params
         * @returns {*}
         */
        fetch(params) {
            return _doFetch(this, params);
        }

        /**
         * Performs GET Operation to retrieve model from remote collection
         * @returns {*}
         */
        fetchById(id, options = {}) {
            const _subj = new BehaviorSubject({}).skip(1);
            const _model = this["createModelRef"]({id: id});
            const _pathParams = {path: {}};
            // _pathParams.path[this.pathIDKey] = id;
            _pathParams.path["petId"] = id;
            const _params = Object.assign({}, options, _pathParams);
            setTimeout(() => {
                const _fSub = _doFetch(_model, _params).subscribe({
                    error: (e) => {
                        _subj.error(e);
                        _fSub.unsubscribe();
                    },
                    complete: () => {
                        _subj.next(_model);
                        _fSub.unsubscribe();
                    }
                });
            }, 10);
            return _subj;
        }
    }
};

/**
 * defines static Name getter for trait
 */
Object.defineProperty(trait, "Name", {
    get: () => "FetchableTrait",
    enumerable: true,
    configurable: false,
});

export {trait as FetchableTrait};

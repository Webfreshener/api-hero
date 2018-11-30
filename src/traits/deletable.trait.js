import {Trait} from "./trait";
import {Request} from "../request";
import {BehaviorSubject} from "rxjs";

export class DeletableTrait extends Trait {
    static get Name() {
        return "DeletableTrait";
    }

    constructor(target, schema) {
        super(target, schema);
        this.defineTraitMethods(["destroy"]);
    }

    destroy() {
        const _mSubj = new BehaviorSubject(this).skip(1);
        const _sub = this.$scope.sync("DELETE", this, {}).subscribe({
            next: (res) => {
                _sub.unsubscribe();
                _mSubj.next(Request.getHeaders(res));
                if (this.hasTrait("ListableTrait")) {
                    const _cModels = this.models;
                    _cModels.splice(0, _cModels.length - 1);
                } else {
                    const _cModels = this.$collection.models;
                    const _idx = _cModels.findIndex((el) => el.$cid === this.$cid);
                    _cModels.splice(_idx, 1);
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
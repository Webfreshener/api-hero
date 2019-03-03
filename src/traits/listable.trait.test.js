import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";

describe("Listable Trait Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _col = ns["pets"];

    describe("Listable Models Tests", () => {
        it("should accept valid models", (done) => {
            let _cnt = 0;
            const _sub = _col.subscribe({
                next: () => {
                    if (++_cnt === 3) {
                        _sub.unsubscribe();
                        expect(_col.models.length).toBeTruthy();
                        expect(_col.models[_col.models.length - 1].id).toEqual("29");
                        expect(_col.models[_col.models.length - 1].data.type).toEqual("fish");
                        expect(_col.models[_col.models.length - 1].data.price).toEqual(3.5);
                        done();
                    }
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                },
            });

            _col.models = [{
                "id": "27",
                "type": "dog",
                "price": 10.99,
            }, {
                "id": "28",
                "type": "cat",
                "price": 2.35,
            }, {
                "id": "29",
                "type": "fish",
                "price": 3.50,
            }];

        });

        it("should reset it's content", (done) => {
            const _sub = _col.subscribe({
                next: () => {
                    _sub.unsubscribe();
                    expect(_col.length).toBe(0);
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                }
            });
            _col.reset();
        });

        it("should reject invalid models", (done) => {
            let _cnt = 0;
            const _sub = _col.subscribe({
                next: (m) => {
                    if (++_cnt === 3) {
                        _sub.unsubscribe();
                        expect(_col.models.length).toEqual(3);
                        expect(_col.models[0].id).toEqual("27");
                        expect(Object.keys(_col.models[1].toJSON()).length).toEqual(0);
                        expect(_col.models[2].id).toEqual("29");
                        done();
                    }
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                }
            });

            _col.models = [{
                "id": "27",
                "type": "dog",
                "price": 10.99,
            }, {
                "id": 28,
                "type": "iguana",
                "price": 2.35,
            }, {
                "id": "29",
                "type": "fish",
                "price": 3.50,
            }];
        });
    });
});

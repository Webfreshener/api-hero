import Namespace from "./namespace";
import {NoTraitsSchema} from "../fixtures/no-traits.schema";
import {_nsSchema} from "../fixtures/_schemas";
import nock from "nock";

const _record = [{
    "id": "1",
    "type": "Bird",
    "price": 100.00,
}, {
    "id": "2",
    "type": "Cat",
    "price": 10.00,
}, {
    "id": "3",
    "type": "Dog",
    "price": 50.00,
}];

describe("Collection Traits Tests", () => {
    describe("Test for Collection  with no Traits", () => {
        const ns = Namespace(NoTraitsSchema.namespaces.NoTraits);
        const _col = ns["nada"];

        it("should have no REST Methods", (done) => {
            const _keys = Object.keys(_col);
            expect(_keys.length).toEqual(1);
            expect(_keys[0]).toBe("$scope");
            done();
        });
    });

    describe("Tests for Collection Traits", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreStaging);
        const _col = ns["pets"];

        describe("Listable Collection Tests", () => {
            nock("http://petstore.testing-api.com/api/pets")
                .get("")
                .reply(200, _record);

            it("should have Listable Trait Methods", () => {
                expect(_col.hasOwnProperty("models")).toBe(true);
                expect(_col.hasOwnProperty("length")).toBe(true);
                expect(_col.hasOwnProperty("add")).toBe(true);
                expect(_col.hasOwnProperty("at")).toBe(true);
                expect(_col.hasOwnProperty("getModels")).toBe(true);
                expect(_col.hasOwnProperty("setModels")).toBe(true);
                expect(_col.hasOwnProperty("reset")).toBe(true);
            });

            it("should provide a models array", () => {
                expect(Array.isArray(_col.models)).toBe(true);
            });

            it("should provide a getter for models.length attribute", () => {
                expect(_col.length).toEqual(0);
            });

            describe("Listable Models Tests", () => {
                it("should accept valid models", (done) => {
                    let _cnt = 0;
                    const _sub = _col.subscribe({
                        next: () => {
                            expect(_col.length).toBe(++_cnt);
                            if (_cnt === 3) {
                                expect(_col.models[_cnt - 1].id).toEqual("29");
                                expect(_col.models[_cnt - 1].data.type).toEqual("fish");
                                expect(_col.models[_cnt - 1].data.price).toEqual(3.50);
                                _sub.unsubscribe();
                                done();
                            }
                        }
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
                            expect(_col.length).toBe(0);
                            _sub.unsubscribe();
                            done();
                        }
                    });
                    _col.reset();
                });

                it("should reject invalid models", (done) => {
                    let _cnt = 0;
                    const _sub = _col.subscribe({
                        next: () => {
                            expect(_col.length).toBe(++_cnt);
                            if (_cnt === 2) {
                                expect(_col.models[_cnt - 1].id).toEqual("29");
                                expect(_col.models[_cnt - 1].data.type).toEqual("fish");
                                expect(_col.models[_cnt - 1].data.price).toEqual(3.50);
                                _sub.unsubscribe();
                                done();
                            }
                        }
                    });
                    _col.models = [{
                        "id": "27",
                        "type": "dog",
                        "price": 10.99,
                    }, {
                        "id": 28,
                        "type": "cat",
                        "price": 2.35,
                    }, {
                        "id": "29",
                        "type": "fish",
                        "price": 3.50,
                    }];

                });
            });
        });

        describe("CREATABLE Collection Record TESTS", () => {
            const _res = {"id": "27", "type": "Iguana", "price": 100};
            // beforeEach(() => {
            nock("http://petstore.testing-api.com")
                .post("/api/pets")
                .reply(201, null, {
                    Location: "http://petstore.testing-api.com/api/pets/27",
                })
                .get("/api/pets/27")
                .reply(200, _res);

            it("should CREATE a record on server", (done) => {
                const _model = _col.newModel(_record);
                const _sub = _model.save().subscribe({
                    complete: () => {
                        expect(_model.data.id).toBe("27");
                        _sub.unsubscribe();
                        done();
                    },
                    error: (e) => {
                        done(e);
                    }
                });
            });
        });

        describe("Fetchable Collection Tests", () => {
            beforeEach(() => {
                _col.reset();
                nock("http://petstore.testing-api.com/api/pets")
                    .get("")
                    .reply(200, _record);
            });

            // it("should FETCH from server", (done) => {
            //     const _sub = _col.fetch().subscribe({
            //         complete: () => {
            //             expect(_col.models.length).toEqual(3);
            //             expect(_col.models[0].data.type).toEqual("Bird");
            //             expect(_col.models[0].data.price).toEqual(100);
            //             _sub.unsubscribe();
            //             done();
            //         },
            //         error: (e) => {
            //             _sub.unsubscribe();
            //             done(e);
            //         }
            //     });
            // });
        });

    });

    // describe.only("End Point Tests", () => {
    //     const ns = Namespace(_endpointSchema.namespaces.EndPoint);
    //     const _col = ns["ping"];
    //
    //     test("it should have endpoint", () => {
    //         console.log(_col);
    //     });
    // })
});

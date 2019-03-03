import Namespace from "../src/namespace";
// import {_nsSchema} from "../fixtures/_schemas";
import nock from "nock";
import {Utils} from "../src/utils";
const _record = {
    "type": "Iguana",
    "price": 100.00,
};
export const traitsTests = (nsSchema) => {
    describe("Tests for Model Traits", () => {
        // const ns = Namespace(_nsSchema.namespaces.PetStore);
        const ns = Namespace(nsSchema);
        const _col = ns["pets"];

        describe("FETCHABLE MODEL TESTS", () => {
            beforeEach(() => {
                _col.reset();
                nock("http://petstore.testing-api.com/api/pets/27")
                    .get("")
                    .reply(200, Object.assign({id: "27"}, _record), {
                        "Access-Control-Allow-Origin": "*",
                    });
            });

            it("should FETCH from server", (done) => {
                // attempts to derive model schema from GET response
                const pathKey = Object.keys(_col.$schema.childPaths)
                    .find((k) => k.match(/^\{+[a-z0-9_\-]{1,}\}+$/i));
                console.log(`_col.$schema: ${JSON.stringify(_col.$schema.childPaths[pathKey])}`);
                let schema = Utils.derivefromElement(_col.$schema);
                // console.log(Utils.deriveSchema(schema, _col.$scope.schema), null, 2);
                done();
                // const _model = _col.newModel({id: "27"});
                // const _sub = _model.fetch().subscribe({
                //     complete: () => {
                //         expect(_model.data.id).toEqual("27");
                //         expect(_model.data.type).toEqual("Iguana");
                //         expect(_model.data.price).toEqual(100);
                //         expect(_model.$parent.models.length).toEqual(1);
                //         _sub.unsubscribe();
                //         done();
                //     },
                //     error: (e) => {
                //         _sub.unsubscribe();
                //         console.log(`e: ${e}`);
                //         done(e);
                //     }
                // });
            });
        });

        describe("UPDATABLE MODEL TESTS", () => {
            beforeEach(() => {
                nock("http://petstore.testing-api.com/api/pets/27")
                    .get("")
                    .reply(200, Object.assign({id: "27"}, _record), {
                        "Access-Control-Allow-Origin": "*",
                    })
                    .put("")
                    .reply(204);
            });

            it("should UPDATE a record on server", (done) => {
                const _model = _col.newModel({id: "27"});
                const _fSub = _model.fetch().subscribe({
                    complete: () => {
                        _model.data.price = 123;
                        _fSub.unsubscribe();
                        const _sSub = _model.save().subscribe({
                            complete: () => {
                                expect(_model.data.price).toBe(123);
                                _sSub.unsubscribe();
                                done();
                            },
                            error: (e) => {
                                _sSub.unsubscribe();
                                done(e);
                            }
                        });
                    },
                    error: (e) => {
                        done(e);
                    }
                });
            });

        });

        describe("SAVABLE MODEL TESTS", () => {
            const _model = _col.newModel({type: "Cat", price: 100});

            beforeEach(() => {
                nock("http://petstore.testing-api.com")
                    .get("/api/pets/27")
                    .reply(200, Object.assign({id: "27"}, _record));

                nock("http://petstore.testing-api.com")
                    .post("/api/pets")
                    .reply(201, null, {Location: "http://petstore.testing-api.com/api/pets/27"});

                nock("http://petstore.testing-api.com")
                    .put("/api/pets/27")
                    .reply(204);
            });


            it("should CREATE record with save()", (done) => {
                _model.data.$model.subscribe({
                    error: (e) => {
                        console.log("CAUGHT ERROR");
                        console.log(e);
                    }
                });
                const _sub = _model.save().subscribe({
                    complete: () => {
                        _sub.unsubscribe();
                        expect(_model.data.id).toEqual("27");
                        done();
                    },
                    error: (e) => {
                        _sub.unsubscribe();
                        done(e);
                    },
                });
            });

            it("should UPDATE record with save()", (done) => {
                _model.data.type = "Dog";
                const _sub = _model.save().subscribe({
                    next: (res) => {
                        _sub.unsubscribe();
                        expect(_model.data.type)
                            .toEqual("Dog");
                        done();
                    },
                    error: (e) => {
                        _sub.unsubscribe();
                        done(e);
                    },
                });
            });
        });

        describe("DESTROYABLE MODEL TESTS", () => {
            beforeEach(() => {
                _col.reset();
                nock("http://petstore.testing-api.com/api/pets/27")
                    .get("")
                    .reply(200, Object.assign({id: "27"}, _record))
                    .delete("")
                    .reply(200);
            });

            it("should DESTROY a record on server", (done) => {
                const _model = _col.newModel({id: "27"});
                _model.fetch().subscribe({
                    complete: () => {
                        _model.destroy().subscribe({
                            next: (res) => {
                                expect(res.status).toEqual(200);
                            },
                            error: (e) => {
                                done(e);
                            },
                            complete: () => {
                                expect(_model.$parent.models.length).toEqual(0);
                                done()
                            }
                        });
                    },
                    error: (e) => {
                        done(e);
                    },
                });
            });
        });
    });
}
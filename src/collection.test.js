import Namespace from "./namespace";
import Model from "./model";
import {_nsSchema, _collectionSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";
import "cross-fetch/polyfill";
import nock from "nock";
import {simpleReq} from "../fixtures/collection.mock";

describe("Collection Class Tests", () => {
    const ns = Namespace(_nsSchema);
    const _col = ns.TestCol1;
    describe("Basic Validation and Data", () => {
        it("should define a collection from a Schema", () => {
            expect(deepEqual(_col.$schema, _collectionSchema)).toBe(true);
        });

        it("should accept VALID models", () => {
            _col.models = [
                {
                    name: "Foo",
                    value: 0,
                },
                {
                    name: "Bar",
                    value: 1,
                },
                {
                    name: "Baz",
                },
            ];
            expect(_col.length).toBe(3);
        });

        it("should return Models attached to JSD Docs", () => {
            // console.log(_col.keys().next());
            expect(_col.models[0].$model instanceof Model).toBe(true);
            expect(_col.models[0].$model.save).toBeDefined();
        });

        it("should reset it's contents", () => {
            _col.reset();
            expect(_col.length).toBe(0);
        });

        it("should reject INVALID models", () => {
            _col.models = [
                {
                    name: "Foo",
                    value: "0",
                },
                {
                    name: "Bar",
                    value: "1",
                },
                {
                    name: 123,
                },
            ];
            expect(_col.length).toBe(0);
        });
    });

    describe("Basic HTTP Requests", () => {
        beforeEach(() => {
            nock("http://0.0.0.0")
                .get("/api/1/TestCol1")
                .reply(200, JSON.stringify(simpleReq));

            nock("http://0.0.0.0/api/1/TestCol1")
                .post("")
                .reply(201, JSON.stringify({
                    headers: {
                        location: "http://0.0.0.0/api/1/TestCol1/26"
                    }
                }));
        });

        it("should FETCH a record set from API endpoint", (done) => {
            return _col.fetch().then(() => {
                console.log(`_col: ${JSON.stringify(_col)}`);
                expect(_col.length).toBe(25);
                done();
            })

        });

        // it("should CREATE a new record to the API endpiont", (done) => {
        //     return _col.create({name: "Zuul", value: 26}).then(() => {
        //         expect(_col.length).toBe(26);
        //         done();
        //     })
        //
        // });
    });
});

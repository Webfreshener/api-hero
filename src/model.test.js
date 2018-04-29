import Namespace from "./namespace";

import Model from "./model";
import {_nsSchema, _collectionSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";
import "cross-fetch/polyfill";
import nock from "nock";
import {simpleReq} from "../fixtures/collection.mock";
import {RxVO} from "rxvo";

describe("Model Tests", () => {
    const ns = Namespace(_nsSchema);
    const _col = ns.TestCol1;

    beforeEach(() => {
        let _record = {
            "name":"Test1",
            "value":1,
            "id":27,
            "createdOn":"Tue Apr 03 2018 09:52:50 GMT-0500 (CDT)"
        };

        nock("http://0.0.0.0")
            .get("/api/1/TestCol1/27")
            .reply(200, JSON.stringify({
                "headers": {
                    "location": "http://0.0.0.0/api/1/TestCol1/27"
                },
                "body": _record,

            }));

        nock("http://0.0.0.0/api/1/TestCol1")
            .post("")
            .reply(201, (uri, requestBody) => {
                requestBody.id = 27;
                requestBody.createdOn = `${new Date()}`;
                return JSON.stringify({
                    headers: {
                        location: "http://0.0.0.0/api/1/TestCol1/27"
                    },
                    body: {} //JSON.stringify(requestBody),
                });
            });

        nock("http://0.0.0.0/api/1/TestCol1/27")
            .put("")
            .reply(201, {});

        nock("http://0.0.0.0/api/1/TestCol1/27")
            .delete("")
            .reply(200, (uri, requestBody) => {
                _record = null;
                return;
            });
    });

    // it("does nothing", () => {
    //     const _s = {
    //         properties:
    //             {
    //                 id: {type: "integer"},
    //                 name: {type: "string"},
    //                 value: {type: "integer"},
    //                 createdOn: {type: "string"}
    //             },
    //     };
    //
    //     console.log(_s);
    //     // console.log(data);
    //     // const _rxvo = new RxVO(_s);
    //     // expect(_rxvo.errors).toBe(null);
    //     const _model = _col.newModel({name: "Test1", value: 1})
    // });

    it.skip("should CREATE a record on server", (done) => {
        const _model = _col.newModel({name: "Test1", value: 1});
        _model.$model.save().then(() => {
            // expect(typeof _model.id).toBe("number");
            // expect(_model.id).toBe(27);
            // expect(typeof _model.createdOn).toBe("string");
            done();
        }).catch((e) => {
            done(e);
        });
    });
    //
    // it("should RETRIEVE from server", (done) => {
    //     const _model = _col.newModel({id: 27});
    //     _model.$model.fetch().then(() => {
    //         expect(typeof _model.name).toBe("string");
    //         expect(_model.name).toBe("Test1");
    //         expect(typeof _model.value).toBe("number");
    //         expect(_model.value).toBe(1);
    //         expect(typeof _model.createdOn).toBe("string");
    //         expect(_model.createdOn).toBe("Tue Apr 03 2018 09:52:50 GMT-0500 (CDT)");
    //         done();
    //     }).catch((e) => {
    //         done(e);
    //     });
    // });
    //
    // it("should UPDATE a record on server", (done) => {
    //     const _model = _col.newModel({id: 27});
    //     const $model = _model.$model;
    //     $model.fetch().then(() => {
    //         _model.name = "Model27";
    //         _model.value = 123;
    //         $model.save().then(() => {
    //             expect(_model.name).toBe("Model27");
    //             expect(_model.value).toBe(123);
    //             done();
    //         }).catch((e) => {
    //             done(e);
    //         });
    //     }).catch((e) => {
    //         done(e);
    //     });
    // });

    // it("should DESTROY a record on server", (done) => {
    //     const _model = _col.newModel({id: 27});
    //     _model.$model.fetch().then(() => {
    //         _model.$model.destroy().then(() => {
    //             done();
    //         }).catch((e) => {
    //             done(e);
    //         });
    //     }).catch((e) => {
    //         done(e);
    //     });
    // });

});
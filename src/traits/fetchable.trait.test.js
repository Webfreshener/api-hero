import Namespace from "../namespace";
import deepEqual from "deep-equal";
import {_nsSchema} from "../../fixtures/_schemas";
import nock from "nock";

const _record = [{
    "id": "1",
    "type": "bird",
    "price": 100.00,
}, {
    "id": "2",
    "type": "cat",
    "price": 10.00,
}, {
    "id": "3",
    "type": "dog",
    "price": 50.00,
}];

describe("Fetchable Trait Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _col = ns["pets"];

    describe("Fetchable Collection Tests", () => {
        beforeEach(() => {
            _col.reset();
            nock("http://petstore.testing-api.com")
                .get("/api/pets")
                .reply(200, _record);
        });

        it("should fetch collection from server", (done) => {
            const _sub = _col.fetch().subscribe({
                complete: () => {
                    expect(_col.models.length).toEqual(3);
                    expect(_col.models[0].data.type).toEqual("bird");
                    expect(_col.models[0].data.price).toEqual(100);
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                }
            });
        });
    });

    describe("Fetchable Model Tests", () => {
        beforeEach(() => {
            _col.reset();
            nock("http://petstore.testing-api.com")
                .get("/api/pets/3")
                .reply(200, _record[2]);
        });

        it("should fetch model by id", (done) => {
            const _req = _col.fetchById("3");
            const _sub = _req.subscribe({
                next: (_model) => {
                    expect(deepEqual(_model.data, _record[2])).toBe(true);
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                }
            });
        });
    })
});

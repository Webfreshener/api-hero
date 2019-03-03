import {_nsSchema} from "../../fixtures/_schemas";
import deepEqual from "deep-equal";
import nock from "nock";
import Namespace from "../namespace";

describe("Savable Trait Test Suite", () => {
    const _res = {"id": "27", "type": "cat", "price": 100};
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _schema = ns.builder.schemaForPath("/pets/{petId}");

    // we add a POST operation here in lieu of parent schema
    _schema.operations.post = ns["pets"].$schema.operations.post;

    const _el = new (ns.createElement("PetModel", _schema))();
    nock("http://petstore.testing-api.com")
        .post("/api/pets/")
        .reply(201, null, {
            Location: "http://petstore.testing-api.com/api/pets/27",
        })
        .put("/api/pets/27")
        .reply(204, null)
        .get("/api/pets/27")
        .reply(200, _res)
        .persist();

    it("should save with POST", (done) => {
        _el.data = {"type": "cat", "price": 100};
        _el.save().subscribe({
            next: (m) => {
                expect(m.status).toEqual(200);
                expect(m.url).toEqual("http://petstore.testing-api.com/api/pets/27");
                expect(deepEqual(_el.data, _res)).toBe(false);
            },
            error: (e) => {
                done(e);
            },
            complete: () => {
                expect(deepEqual(_el.data, _res)).toBe(true);
                done();
            },
        });
    });

    it("should save with PUT", (done) => {
        const _el = new (ns.createElement("PetModel", _schema))({});
        _el.data.id = "27";
        _el.data.price = 150;
        let _statusCode = null;
        _el.save().subscribe({
            next: (m) => {
                expect(_statusCode = m.status).toEqual(204);
            },
            error: (e) => {
                done(e);
            },
            complete: () => {
                // this ensures we don't pass unless next was called with success
                expect(_statusCode).toEqual(204);
                done();
            },
        });
    });

    it("should force save with PUT", (done) => {
        const _el = new (ns.createElement("PetModel", _schema))({id: "27", price: 150});
        let _statusCode = null;
        _el.save({force: true}).subscribe({
            next: (m) => {
                expect(_statusCode = m.status).toEqual(204);
            },
            error: (e) => {
                done(e);
            },
            complete: () => {
                // this ensures we don't pass unless next was called with success
                expect(_statusCode).toEqual(204);
                done();
            },
        });
    });
});

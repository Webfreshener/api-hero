import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";
import deepEqual from "deep-equal";
import nock from "nock";


describe("Deletable Trait Test Suite", () => {
    const _res = {"id": "27", "type": "cat", "price": 100};
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _schema = ns.builder.schemaForPath("/pets/{petId}");
    // const _el = ns.createElement("PetModel", _schema);
    // const $ref = new _el();
    const $col = ns["pets"];
    const $ref = $col.createModelRef();
    nock("http://petstore.testing-api.com")
        .delete("/api/pets/27")
        .reply(200, null)
        .persist();

    it("should not delete if is new or has no id assigned", (done) => {
        $ref.destroy().subscribe({
            next: (m) => {
                done("should not have attempted to delete");
            },
            error: (e) => {
                expect(e).toEqual("PetsModel [cid: PETSMODEL1] is not deletable");
                done();
            },
        });
    });

    it("should delete", (done) => {
        $ref.subscribe({
            next: (m) => {
                $ref.destroy().subscribe({
                    next: (m) => {
                        expect(m.status).toEqual(200);
                    },
                    error: (e) => {
                        done(e);
                    },
                });
            },
            error: (e) => {
                done(e);
            },
            complete: () => {
                expect(deepEqual($ref.data, _res)).toBe(true);
                setTimeout(() => done(), 10);
            },
        });
        $ref.data = _res;
    });

    it("should not delete if already deleted", (done) => {
        $ref.destroy().subscribe({
            next: (m) => {
               done("should not have attempted to delete");
            },
            error: (e) => {
                expect(e).toEqual("PetsModel [cid: PETSMODEL1] is not deletable");
                done();
            },
        });
    });
});

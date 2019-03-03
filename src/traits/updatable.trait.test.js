import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";
import nock from "nock";

describe("Updatable Trait Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _col = ns["pets"];
    const _oData = {id: "3", type: "cat", price: 100};

    describe("Updatable Model Tests", () => {
        const _updatedData = Object.assign({}, _oData, {price: 150});
        nock("http://petstore.testing-api.com")
            .put("/api/pets/3")
            .reply(204);


        it("should Update a record on server", (done) => {
            const _model = _col.createModelRef({id: "3", type: "cat", price: 100});
            const _sub = _model.update(_updatedData).subscribe({
                next: (m) => {
                    expect(m.status).toEqual(204);
                    done();
                },
                complete: () => {
                    expect(_model.data.price).toBe(150);
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
});


import Namespace from "./namespace";
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

describe("NSElement Tests", () => {
    describe("Tests for Collection Traits", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
        const _col = ns["pets"];

        describe("Listable Collection Tests", () => {
            nock("http://petstore.testing-api.com/api/pets")
                .get("")
                .reply(200, _record);

            it("should have Listable Trait Methods", () => {
                expect(Array.isArray(_col.models)).toBe(true);
                expect((typeof _col.length) === "number").toBe(true);
                expect(_col.add instanceof Function).toBe(true);
                expect(_col.at instanceof Function).toBe(true);
                expect(_col.getModels instanceof Function).toBe(true);
                expect(_col.setModels instanceof Function).toBe(true);
                expect(_col.reset instanceof Function).toBe(true);
            });

            it("should provide a models array", () => {
                expect(Array.isArray(_col.models)).toBe(true);
            });

            it("should provide a getter for models.length attribute", () => {
                expect(_col.length).toEqual(0);
            });
        });
    });

    describe("Tests for Model Traits", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
        const $ref = ns["pets"];

        it("should be a model", () => {
            const _model = $ref.createModelRef();
            expect(_model.$className).toEqual("PetsModel");
            expect(_model.isModel).toBe(true);
        });

    });

    describe("Properties Tests", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
        const $ref = ns["pets"];

        it("should provide ID Key for path", () => {
            const _pIdKey = $ref.createModelRef().pathIDKey;
            expect(_pIdKey).toEqual("petId");
        });
    });

    describe("End Point Tests", () => {
        const ns = Namespace(_nsSchema.namespaces.EndPointSchema);
        const _col = ns["ping"];

        test("it should have endpoint", () => {
            expect(typeof _col).toEqual("object");
            expect(`${_col.traits}`).toEqual("FetchableTrait,ModelMixin");
        });
    });

});

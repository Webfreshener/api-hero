import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";
import deepEqual from "deep-equal";

const _records = [{
    "id": "27",
    "type": "dog",
    "price": 10.99,
}, {
    "id": "29",
    "type": "fish",
    "price": 3.50,
}];

describe("Collection Mixin Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _schema = ns.builder.schemaForPath("/pets");
    const _el = ns.createElement("Pets", _schema);
    const $ref = new _el();

    it("should create a collection", () => {
        expect(Array.isArray($ref.models)).toBe(true);
    });

    it("should identify as Collection and not Model", () => {
        expect($ref["isCollection"]).toBe(true);
        expect($ref["isModel"]).toBe(false);
    });

    it("should create a model reference", () => {
        expect($ref["createModelRef"]().$className).toEqual(`${$ref.$className}Model`);
    });

    it("should be observable", () => {
        expect(typeof $ref.subscribe).toEqual("function");
    });

    it("should accept data in constructor", () => {
        const _col = new _el(_records);
        expect(deepEqual(_col.toJSON(), _records)).toBe(true);
    });
});

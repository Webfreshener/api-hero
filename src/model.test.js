import Namespace from "./namespace";
import {_nsSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";

describe("Model Tests", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreStaging);
    const _col = ns.pets;

    it("creates a model from VALID data", () => {
        const _model = _col.newModel({type: "Iguana", price: 100});
        expect(_model.data.type).toEqual("Iguana");
        expect(_model.data.price).toEqual(100);
        expect(_model.isNew).toBe(true);
        expect(_model.isDirty).toBe(false);
    });

    it("creates an empty model with INVALID keys filtered", () => {
        const _model = _col.newModel({name: "Iguana", cost: 100});
        _model.data = {name: "Cat", price: 300};
        expect(Object.keys(_model.data).length).toEqual(1);
    });

    it("creates an empty model with INVALID values filtered", () => {
        const _model = _col.newModel({type: "Iguana", price: "100"});
        _model.data = {name: "Cat", price: 300};
        expect(Object.keys(_model.data).length).toEqual(1);
    });

    it("should allow individual values to be set", () => {
        const _model = _col.newModel({type: "Cat", price: 100});
        _model.data.type = "Dog";
        expect(_model.data.type).toEqual("Dog");
    });
});
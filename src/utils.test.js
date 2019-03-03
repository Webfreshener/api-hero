import {Utils} from "./utils";
import {_nsSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";
const _schema = {
    "allOf": [{"$ref": "#/components/schemas/NewPet"}, {
        "required": ["id"],
        "properties": {"id": {"type": "integer", "format": "int64"}}
    }]
};

describe("Utils Tests Suite", () => {
    describe.skip("Utils Namespace Methods", () => {

    });

    describe("Utils Static Methods", () => {
        const _schema = _nsSchema.namespaces.PetStoreV3.schema;
        it("should get definition", () => {
            const _newPet = _schema.components.schemas.NewPet;
            const _def = Utils.getComponent("#/components/schemas/NewPet", _schema);
            expect(deepEqual(_def, _newPet)).toBe(true);
        });

        it("should get schema ref", () => {
            let _content = _schema.paths["/pets"].get.responses["200"].content;
            let _ref = Utils.getSchemaRef(_content);
            expect(_ref).toEqual("#/components/schemas/Pets");

            _content = _schema.paths["/pets"].post.responses["200"].content;
            _ref = Utils.getSchemaRef(_content);
            expect(_ref).toEqual("#/components/schemas/NewPetResponse");

            _content = _schema.paths["/pets/{petId}"].get.responses["200"].content;
            _ref = Utils.getSchemaRef(_content);
            expect(_ref).toEqual("#/components/schemas/Pet");
        });

        it("should get response schema", () => {
            let _content = _schema.paths["/pets"].get;
            let _ref = Utils.getResponseSchema(_content);
            expect(_ref.$ref).toEqual("#/components/schemas/Pets");

            _content = _schema.paths["/pets"].post;
            _ref = Utils.getResponseSchema(_content);
            expect(_ref.$ref).toEqual("#/components/schemas/NewPetResponse");

            _content = _schema.paths["/pets/{petId}"].get;
            _ref = Utils.getResponseSchema(_content);
            expect(_ref.$ref).toEqual("#/components/schemas/Pet");
        });

        it("should derive schema", () => {
            const _ops = {
                operations: _nsSchema.namespaces.PetStoreV3.schema.paths["/pets/{petId}"],
            };
            const _res = {
                "anyOf": [
                    {"$ref": "#/components/schemas/Pet"},
                ]
            };
            expect(deepEqual(Utils.deriveSchema(_ops, _schema), _res)).toBe(true);
        });
    });
});

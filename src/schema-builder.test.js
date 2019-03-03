import {EmptySchema} from "../fixtures/empty.schema";
import {_nsSchema} from "../fixtures/_schemas";
import Namespace from "./namespace";
import {SchemaBuilder} from "./schema-builder";

describe("Schema Builder Tests", () => {
    describe("operations tests", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
        it("should get collection operations", () => {
            const _colOps = ns.builder.getOperations(ns.schema.paths["/pets"]);
            const _colKeys = Object.keys(_colOps);
            expect(_colKeys.length).toEqual(3);
            expect(`${_colKeys}`).toEqual("get,post,options");
        });

        it("should get model operations", () => {
            const _modelOps = ns.builder.getOperations(ns.schema.paths["/pets/{petId}"]);
            const _modelKeys = Object.keys(_modelOps);
            expect(_modelKeys.length).toEqual(4);
            expect(`${_modelKeys}`).toEqual("get,put,delete,options");
        })
    });

    describe("tests for path", () => {
        const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
        it("should build a schema for a given path", () => {
            const _petsSchema = ns.builder.schemaForPath("/pets/{petId}");
            expect(`${Object.keys(_petsSchema)}`).toEqual("name,operations,path,components,childPaths");
            expect(_petsSchema.name).toEqual("{petId}");
            expect(_petsSchema.path).toEqual("/pets/{petId}");
        });
    });

});

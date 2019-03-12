import {_nsSchema} from "../fixtures/_schemas";
import {EmptySchema} from "../fixtures/empty.schema";
import Namespace from "./namespace";
import {default as nsSchema} from "./schemas/namespace.schema";
import {SchemaBuilder} from "./schema-builder";
import deepEqual from "deep-equal";

describe("Namespace Class Tests", () => {
    describe("Namespace Method Tests", () => {
        const ns = Namespace(EmptySchema.namespaces.Empty);
        it("should create an empty namespace", () => {
            expect(Object.keys(ns).length).toEqual(1);
            expect(typeof ns.schema).toEqual("object");
            expect(Object.keys(ns.schema.paths).length).toEqual(0);
        });

        it("should provide schema info", () => {
            expect(ns.info.title).toEqual("Empty Schema");
        });

        it("should provide schemaType object", () => {
            const _type = ns.schemaType;
            expect(_type.type).toEqual("openapi");
            expect(_type.version).toEqual("3.0.0");
        });

        it("should provide SchemaBuilder reference", () => {
            const _builder = ns.builder;
            expect(typeof _builder).toEqual("object");
            expect(_builder instanceof SchemaBuilder).toBe(true);
        });

        it("should provide $utils", () => {
            expect(ns.$utils).toBeTruthy();
            expect(ns.$utils.$scope === ns).toBe(true);
        });

        it("should provide schema", () => {
            expect(ns.schema).toBeTruthy();
            expect(deepEqual(ns.schema, EmptySchema.namespaces.Empty.schema)).toBe(true);
        });
    });


    describe("createElement Tests", () => {
        const emptyNS = Namespace(EmptySchema.namespaces.Empty);
        // const endpointNS = Namespace(EmptySchema.namespaces.EndPointSchema);
        // const petsNS = Namespace(EmptySchema.namespaces.PetStoreV3);

        it("should not create elements unless they are present", () => {
            expect(() => emptyNS.createElement()).toThrow("Name is required at arguments[0]");
            expect(() => emptyNS.createElement("Name")).toThrow("Schema is required at arguments[1]");
            expect(() => emptyNS.createElement("Name", {})).toThrow("Cannot convert undefined or null to object");
        });
    });

    describe("OpenAPI Schema Tests", () => {
        const ns = new Namespace(_nsSchema.namespaces.PetStoreV3);
        it("should validate nsSchema", () => {
            expect(ns.errors).toBe(null);
            expect(ns.pets).toBeDefined();
        });

        it("should provide schema type info", () => {
            expect(ns.schemaType.type).toEqual("openapi");
            expect(ns.schemaType.version).toEqual("3.0.1");
        });

        it("should provide an apiUrl", () => {
            expect(ns.apiUrl).toEqual("http://petstore.testing-api.com/api");
        });
    });
});

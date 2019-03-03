import {_nsSchema} from "../fixtures/_schemas";
import {EmptySchema} from "../fixtures/empty.schema";
import Namespace from "./namespace";
import {namespaceTests} from "../shared-tests/namespace-tests.shared";
import {SchemaBuilder} from "./schema-builder";

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
    });

    // describe("Swagger Schema Tests", () => {
    //     namespaceTests(_nsSchema.namespaces.PetStoreV2);
    // });

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

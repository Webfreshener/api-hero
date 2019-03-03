import {RxVO} from "rxvo";
import {default as jisty, default as jistySchema, default as Jisty} from "./schemas/jisty.schema";
import {default as nsSchema} from "./schemas/namespace.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {default as OpenAPIv3} from "./schemas/OpenAPIv3";
import {default as CollectionSchema} from "./schemas/collection.schema";

describe("Schemas Tests", () => {
    describe("Jisty", () => {
        it("should have valid jisty schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3],
                schemas:  [jisty],
                use: "http://webfreshener.com/v1/jisty.json#",
            });

            expect(_rxvo.errors).toBe(null);
        });
    });

    describe("Namespace", () => {
        it("should have valid namespace schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3],
                schemas:  [nsSchema],
                use: "http://webfreshener.com/v1/jisty/namespace.json#",
            });

            expect(_rxvo.errors).toBe(null);
        });
    });

    describe("Collection", () => {
        it("should have valid collection schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3, jistySchema],
                schemas: [CollectionSchema],
            });

            expect(_rxvo.errors).toBe(null);
        });
    });
});

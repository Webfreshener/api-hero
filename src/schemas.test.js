import {RxVO} from "rxvo";
import {default as hero, default as heroSchema, default as ApiHero} from "./schemas/api-hero.schema";
import {default as nsSchema} from "./schemas/namespace.schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {default as OpenAPIv3} from "./schemas/OpenAPIv3";
import {default as CollectionSchema} from "./schemas/collection.schema";

describe("Schemas Tests", () => {
    describe("ApiHero", () => {
        it("should have valid hero schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3],
                schemas:  [hero],
                use: "http://api-hero.webfreshener.com/v1/schema.json#",
            });

            expect(_rxvo.errors).toBe(null);
        });
    });

    describe("Namespace", () => {
        it("should have valid namespace schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3],
                schemas:  [nsSchema],
                use: "http://api-hero.webfreshener.com/v1/schema/namespace.json#",
            });

            expect(_rxvo.errors).toBe(null);
        });
    });

    describe("Collection", () => {
        it("should have valid collection schema", () => {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3, heroSchema],
                schemas: [CollectionSchema],
            });

            expect(_rxvo.errors).toBe(null);
        });
    });
});

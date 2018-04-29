import {Jisty} from "./index";
import {_nsSchema} from "../fixtures/_schemas";
import {RxVO} from "rxvo";
import ns_schema from "./ns_schema";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {default as OpenAPIv2} from "./schemas/OpenAPIv2";
import {default as OpenAPIv3} from "./schemas/OpenAPIv3";
import {default as jisty} from "./schemas/jisty.schema";

describe("Jisty init and config", () => {
    describe("Jisty Init", () => {
        it("should be defined", () => {
            expect(Jisty.init).toBeDefined();
        });
        it("should be a function", () => {
            expect(typeof Jisty.init).toBe("function");
        });
        it("should initialize a Namespace", () => {
            const _jisty = Jisty.init(_nsSchema);
            expect(_jisty.rxvo.model.namespaces.PetStore).toBeDefined();
        });
    });

    describe("Schema should define models", () => {
        it("should define rxvo object", () => {
            const _schema = new RxVO({schemas: [jsonSchema, OpenAPIv2, OpenAPIv3, jisty]});
            _schema.model = _nsSchema;
            expect(_schema.errors).toBe(null);
            expect(_schema.model.namespaces.hasOwnProperty("PetStore")).toBe(true);
        });
    })
});

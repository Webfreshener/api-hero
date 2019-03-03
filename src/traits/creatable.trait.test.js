import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";
import {CreatableTrait} from "./creatable.trait";
import {SavableTrait} from "./savable.trait";
import {createElementClass} from "../ns_element";
import {mix} from "../../vendor/mixwith";
import nock from "nock";


const createElement = (name, schema, parent = null) => {
    const ns = {
        schema: _nsSchema.namespaces.PetStoreV3,
    };
    const NSElement = createElementClass(ns, name, schema, parent);
    const _element = mix(NSElement);
    return new (class extends _element.with.apply(_element, [SavableTrait, CreatableTrait]) {
        constructor() {
            super();
        }
    })(_schema);
};

describe("Createable Trait Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _col = ns["pets"];

    it("creates a new NS Element", () => {
        const _el = createElement("PetsModel", _petsSchema, null);
        expect(_el.$className).toBe("PetsModel");
        expect(_el.schemaPath).toBe("/pets");

    });

    describe("CREATABLE Collection Record TESTS", () => {
        const _res = {"id": "27", "type": "gecko", "price": 100};
        // beforeEach(() => {
        nock("http://petstore.testing-api.com")
            .post("/api/pets/")
            .reply(201, null, {
                Location: "http://petstore.testing-api.com/api/pets/27",
            })
            .get("/api/pets/27")
            .reply(200, _res);

        it("should CREATE a record on server", (done) => {
            const _model = _col.newModel({ "type": "gecko", "price": 100});
            const _sub = _model.save().subscribe({
                complete: () => {
                    expect(_model.data.id).toBe("27");
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                }
            });
        });
    });
});

const _schema = {
    "allOf": [{"$ref": "#/components/schemas/NewPet"}, {
        "required": ["id"],
        "properties": {"id": {"type": "integer", "format": "int64"}}
    }]
};

const _petsSchema = {
    "name": "pets",
    "operations": {
        "get": {
            "description": "Returns all pets from the system that the user has access to",
            "operationId": "findPets",
            "parameters": [{
                "name": "tags",
                "in": "query",
                "description": "tags to filter by",
                "required": false,
                "style": "form",
                "schema": {"type": "array", "items": {"type": "string"}}
            }, {
                "name": "limit",
                "in": "query",
                "description": "maximum number of results to return",
                "required": false,
                "schema": {"type": "integer", "format": "int32"}
            }],
            "responses": {
                "200": {
                    "description": "pet response",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {"$ref": "#/components/schemas/Pet"}
                            }
                        }
                    }
                },
                "default": {
                    "description": "unexpected error",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}
                }
            }
        },
        "post": {
            "description": "Creates a new pet in the store.  Duplicates are allowed",
            "operationId": "addPet",
            "requestBody": {
                "description": "Pet to add to the store",
                "required": true,
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NewPet"}}}
            },
            "responses": {
                "200": {
                    "description": "pet response",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Pet"}}}
                },
                "default": {
                    "description": "unexpected error",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}
                }
            }
        }
    },
    "path": "/pets",
    "childPaths": {}
};

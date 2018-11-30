// import {default as PetStoreV2} from "./petstore.v2";
import {default as petStoreSchemaStaging} from "./petstore-staging";
import {default as petStoreSchemaV2} from "./petstore.v2";
import {default as petStoreSchemaV3} from "./petstore.v3";
import endpoint from "./endpoint-only.schema";
export const _collectionSchema = {
    name: "TestCol1",
    plural: "TestCol1",
    properties: {
        id: {
            type: "integer",
        },
        name: {
            type: "string",
        },
        value: {
            type: "integer",
        },
        createdOn: {
            type: "string",
        }
    },
};

let _nsSchema = {
    namespaces: {
        "EndPointSchema": {
            name: "EndPointSchema",
            schema: endpoint,
        },
        "PetStoreStaging": {
            name: "PetStoreStaging",
            schema: petStoreSchemaStaging
        },
        "PetStoreV2": {
            name: "PetStoreV2",
            schema: petStoreSchemaV2
        },
        "PetStoreV3": {
            name: "PetStoreV3",
            schema: petStoreSchemaV3
        },
    },
    options: {},
};

export {_nsSchema as _nsSchema};


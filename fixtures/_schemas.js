import {default as petStoreSchemaV3} from "./petstore.v3";
import endpoint from "./endpoint-only.schema";

let _nsSchema = {
    namespaces: {
        "EndPointSchema": {
            name: "EndPointSchema",
            schema: endpoint,
        },
        "PetStoreV3": {
            name: "PetStoreV3",
            schema: petStoreSchemaV3
        },
    },
    options: {},
};

export {_nsSchema as _nsSchema};


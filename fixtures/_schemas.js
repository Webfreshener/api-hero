import defaults from "../src/defaults";
import assign from "lodash.assign";
import {default as PetStorev2} from "./petstore.v2";
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

let _nsSchema = {};
assign(_nsSchema, defaults, {
    namespaces: {
        "PetStore": PetStorev2,
    },
    options: {
        VERSION: "1",
        API_VERSION: "1",
        APP_ID: "ABCDABCDABCDABCDABCDABCD",
        REST_KEY: "EFGH",
        HOST: "0.0.0.0",
        PORT: 80,
        SESSION_KEY: "ABCDABCDABCDABCDABCDABCD",
        ALLOWED: ["application/json"],
        PROTOCOL: "http",
        BASE_PATH: "/api",
        CRUD_METHODS: {
            create: "POST",
            read: "GET",
            update: "PUT",
            patch: "PATCH",
            destroy: "DELETE",
            options: "OPTIONS",
        },
    }
});

export {_nsSchema as _nsSchema};



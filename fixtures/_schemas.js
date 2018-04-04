import defaults from "../src/defaults";

export const _collectionSchema = {
    name: "TestCol1",
    plural: "TestCol1",
    description: " ",
    properties: {
        id: {
            type: "Number",
        },
        name: {
            type: "String",
        },
        value: {
            type: "Number",
        },
        createdOn: {
            type: "String",
        }
    },
};

let _nsSchema = {};
Object.assign(_nsSchema, defaults, {
    collections: {
        TestCol1: _collectionSchema
    },
});

export {_nsSchema as _nsSchema};



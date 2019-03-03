export default {
    title: "A JSON Schema for Jisty API Client 1.0.",
    id: "http://webfreshener.com/v1/jisty.json#",
    $schema: "http://json-schema.org/draft-04/schema#",
    required: ["namespaces"],
    properties: {
        namespaces: {
            type: "object",
            patternProperties: {
                "/\"?[a-zA-Z0-9_\-\s]+\"?$/": {
                    $ref: "#/definitions/namespace",
                },
            },
            default: {},
        },
        options: {
            type: "object",
            properties: {},
        },
    },
    definitions: {
        openAPIv2: {
            allOf: [{
                $schema: "http://swagger.io/v2/schema.json#",
            }],
        },
        openAPIv3: {
            allOf: [{
                $schema: "http://openapis.org/v3/schema.json#",
            }],
        },
        operation: {
            allOf: [{
                $schema: "http://swagger.io/v2/schema.json#/definition/operation",
            }],
        },
        paths: {
            allOf: [{
                $schema: "http://swagger.io/v2/schema.json#/definition/paths",
            }],
        },
        collection: {
            type: "object",
            required: ["name", "operations", "childPaths"],
            properties: {
                name: {
                    type: "string"
                },
                path: {
                    type: "string",
                },
                operations: {
                    $ref: "#/definitions/operation",
                },
                childPaths: {
                    $ref: "#/definitions/paths",
                }
            },
        },
        collections: {
            id: "http://webfreshener.com/v1/jisty.json#/collections",
            type: "array",
            items: {
                $ref: "#/definitions/collection",
            }
        },
        schema: {
            anyOf: [{
                $ref: "#/definitions/openAPIv2"
            }, {
                $ref: "#/definitions/openAPIv3"
            }]
        },
        options: {
            type: "object",
            properties: {},
        },
        namespace: {
            type: "object",
            required: ["name", "schema"],
            properties: {
                name: {
                    type: "string",
                    // pattern: "^[a-zA-Z0-9_\-\s]+",
                },
                collections: {
                    $ref: "#/definitions/collections",
                },
                schema: {
                    $ref: "#/definitions/schema",
                },
                options: {
                    $ref: "#/definitions/options",
                },
            },
        },
    }
}
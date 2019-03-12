export default {
    title: "ApiHero API Client 1.0",
    description: "Configuration Schema for NameSpaces and Framework Options",
    id: "http://api-hero.webfreshener.com/v1/schema.json#",
    $schema: "http://json-schema.org/draft-04/schema#",
    required: ["namespaces"],
    properties: {
        namespaces: {
            type: "object",
            patternProperties: {
                "^[a-zA-Z0-9_$]+$": {
                    $ref: "#/definitions/namespace",
                },
            },
        },
        options: {
            type: "object",
            properties: {
                plugins: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/plugin",
                    },
                },
                callbacks: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/plugin",
                    },
                },
            },
            patternProperties: {
                "^[xX]{1}\-[a-zA-Z0-9\-_$]+": {},
            }
        },
    },
    definitions: {
        ajvOptions: {

        },
        callback: {
            type: "object",
            required: ["scope"],
            properties: {
                scope: {
                   $ref: "#/definitions/nsName",
                }
            }
        },
        nsName: {
            description: "url safe accessor for use in the namespace",
            type: "string",
            pattern: "^[a-zA-Z0-9_\$]+$",
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
        plugin: {
            type: "object",
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
            id: "http://api-hero.webfreshener.com/v1/schema.json#/collections",
            type: "array",
            items: {
                $ref: "#/definitions/collection",
            }
        },
        schema: {
            anyOf: [{
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
                    $ref: "#/definitions/nsName",
                },
                schema: {
                    $ref: "#/definitions/schema",
                },
                options: {
                    $ref: "#/definitions/options",
                },
                description: {
                    description: "a user provided description of the namespace (optional)",
                    type: "string",
                }
            },
        },
    },
    examples: [{
        namespaces: {
            name: "NS1",
            schema: {
                $ref: "$SCHEMA_ID"
            },
        },
        options: {},
    }],
};

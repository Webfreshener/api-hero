export default {
    title: "A JSON Schema for Jisty API Client 1.0.",
    id: "http://webfreshener.com/v1/schema.json#",
    $schema: "http://json-schema.org/draft-04/schema#",
    required: ["namespaces"],
    namespaces: {
        type: "object",
        patternProperties: {
            "[a-zA-Z0-9\-_^$": {
               $ref: "#/definitions/namespace",
            },
        },
        default: {},
    },
    properties: {

    },
    definitions: {
        namespace: {
            required: ["name", "schema"],
            properties: {
                name: {
                    type: "string",
                    pattern: "^a-z0-9_",
                },
                collections: {
                    $ref: "#/defintions/collections",
                },
                schema: {
                    $ref: "#/defintions/schema",
                },
                options: {
                    $ref: "#/defintions/options",
                },
            },
        },
        collections: {

        },
        schema: {
            oneOf: [{
                $ref: "http://swagger.io/v2/schema.json#"
            }, {
                $ref: "http://swagger.io/v3/schema.json#"
            }]
        },
        options: {

        }
    }


}
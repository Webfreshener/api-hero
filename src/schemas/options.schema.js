export default {
    id: "http://webfreshener.com/v1/jisty/options.json#",
    $schema: "http://json-schema.org/draft-04/schema#",
    properties: {
        server: {
            type: "object",
            properties: {
                index: {
                    type: "number",
                },
                parameters: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/Value",
                    },
                },
            },
        },
        idKey: {
            type: "string",
            default: "id"
        }
    },
    required: ["server"],
    definitions: {
        Value: {
            type: "object",
            required: ["name", "value"],
            properties: {
                name: {
                    type: "string"
                },
                value: {
                    type: "string"
                },
            }
        }
    }
};

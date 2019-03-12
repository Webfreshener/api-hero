export default {
    id: "http://api-hero.webfreshener.com/v1/schema/options.json#",
    $schema: "http://json-schema.org/draft-04/schema#",
    required: ["server"],
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
        dataKey: {
            type: "string",
            default: "",
        },
        idKey: {
            type: "string",
            default: "id",
        }
    },
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

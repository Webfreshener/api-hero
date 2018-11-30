export default {
    id: "patch",
    type: "array",
    items: {
        oneOf: [{
            $ref: "#/definitions/valueType",
        }, {
            $ref: "#/definitions/transformType",
        },]
    },
    definitions: {
        valueType: {
            type: "object",
            required: ["op", "path", "value"],
            op: {
                type: "string",
                enum: ["add", "replace", "test",],
            },
            path: {
                type: "string",
            },
            value: {
            },
        },
        transformType: {
            type: "object",
            required: ["op", "path", "to", "from"],
            properties: {
                op: {
                    type: "string",
                    enum: ["copy", "move", "remove",],
                },
                path: {
                    type: "string",
                },
                from: {
                    type: "string",
                },
                to: {
                    type: "string",
                },
            }
        }
    }
}
export default {
    title: "A JSON Schema for Jisty Namespace Objects",
    id: "http://webfreshener.com/v1/jisty/namespace.json#",
    // $schema: "http://webfreshener.com/v1/jisty.json#/definitions/namespace",
    allOf: [{
        $ref: "http://webfreshener.com/v1/jisty.json#/definitions/namespace",
    }],

    // properties: {
    //     name: {
    //         type: "string",
    //         pattern: "^a-z0-9_",
    //     },
    //     collections: {
    //         $ref: "#/definitions/collections",
    //     },
    //     schema: {
    //         $ref: "#/definitions/schema",
    //     },
    //     options: {
    //         $ref: "#/definitions/options",
    //     },
    // },

    // required: ["name", "schema"],
    // properties: {
    //     name: {
    //         type: "string",
    //         pattern: "^a-z0-9_",
    //     },
    //     collections: {
    //         type: "object",
    //         properties: {},
    //     },
    //     options: {
    //         type: "object",
    //         properties: {},
    //     },
    // },
}

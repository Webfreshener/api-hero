const schema = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "No Traits Schema",
        description: "An API Spec that allows for no operations. Used to test traits assignment",
    },
    servers: [
        {
            "url": "http://petstore.swagger.io/api"
        }
    ],
    paths: {
        "/nada": {},
    },
    components: {
        schemas: {
            Nada: {
                required: [
                    "name"
                ],
                properties: {
                    name: {
                        type: "string"
                    },
                    tag: {
                        type: "string"
                    }
                }
            },
        },
    },
};

let _nsSchema = {
    namespaces: {
        "NoTraits": {
            name: "NoTraits",
            schema: schema
        },
    },
    options: {},
};

export {_nsSchema as NoTraitsSchema};
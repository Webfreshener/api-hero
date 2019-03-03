const schema = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Empty Schema",
        description: "An Empty API Spec for testing",
    },
    servers: [
        {
            "url": "http://petstore.swagger.io/api"
        }
    ],
    paths: {
    },
    "components": {
        "schemas": {},
    },
};

let _nsSchema = {
    namespaces: {
        "Empty": {
            name: "Empty",
            schema: schema
        },
    },
    options: {}
};

export {_nsSchema as EmptySchema};
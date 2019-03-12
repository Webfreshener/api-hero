export default {
    title: "ApiHero Collection Element",
    description: "A collection element is any listable namespace element and comprises of " +
        "4 properties: name, operations, path and child path",
    examples: [{
        "name": "pets",
        "path": "/pets",
        "childPaths": "/pets/{petId}",
        "operations": {
            "get": {
                "responses": {
                    "200": {
                        "description": "200 response",
                        "headers": {
                            "Access-Control-Allow-Origin": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        },
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Pets"
                                },
                            },
                        },
                    },
                },
            },
        },
    }],
    id: "http://api-hero.webfreshener.com/v1/schema/collection.json#",
    allOf: [{
        $ref: "http://api-hero.webfreshener.com/v1/schema.json#/definitions/collection",
    }],
}

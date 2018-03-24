export default {
    type: "Object",
    extensible: false,
    elements: {
        collections: {
            type: "Object",
            required: true,
            elements: {
                "*": {
                    type: "Object",
                    elements: {
                        name: {
                            type: "String",
                            required: true,
                            restrict: "^[a-zA-Z0-9_]+$",
                        },
                        description: {
                            type: "String",
                            required: false,
                            default: " ",
                            restrict: "^[\\w\\s\\W]+$",
                        },
                        plural: {
                            type: "String",
                            required: false,
                            restrict: "^[a-zA-Z0-9_]+$",
                        },
                        properties: {
                            type: "Object",
                            required: true,
                            extensible: false,
                            elements: {
                                "*": {
                                    type: "Object",
                                    elements: {
                                        default: {
                                            type: "*",
                                            required: false,
                                        },
                                        defaultFn: {
                                            type: "String",
                                            required: false,
                                            restrict: "^(guid|uuid|uuidv4|now)+$",
                                        },
                                        description: {
                                            type: "String",
                                            required: false,
                                            restrict: "^((?!\"|\\b|\\f|\\n|\\r|\\t|\\u).)*$",
                                        },
                                        id: {
                                            required: false,
                                            polymorphic: [
                                                {
                                                    type: "Boolean",
                                                },
                                                {
                                                    type: "Object",
                                                    elements: {
                                                        type: {
                                                            type: "String",
                                                            required: true,
                                                            restrict: "^(String|Number)+$",
                                                        },
                                                        id: {
                                                            type: "Boolean",
                                                            required: true,
                                                        },
                                                        generated: {
                                                            type: "Boolean",
                                                            required: false,
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        index: {
                                            type: "Boolean",
                                            required: false,
                                        },
                                        type: {
                                            type: "String",
                                            required: true,
                                            restrict: "^(any|Array|Boolean|Buffer|Date|GeoPoint|Number|Object|String)+$",
                                        },
                                        required: {
                                            type: "Boolean",
                                            required: false,
                                            default: false,
                                        },
                                        length: {
                                            type: "Number",
                                            required: false,
                                            default: null,
                                        },
                                        precision: {
                                            type: "Number",
                                            required: false,
                                            default: null,
                                        },
                                        scale: {
                                            type: "Number",
                                            required: false,
                                            default: null,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        options: {
            type: "Object",
            required: true,
            elements: {
                ALLOWED: {
                    type: "Array",
                    required: true,
                    elements: [{
                        type: "String",
                        required: false,
                    }],
                },
                VERSION: {
                    type: "String",
                    required: false,
                    restrict: ["\\\\bv?(?:0|[1-9]\\\\d*)\\\\.(?:0|[1-9]\\\\d*)\\\\.(?:0|[1-9]\\\\d*)(?:-[\\\\da-z\\\\-]+(?:\\\\.[\\\\da-z\\\\-]+)*)?(?:\\\\+[\\\\da-z\\\\-]+(?:\\\\.[\\\\da-z\\\\-]+)*)?\\\\b", "ig"],
                },
                APP_ID: {
                    type: "String",
                    required: true,
                    restrict: "^[a-zA-Z0-9]{16,32}$"
                },
                APP_ID_PARAM_NAME: {
                    type: "String",
                    required: false,
                },
                REST_KEY: {
                    type: "String",
                    required: true,
                    restrict: "^[a-zA-Z0-9]{16,32}$",
                },
                REST_KEY_PARAM_NAME: {
                    type: "String",
                    required: false,
                },
                SESSION_TOKEN: {
                    type: "String",
                    required: false,
                },
                SESSION_KEY: {
                    type: "String",
                    required: true,
                    restrict: "^[a-zA-Z0-9]{16,32}$",
                },
                CSRF_TOKEN: {
                    type: "String",
                    required: false,
                    restrict: "^[a-zA-Z0-9]{16,32}$",
                },
                API_VERSION: {
                    type: "String",
                    required: true,
                },
                MAX_BATCH_SIZE: {
                    type: "Number",
                    required: false,
                    default: 50,
                },
                DEFAULT_FETCH_LIMIT_OVERRIDE: {
                    type: "Number",
                    required: false,
                    default: 50000,
                },
                UNDEFINED_CLASSNAME: {
                    type: "String",
                    required: false,
                    default: "__UNDEFINED_CLASSNAME__",
                    restrict: "^[a-zA-Z0-9_]+$",
                },
                API_URI: {
                    type: "String",
                    required: false,
                    default: "/api",
                    restrict: "^[a-zA-Z0-9_]+$",
                },
                CORS: {
                    type: "Boolean",
                    required: false,
                    default: false,
                },
                PROTOCOL: {
                    type: "String",
                    required: false,
                    default: "http",
                    restrict: "^(HTTP|http)+(S|s)?$",
                },
                HOST: {
                    type: "String",
                    required: false,
                    default: "127.0.0.1",
                    restrict: "^(?:[0-9]{1,3}\\\\.){3}[0-9]{1,3}$",
                },
                PORT: {
                    type: "Number",
                    required: false,
                    default: 3000,
                },
                BASE_PATH: {
                    type: "String",
                    required: false,
                    default: "/api",
                    restrict: "^\\\\/+[a-zA-Z0-9_\\\\/\\\\.\\\\-]+$",
                },
                CAPITALIZE_CLASSNAMES: {
                    type: "Boolean",
                    required: false,
                    default: true,
                },
                CRUD_METHODS: {
                    type: "Object",
                    required: true,
                    extensible: true,
                    elements: {
                        create: {
                            type: "String",
                            required: false,
                            restrict: "^POST+$",
                        },
                        read: {
                            type: "String",
                            required: false,
                            restrict: "^GET+$",
                        },
                        update: {
                            type: "String",
                            required: false,
                            restrict: "^PUT+$",
                        },
                        destroy: {
                            type: "String",
                            required: false,
                            restrict: "^DELETE+$",
                        },
                    },
                },
                QUERY_PARAM: {
                    type: "String",
                    required: false,
                    restrict: "^[a-zA-Z0-9_]+$",
                },
            },
        },
    },
};

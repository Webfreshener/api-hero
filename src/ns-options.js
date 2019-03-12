import {RxVO} from "rxvo";
import merge from "lodash.merge";
import {default as jsonSchema} from "./schemas/json-schema-draft04";
import {default as _optionsSchema} from "./schemas/options.schema";
const _opts = new WeakMap();

const _defaultOptions = {
    server: {
        index: 0,
        parameters: [],
    },
    idKey: "id",
};

export class NSOptions {
    constructor(config = {}) {
        const _schema = new RxVO({
            meta: [jsonSchema],
            schemas: [_optionsSchema],
            use: "http://api-hero.webfreshener.com/v1/schema/options.json#",
        });

        _schema.model = merge({}, _defaultOptions, config);

        if (_schema.errors !== null) {
            console.log(`invalid config options:\n${JSON.stringify(_schema.errors)}`);
        }

        _opts.set(this, _schema);
    }

    get dataKey() {
        return _opts.get(this).model.dataKey;
    }

    get idKey() {
        return _opts.get(this).model.idKey;
    }

    /**
     *
     * @returns {number}
     */
    get serverIndex() {
        return _opts.get(this).model.server.index;
    }

    /**
     *
     * @returns {Array}
     */
    get serverParameters() {
        return _opts.get(this).model.server.parameters;
    }
}

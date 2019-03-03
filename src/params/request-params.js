/**
 *
 * @param params
 * @returns {{id: string, properties: {}}}
 */
import {ParamsItem} from "./params-item";

/**
 *
 * @param params
 * @returns {{id: string, properties: {}, required: Array}}
 */
const createSchemaFor = (params) => {
    const _o = {
        id: "reqParams#",
        properties: {},
        required: [],
    };


    params.forEach((p) => {
        Object.defineProperty(_o.properties, p.name, {
            value: p.schema,
            enumerable: true,
            configurable: false,
        });

        if (p.required) {
            _o.required.push(p.name);
        }
    });

    return _o;
};

export class RequestParams {
    constructor(target, reqParams=[], values={}) {
        Object.defineProperty(this, "$element", {
            get: () => target,
            enumerable: false,
            configurable: false,
        });

        ["cookie",  "headers", "path",  "query"].forEach((type) => {
            const _params = createSchemaFor(reqParams.filter((param) => param.in === type));
            Object.defineProperty(this, type, {
                value: new ParamsItem(_params, values[type] || {} ),
                enumerable: true,
                configurable: false,
            });
        });
    }

    get path() {
        this.path
    }
}


import {RxVO} from "rxvo";
import * as jsonSchema from "../schemas/json-schema-draft04";
import * as jisty from "../schemas/jisty.schema";
const _params = new WeakMap();

export class ParamsItem {
    /**
     *
     * @param schema
     * @param config
     */
    constructor(schema, values = null) {
        const _rxvo = new RxVO({
            meta: [jsonSchema],
            schemas: [jisty, schema],
            use: "reqParams#",
        });

        Object.defineProperty(this, "propertyNames", {
            get: () => Object.keys(schema.properties),
            enumerable: true,
            configurable: false,
        });

        if (values !== null) {
            _rxvo.model = values;
        }

        _params.set(this, _rxvo);
    }

    /**
     *
     * @param handlers
     * @returns {*|Subscription|TeardownLogic|Unsubscribable|Promise<PushSubscription>}
     */
    subscribe(handlers) {
        return _params.get(this).subscribe(handlers)
    }

    /**
     *
     * @param vals
     */
    set data(vals) {
        _params.get(this).model = vals;
    }

    /**
     *
     * @returns {*}
     */
    get data() {
        return _params.get(this).model;
    }

    /**
     *
     * @param key
     * @param val
     * @returns {*}
     */
    setValue(key, val) {
        return this.data[key] = val;
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    getValue(key) {
        return this.data[key];
    }

    /**
     *
     * @returns {*}
     */
    valueOf() {
        return this.values.$model.valueOf()
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return `${this.data}`;
    }

    /**
     *
     * @returns {*}
     */
    toJSON() {
        return this.data.$model.toJSON();
    }
}

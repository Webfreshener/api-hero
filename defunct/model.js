import {RxVO} from "rxvo";
import {_cids, _modelStats, _modelRefs} from "../src/_references";
import {NSElement} from "../src/ns_element";
import {default as jsonSchema} from "../src/schemas/json-schema-draft04";
import {default as OpenAPIv3} from "../src/schemas/OpenAPIv3";
import {default as heroSchema} from "../src/schemas/api-hero.schema";
import {default as OpenAPIv2} from "../src/schemas/OpenAPIv2";
import {default as CollectionSchema} from "../src/schemas/collection.schema";
import deepEqual from "deep-equal";
import foreach from "lodash.foreach";
import uniqueid from "lodash.uniqueid";
import {assignTraits} from "./traits";
import {Utils} from "../src/utils";
const _stateRefs = new WeakMap();

export class Model extends NSElement {
    constructor(schema, collection) {
        super(schema);
        const $cid = uniqueid(collection.$className).toUpperCase();
        Object.defineProperty(this, "$cid", {
            get: () => $cid,
            enumerable: false,
        });

        _modelStats.set(this, {
            isNew: true,
            isDirty: false,
        });

        assignGetters(this, collection);

        const _derived = Utils.deriveSchema(collection.$schema, collection.$scope.schema);
        const _ajvSchema = Object.assign({id: "collectionSchema#"}, _derived);

        _stateRefs.set(this, []);

        // creates RxVO and subscribes to events on root
        try {
            const _rxvo = new RxVO({
                meta: [jsonSchema, OpenAPIv3, heroSchema],
                schemas: [OpenAPIv2, CollectionSchema, _ajvSchema],
                use: "collectionSchema#"
            }, {
                ajvOptions: {
                    removeAdditional: "all",
                }
            });
            _rxvo.subscribe({
                next: (d) => {
                    const _states = _stateRefs.get(this);
                    _states.splice(_states.length - 1, 0, d.toJSON());
                    if (_states.length > 2 ) {
                        _states.shift()
                    }
                   _modelStats.get(this).isDirty = true;
                },
            });

            // stores RxVO ref to WeakMap
           _modelRefs.set(this, _rxvo);

        } catch (e) {
            return false;
        }

        assignTraits(this);
        _cids.get(collection)[this.$cid] = this;
    }

    //
    // Accessor Methods
    //

    get url() {
        return `${super.url}${this.id !== null ? "/" + this.id : ""}`;
    }

    /**
     * retrieves ID of record if set
     * @returns {string|number|UUID|null}
     */
    get id() {
        return this.data["id"] || null;
    }

    /**
     *
     * @returns {}
     */
    get data() {
        return _modelRefs.get(this).model;
    }

    /**
     * sets data to RxVO Document
     * @param d
     */
    set data(d) {
        _modelRefs.get(this).model = d;
    }

    //
    // MetaData Accessors
    //

    /**
     * returns creation time of Model in Application
     * @returns {*}
     */
    get modelCreatedOn() {
        return this.$metadata.createdOn;
    }

    /**
     * returns last updated time of Model in Application
     * @returns {null|*}
     */
    get modelUpdatedOn() {
        return this.$metadata.updatedOn;
    }


    //
    // RXJS
    //

    /**
     *
     * @param handler
     */
    subscribe(handler) {
        return this.data.$model.subscribe(handler);
    }

    //
    // Validation Methods
    //

    /**
     * @returns {boolean|string}
     */
    validate() {
        return this.data.$model.validate();
    }

    /**
     * returns validation errors
     */
    get errors() {
        return this.data.$model.rxvo.errors;
    }

    /**
     *
     * @returns {boolean}
     */
    get isValid() {
        return _cids.get(this.$parent)[this.$cid].$model.isValid;
    }

    get isNew() {
        return _modelStats.get(this).isNew;
    }

    get isDirty() {
        const _states = [].concat(_stateRefs.get(this));
        console.log(`_states: ${_states}`);
        return void(0); //_states.length > 0 && !deepEqual(_states[0], this.toJSON());
    }

    toJSON() {
        return _modelRefs.get(this).toJSON();
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }

}

/**
 * @param target
 */
const assignGetters = (target, collection) => {
    // defines getter for owner Collection reference
    Object.defineProperty(target, "$parent", {
        get: () => collection,
        enumerable: false,
    });

    Object.defineProperty(target, "$scope", {
        get: () => collection.$scope,
        enumerable: false,
    });

    Object.defineProperty(target, "$className", {
        get: () => collection.$className,
        enumerable: false,
        configurable: false,
    });
};

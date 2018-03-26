const _metaObjects = new WeakMap();
/**
 *
 */
export default class {
    /**
     *
     * @param observableModel
     */
    constructor(observableModel) {
        _metaObjects.set(this, {
            createdOn: Date.now(),
            updatedOn: null,
            currentData: observableModel.data,
            cached: [],
        });
        const _self = this;
        observableModel.subscribe({
            next: (data) => {
                const o = _metaObjects.get(_self);
                o.updatedOn = Date.now();
                o.cached.splice(-1, 0, o.currentData);
                o.currentData = data;
            },
        });
    }

    /**
     *
     * @returns {number | *}
     */
    get createdOn() {
        return _metaObjects.get(this).createdOn;
    }

    /**
     *
     * @returns {null | number |*}
     */
    get updatedOn() {
        return _metaObjects.get(this).updatedOn;
    }

}
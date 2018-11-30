import {NSElement} from "./ns_element";
import {_collectionSubjects} from "./_references";
const _subs = new WeakMap();
export class CollectionProxy {
    /**
     * @returns {Array}
     */
    static create(collectionInstance) {
        _subs.set(collectionInstance, {});
        return new Proxy([], proxyHandler(collectionInstance));
    }
}

/**
 *
 * @param target
 * @returns Proxy
 */
const proxyHandler = (target) => {
    const _base = {
        setPrototypeOf: () => false,
        isExtensible: (t) => Object.isExtensible(t),
        preventExtensions: (t) => Object.preventExtensions(t),
        getOwnPropertyDescriptor: (t, key) => Object.getOwnPropertyDescriptor(t, key),
        defineProperty: (t, key, desc) => Object.defineProperty(t, key, desc),
        has: (t, key) => key in t,
        ownKeys: (t) => Reflect.ownKeys(t),
        apply: () => false,
    };

    return Object.assign(_base, {
        get: (t, idx) => {
            if (idx === "length") {
                return t.length;
            }

            if (idx in Array.prototype) {
                // only handle methods that modify the reference array
                if (["fill", "pop", "push", "shift", "splice", "unshift"].indexOf(idx) > -1) {
                   return applyMethod(target, t, idx);
                } else {
                    return t[idx];
                }
            }

            if (idx === "$model") {
                return this;
            }

            return t[idx];
        },
        set: (t, idx, value) => {
            if (idx in Array.prototype) {
                // do nothing against proto props
                return true;
            }
            t[idx] = value;
            return true;
        },

        deleteProperty: (t, idx) => {
            return deleteTrap(target, t, idx);
        }
    });
};

/**
 * Handles Proxy Delete Trap for Array elements
 * @param model
 * @param t
 * @param idx
 * @returns {boolean}
 */
const deleteTrap = (target, t, idx) => {
    const _s = _collectionSubjects.get(target);
    // creates mock of future Model state for evaluation
    let _o = [].concat(t);
    try {
        // attempts splice method to
        // remove item at given index index
        _o.splice(idx, 1);
    } catch (e) {
        return false;
    }

    // applies operation
    t.splice(idx, 1).forEach((itm) => {
        _s[itm.$cid].unsubscribe();
    });

    return true;
};

/**
 * subscribes to NSElement's BehaviorSubject
 * @param target
 * @param item
 */
const subscribeToItem = (target, item) => {
    const _s = _collectionSubjects.get(target);
    _subs.get(target)[item.$cid] = item.subscribe({
        next: (m) => _s.next(m),
        error: (e) => _s.error(e),
    });
};

/**
 * unsubscribes from NSElement's BehaviorSubject
 * @param target
 * @param arr
 * @param idx
 */
const unsubAtIdx = (target, arr, idx) => {
    if (arr.length) {
        const _m = _subs.get(target)[arr[idx].$cid];
        if (_m.hasOwnProperty("unsubscribe")) {
            _m.unsubscribe();
        }
    }
};

/**
 * Handles proxy get for Array proto methods
 * @param model
 * @param t
 * @param idx
 * @returns {function(...[*]=)}
 */
const applyMethod = (target, t, idx) => {
    const isModel = (m) => (m instanceof NSElement);
    // returns closure analog to referenced method
    return (...args) => {
        // mocks current model state
        const _arr = [].concat(t);
        if (idx.match(/^(push|splice|concat|unshift|fill)$/)) {
           switch (idx) {
               case "push":
               case "concat":
               case "unshift":
               case "fill":
                   try {
                       args.forEach((m) => {
                           if (!isModel(m)) {
                               throw Error("not a model");
                           } else {
                               subscribeToItem(target, m);
                           }
                       });
                   } catch (e) {
                       return false;
                   }
                   break;
               case "splice":
                   try {
                       let _spArgs = [];
                       if (args[2] !== void(0)) {
                           _spArgs = Array.isArray(args[2]) ? args[2] : [args[2]];
                       }
                       _spArgs.forEach((m) => {
                           if (!isModel(m)) {
                               throw Error("not a model");
                           } else {
                               subscribeToItem(target, m);
                           }
                       });
                   } catch (e) {
                       return false;
                   }
                   break;
           }
        }

        if (idx.match(/^(pop|shift)$/)) {
            switch (idx) {
                case "pop":
                    unsubAtIdx(target, t, t.length - 1);
                    break;
                case "shift":
                    unsubAtIdx(target, t, 0);
                    break;
            }
        }

        // applies method to model state
        const _r = t[idx].apply(t, args);
        _collectionSubjects.get(target).next(target.models);
        return _r;
    }
};

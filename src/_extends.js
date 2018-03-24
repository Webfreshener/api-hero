// the extends function is not already defined within the current
// context; therefore, define it
export default function (child, parent) {

    // mixin pattern for copying parent constructor function properties
    // as static properties to the child constructor function
    // properties on constructor function are commonly known as static
    // properties
    for (var parentPropertyName in parent) {

        // only copy properties specifically defined on the parent
        if (parent.hasOwnProperty(parentPropertyName)) {
            // for primitive types, this will copy the value,
            // for object types, this will copy the reference only
            child[parentPropertyName] = parent[parentPropertyName];
        }
    }

    // constructor function for the object that instantiated child objects
    // will inherit from
    // this function is unique within the context of each call to extend

    function __() {
        this.constructor = child;
    }

    if (parent === null) {

        // objects instantiated with the child constructor function will
        // inherit from an object that inherits from nothing, not even
        // the built-in JavaScript Object
        child.prototype = Object.create(parent);

    } else {

        // assign the prototype property of the parent constructor function
        // to the prototype property of the constructor function defined
        // above
        __.prototype = parent.prototype;

        // create the object that all instances of the child will inherit
        // from, and assign it to the prototype property of the child
        // constructor function
        child.prototype = new __();
    }

};
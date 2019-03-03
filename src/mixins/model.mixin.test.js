import Namespace from "../namespace";
import {_nsSchema} from "../../fixtures/_schemas";
import deepEqual from "deep-equal";

const _newData = {
    type: "cat",
    price: 50,
};

const _invalidData = {
    type: "iguana",
    price: "100",
};

const _validData = {
    type: "gecko",
    price: 100,
};

describe("Model Mixin Test Suite", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStoreV3);
    const _schema = ns.builder.schemaForPath("/pets/{petId}");
    const _el = ns.createElement("PetModel", _schema);


    describe("Model Method Tests", () => {
        const $ref = new _el();

        it("should create a model", () => {
            expect((typeof $ref.data === "object") && !Array.isArray($ref.data)).toBe(true);
        });

        it("should provide a toJSON method", () => {
            expect($ref.toJSON).toBeTruthy();
            expect(typeof $ref.toJSON() === "object").toBe(true);
            expect(deepEqual($ref.toJSON(), _validData));
        });

        it("should provide a toString method", () => {
            expect($ref.toString).toBeTruthy();
            expect(typeof $ref.toString() === "string").toBe(true);
            expect(deepEqual(JSON.parse($ref.toString()), _validData));
        });

        it("should provide schema path", () => {
            expect($ref.schemaPath).toEqual("/pets/{petId}");
        });

        it("should be observable", (done) => {
            expect($ref.subscribe).toBeTruthy();
            $ref.subscribe({
                next: (m) => {
                    expect(deepEqual(m.model, _newData)).toBe(true);
                    done();
                },
                error: (e) => {
                    done(e);
                }
            });
            $ref.data = _newData;
        });
    });

    describe("Model State Tests", () => {
        it("should report newness", (done) => {
            const $ref = new _el(_newData);
            const _sub = $ref.subscribe({
                next: (d) => {
                    _sub.unsubscribe();
                    expect($ref.isNew).toBe(false);
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                },
            });
            expect($ref.isNew).toBe(true);
            $ref.data[$ref.idKey] = "100";
        });

        it("should report dirtiness", (done) => {
            const $ref = new _el();
            const _sub = $ref.subscribe({
                next: (d) => {
                    _sub.unsubscribe();
                    expect($ref.isDirty).toBe(true);
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                },
            });
            expect($ref.isDirty).toBe(false);
            $ref.data.price = 100;
        });
    });

    describe("Validation Tests", () => {
        const $ref = new _el();

        it("should accept data in constructor", () => {
            const $ref = new _el(_validData);
            expect(deepEqual($ref.data, _validData)).toBe(true);
        });

        it("should reject invalid data", () => {
            $ref.data = Object.assign({}, _invalidData);
            expect(deepEqual($ref.data, _validData)).toBe(false)
        });

        it("should report as invalid", () => {
            expect($ref.isValid).toBe(false);
        });

        it("should provide errors", () => {
            expect($ref.errors === null).toBe(false);
            expect(typeof $ref.errors === "object").toBe(true);
        });

        it("should fail validation on invalid data", () => {
            expect($ref.validate(_invalidData) === true).toBe(false)
        });

        it("should verify newness", () => {
            expect($ref.isNew).toBe(true);
        });

        it("should pass validation on valid data", () => {
            expect($ref.validate(_validData) === true).toBe(true)
        });

        it("should report as valid", () => {
            expect($ref.isValid).toBe(true);
        });

        it("should accept valid data", () => {
            $ref.data = _validData;
            expect($ref.errors === null).toBe(true);
            expect(deepEqual($ref.data, _validData)).toBe(true)
        });
    });
});

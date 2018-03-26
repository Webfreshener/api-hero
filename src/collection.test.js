import Namespace from "./namespace";
import {_nsSchema, _collectionSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";
describe("Collection Class Tests", () => {
    const ns = Namespace(_nsSchema);
    const _col = ns.TestCol1;

    it("should define a collection from a Schema", () => {
        expect(deepEqual(_col.$schema, _collectionSchema)).toBe(true);
    });

    it("should accept VALID models", () => {
        _col.models = [
            {
                name: "Foo",
                value: 0,
            },
            {
                name: "Bar",
                value: 1,
            },
            {
                name: "Baz",
            },
        ];
        expect(_col.length).toBe(3);
    });

    it("should reset it's contents", () => {
        _col.reset();
        expect(_col.length).toBe(0);
    });

    it("should reject INVALID models", () => {
        _col.models = [
            {
                name: "Foo",
                value: "0",
            },
            {
                name: "Bar",
                value: "1",
            },
            {
                name: 123,
            },
        ];
        expect(_col.length).toBe(0);
    });
});
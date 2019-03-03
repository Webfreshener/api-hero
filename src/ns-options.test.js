import {NSOptions} from "./ns-options";

describe("NSOptions Test Suite", () => {
    it("should provide defaults", () => {
        let opts = new NSOptions();
        expect(opts.serverIndex).toEqual(0);
        expect(Array.isArray(opts.serverParameters)).toBe(true);
        expect(opts.serverParameters.length).toBe(0);
    });

    it("should accept configured values", () => {
        let opts = new NSOptions({
            server: {
                index: 1,
                parameters: [{name: "foo", value: "bar"}],
            }
        });

        expect(opts.serverIndex).toEqual(1);
        expect(Array.isArray(opts.serverParameters)).toBe(true);
        expect(opts.serverParameters.length).toBe(1);
        expect(opts.serverParameters[0].name).toEqual("foo");
        expect(opts.serverParameters[0].value).toEqual("bar");
    })
});
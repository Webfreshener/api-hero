import {Jisty} from "./index";
import {_nsSchema} from "../fixtures/_schemas";

describe("Jisty Init", () => {
    it("should be defined", () => {
        expect(Jisty.init).toBeDefined();
    });
    it("should be a function", () => {
        expect(typeof Jisty.init).toBe("function");
    });
    it("should initialize a Namespace", () => {
        const _jisty = Jisty.init({111: _nsSchema});
        expect(_jisty["111"]).toBeDefined();
    });
});
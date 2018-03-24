import {Jisty} from "./index";

describe("Jisty Init", () => {
    it("should init", () => {
       const _jisty = Jisty.init({foo: {}});
       _jisty.foo = "fucked up";
       console.log(_jisty.foo);
    });
});
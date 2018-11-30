import {Jisty} from "./index";
import {_nsSchema} from "../fixtures/_schemas";
import {RxVO} from "rxvo";

describe("Jisty init and config", () => {
    it("should have init defined", () => {
        expect(Jisty.init).toBeDefined();
        expect(typeof Jisty.init).toBe("function");
    });

    it("should initialize a Namespace", () => {
        const _jisty = Jisty.init(_nsSchema);
        expect(_jisty.rxvo.errors).toEqual(null);
        expect(_jisty.rxvo.model.namespaces.EndPointSchema).toBeDefined();
        expect(_jisty.rxvo.model.namespaces.PetStoreStaging).toBeDefined();
        expect(_jisty.rxvo.model.namespaces.PetStoreV2).toBeDefined();
        expect(_jisty.rxvo.model.namespaces.PetStoreV3).toBeDefined();
    });
});

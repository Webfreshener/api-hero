import nock from "nock";
import {NoTraitsSchema} from "../fixtures/no-traits.schema";
import {_nsSchema} from "../fixtures/_schemas";
import Namespace from "./namespace";
import {traitsTests} from "../shared-tests/traits-tests.shared";

describe("Model Traits Tests", () => {
    describe("Test for Model with no Traits", () => {
        const ns = Namespace(NoTraitsSchema.namespaces.NoTraits);
        const _col = ns["nada"];

        it("should be false if no traits", (done) => {
            expect(_col.modelClass).toBe(false);
            done();
        });
    });

    describe("Open API Schema Traits Tests", () => {
        // traitsTests(_nsSchema.namespaces.PetStoreV2);
        traitsTests(_nsSchema.namespaces.PetStoreV3)
    });

});

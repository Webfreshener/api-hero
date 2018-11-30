import {_nsSchema} from "../fixtures/_schemas";
import {namespaceTests} from "../shared-tests/namespace-tests.shared";

describe("Namespace Class Tests", function () {
    // describe.skip("Swagger Schema Tests", () => {
    //     namespaceTests(_nsSchema.namespaces.PetStoreV2);
    // });

    describe("OpenAPI Schema Tests", () => {
        namespaceTests(_nsSchema.namespaces.PetStoreV3);
    });
});

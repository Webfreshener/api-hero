import PetStore from "../fixtures/petstore.v2";
import {_traits} from "./_references";
import {assignTraits} from "./traits.js";

describe("Traits Tests", () => {
    const CollectionTarget = {
        $scope: {
            schema: PetStore,
            schemaType: {
                type: "swagger",
                version: "2.0",
            },
        },
        $schema: {
            name: "pets",
            operations: PetStore.paths["/pets"],
            modelPaths: ["/pets/{petId}"],
        },
    };

    _traits.set(CollectionTarget, []);

    const ModelTarget = {
        $collection: CollectionTarget,
        $scope: CollectionTarget.$scope,
        $schema: {
            operations: PetStore.paths["/pets/{petId}"]
        },
    };

    _traits.set(ModelTarget, []);

    it("should assign traits to Collections", () => {
        assignTraits(CollectionTarget);
        const _traits = [
            "fetch",
            "add",
            "at",
            "getModels",
            "setModels",
            "reset",
            "isNew",
            "save",
            "create",
            "newModel",
            "options"
        ];

        let res = false;

        _traits.forEach((trait) => {
            res = _traits.indexOf(trait) >= 0;
        });

        expect(res).toBe(true);
    });

    it("should assign traits to Model", () => {
        assignTraits(ModelTarget);
        const _traits = [
            "fetch",
            "isNew",
            "save",
            "create",
            "newModel",
            "options"
        ];

        let res = false;

        _traits.forEach((trait) => {
            res = _traits.indexOf(trait) >= 0;
        });

        expect(res).toBe(true);
    });
});
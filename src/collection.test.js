import Namespace from "./namespace";
import {_nsSchema} from "../fixtures/_schemas";
import "cross-fetch/polyfill";
import {RxVO} from "rxvo";

describe.skip("Collection Class Tests", () => {
    const ns = Namespace(_nsSchema.namespaces.PetStore);
    const _col = ns["pets"];

    it("should do nothing", () => {

    });

    // it("should return Models attached to RxVO Docs", () => {
    //     expect(_col.models[0].$model instanceof Model).toBe(true);
    //     expect(_col.models[0].$model.save).toBeDefined();
    // });
    //
    // it("should reset it's contents", () => {
    //     _col.reset();
    //     expect(_col.length).toBe(0);
    // });
    //
    // it("should reject INVALID models", () => {
    //     _col.models = [
    //         {
    //             name: "Foo",
    //             value: "0",
    //         },
    //         {
    //             name: "Bar",
    //             value: "1",
    //         },
    //         {
    //             name: 123,
    //         },
    //     ];
    //     expect(_col.length).toBe(0);
    // });
});

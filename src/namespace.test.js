import defaults from "./defaults";
import Namespace from "./namespace";

const _collectionSchema = {
    name: "TestCol1",
    plural: "TestCol1",
    properties: {
        id: {
            type: "Number",
            required: true,
        },
        name: {
            type: "String",
            required: true,
        },
        description: {
            type: "String",
            required: true,
        },
    },
};
describe("Namespace Tests", function () {
    it("should create Namespace object", () => {
        let _o = {};
        Object.assign(_o, defaults, {
            collections: {
                TestCol1: _collectionSchema
            },
        });
        let ns = Namespace(_o);
        expect(ns.TestCol1).toBeDefined();
        expect(ns.$utils).toBeDefined();
        expect(ns.$utils.querify({value: "foo"})).toBe("value=foo");
        expect(ns.$utils.parseDate("2018-02-18T16:23.33+0600").toUTCString())
            .toBe("Sun, 18 Feb 2018 16:06:00 GMT");
        expect(ns.$utils.apiUrl).toBe("http://0.0.0.0/api/1");
        console.log(ns.$utils.apiOptions);
    });
});

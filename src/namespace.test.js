import Namespace from "./namespace";
import {_nsSchema} from "../fixtures/_schemas";

describe("Namespace Tests", function () {
    const ns = Namespace(_nsSchema);

    it("should valdiate nsSchema", () => {
        expect(ns.errors).toBe(null);
    });

    describe("Namespace.$utils object", () => {
        it("should be defined", () => {
            expect(ns.$utils).toBeDefined();
        })

        it("should querify JSON objects", () => {
            expect(ns.$utils.querify({value: "foo"})).toBe("value=foo");
        });

        it("should parse dates", () => {
            expect(ns.$utils.parseDate("2018-02-18T16:23.33+0600").toUTCString())
                .toBe("Sun, 18 Feb 2018 16:06:00 GMT");
        });

        // todo: refactor upstream
        it.skip("should generate API Urls", () => {
            expect(ns.$utils.apiUrl).toBe("http://0.0.0.0/api/1");
        });
    });

    // todo: retore collection building
    it.skip("should make Collections available", () => {
        expect(ns.TestCol1).toBeDefined();
    });

    it.skip("should make Api Options available", () => {
        expect(ns.options.HOST).toBe("0.0.0.0");
        expect(ns.options.PORT).toBe(80);
        expect(ns.options.PROTOCOL).toBe("HTTP");
        expect(ns.options.VERSION).toBe("1.0.0");
        expect(ns.options.API_VERSION).toBe("1");
        expect(ns.options.QUERY_PARAM).toBe("filter");
    });
});

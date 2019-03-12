import {ApiHero} from "./index";
import {_nsSchema} from "../fixtures/_schemas";
import deepEqual from "deep-equal";
import {RxVO} from "rxvo";

describe("ApiHero init and config", () => {
    it("should have init defined", () => {
        expect(ApiHero.init).toBeDefined();
        expect(typeof ApiHero.init).toBe("function");
    });

    describe("NameSpace Scopes", () => {
        const _hero = ApiHero.init(_nsSchema);
        it("should have returned a framework", () => {
            expect(_hero.hasOwnProperty("namespaces")).toBe(true);
            expect(_hero.hasOwnProperty("errors")).toBe(true);
            expect(_hero.errors).toEqual(null);
            expect(_hero.hasOwnProperty("addNamespace")).toBe(true);
            expect(typeof _hero.addNamespace === "function").toBe(true);
            expect(`${Object.keys(_hero.namespaces)}`)
                .toEqual("EndPointSchema,PetStoreV3");
        });

        it("should initialize a Namespace", () => {
            expect(_hero.errors).toEqual(null);
            expect(`${Object.keys(_hero.namespaces)}`)
                .toEqual("EndPointSchema,PetStoreV3");
        });

        describe("addNamespace Tests", () => {
            it("should make namespaces readonly", () => {
                const _schema = Object.assign({}, _hero["PetStoreV3"].schema);
                expect(_hero.addNamespace).toBeTruthy();
                _hero.addNamespace("PetStoreV3", {});
                expect(deepEqual( _hero["PetStoreV3"].schema, _schema)).toBe(true);
            });

            it("should add new namespaces", () => {
                const _schema = Object.assign({}, _hero["EndPointSchema"].schema);
                _hero.addNamespace("NewSchema", _schema);
                expect(_hero["NewSchema"]).toBeTruthy();
                expect(deepEqual(_hero["NewSchema"].schema, _schema)).toBe(true);
            });
        });

    });
});

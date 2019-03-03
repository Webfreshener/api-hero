import {ListableTrait} from "../src/traits/listable.trait";
import {CreatableTrait} from "../src/traits/creatable.trait";
import {UpdateableTrait} from "../src/traits/updatable.trait";
import {DeletableTrait} from "../src/traits/deletable.trait";
import {Utils} from "../src/utils";
import {FetchableTrait} from "../src/traits/fetchable.trait";
import {PatchableTrait} from "../src/traits/patchable.trait";
import {AccessibleTrait} from "../src/traits/accessible.trait";

const _reqs = ["$scope", "$schema"];
/**
 *
 * @param schema
 * @param target
 */
const assignTraits = (schema) => {
    // const type = target.$scope.schemaType.type;
    // _reqs.forEach((req) => {
    //     if (!target.hasOwnProperty(req)) {
    //         throw `required property ${req} missing from target instance`;
    //     }
    // });
    //
    // const schema = JSON.parse(JSON.stringify(target.$schema));

    // TODO: refactor this block
    // if (target.hasOwnProperty("$parent") &&
    //     !schema.operations.hasOwnProperty("post")) {
    //     if (target.$parent.$schema.operations.hasOwnProperty("post")) {
    //         schema.operations.post = target.$parent.$schema.operations.post;
    //     }
    // }

    Object.keys(schema.operations).forEach((key) => {
        let ref;
        let refDef;
        let _refDefType;
        let _content;
        const traits = [];

        switch (key) {
            case "post":
                new CreatableTrait(target);
                break;
            case "get":
                if (schema.operations[key].hasOwnProperty("responses")
                    && schema.operations[key].responses.hasOwnProperty("200")) {
                    _content = schema.operations[key].responses["200"].content["application/json"].schema;

                    if (_content.hasOwnProperty("$ref")) {
                        ref = _content.$ref;
                        refDef = Utils.getDefinition(ref, target.$scope.schema);
                    } else {
                        refDef = _content;
                    }

                    if ((_refDefType = refDef.type) === void(0)) {
                        const _type = Object.keys(refDef)[0];
                        if (["allOf", "anyOf", "oneOf"].indexOf(_type) >= 0) {
                            _refDefType = "object";
                        }
                    }
                    switch (_refDefType) {
                        case "array":
                            traits.push(ListableTrait);
                            break;
                        case "object":
                            traits.push(FetchableTrait);
                            break;
                        default:
                            throw `Invalid Response Type: <${refDef.type}>`;
                            break;
                    }
                }
                break;
            case "put":
                traits.push(UpdateableTrait);
                break;
            case "delete":
                traits.push(DeletableTrait);
                break;
            case "patch":
                traits.push(PatchableTrait);
                break;
            case "options":
                traits.push(AccessibleTrait);
                break;
        }
    });
};

export {assignTraits};
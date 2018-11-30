import {ListableTrait} from "./traits/listable.trait";
import {CreateableTrait} from "./traits/creatable.trait";
import {UpdateableTrait} from "./traits/updateable.trait";
import {DeletableTrait} from "./traits/deletable.trait";
import {Utils} from "./utils";
import {FetchableTrait} from "./traits/fetchable.trait";
import {PatchableTrait} from "./traits/patchable.trait";
import {AccessableTrait} from "./traits/accessable.trait";

const _reqs = ["$scope", "$schema"];
/**
 *
 * @param schema
 * @param target
 */
const assignTraits = (target) => {
    const type = target.$scope.schemaType.type;
    _reqs.forEach((req) => {
        if (!target.hasOwnProperty(req)) {
            throw `required property ${req} missing from target instance`;
        }
    });

    const schema = JSON.parse(JSON.stringify(target.$schema));

    if (target.hasOwnProperty("$collection") &&
        !schema.operations.hasOwnProperty("post")) {
        if (target.$collection.$schema.operations.hasOwnProperty("post")) {
            schema.operations.post = target.$collection.$schema.operations.post;
        }
    }

    Object.keys(schema.operations).forEach((key) => {
        let ref;
        let refDef;
        let _refDefType;
        let _content

        switch (key) {
            case "post":
                new CreateableTrait(target);
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
                            new ListableTrait(target);
                            break;
                        case "object":
                            new FetchableTrait(target);
                            break;
                        default:
                            console.log(`refDef: ${JSON.stringify(refDef)}`);
                            throw `Invalid Response Type: <${refDef.type}>`;
                            break;
                    }
                }
                break;
            case "put":
                new UpdateableTrait(target);
                break;
            case "delete":
                new DeletableTrait(target);
                break;
            case "patch":
                new PatchableTrait(target);
                break;
            case "options":
                new AccessableTrait(target);
                break;
        }
    });
};

module.exports["assignTraits"] = assignTraits;
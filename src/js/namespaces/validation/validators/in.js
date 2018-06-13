import ValidationEntry from "../base/validation-entry";
import resource from "../../resource";
import RuleTypes from "../base/constants/RuleTypes";
import config from "../../../config";
import validatorBase from './validator-base'
import basicValidator from '../basic-validators'

/**
 * @type {ValidationEntry}
 */
let entry;

let validator = {
    set(_entry){
        entry = _entry;
    },
    validate: function () {
        validatorBase.applyPreRules(entry);

        let invalidRules = entry.pattern.invalidRules,
            l = entry.pattern.rules.length,
            isLite = entry.pattern.isLite,
            valueToValidate = entry.input.valueToValidate,
            rule, i, p1, p2, items = false,
            debug = config.debug;

        if (!valueToValidate) {
            if (entry.pattern.required) {
                invalidRules.push(entry.pattern.required);
                if (!isLite)
                    for (i = 0; i < l; i++)
                        invalidRules.push(entry.pattern.rules[i]);
                return false;
            }
            return true;
        }


        i = 0;

        while (!(invalidRules.length && isLite) && i < l) {
            rule = entry.pattern.rules[i];
            switch (rule.type) {
                case RuleTypes.items:
                    debug && validatorBase.validateParamsCount(1, entry, rule);

                    items = true;
                    p1 = [];
                    for (p2 = rule.params.length - 1; p2 >= 0; p2--)
                        p1.push(rule.params[p2]);

                    if (!basicValidator.isStringIn(valueToValidate, p1, true))
                        invalidRules.push(rule);
                    break;
                default:
                    if (!validatorBase.customRule(entry, i))
                        invalidRules.push(rule);
            }
            i++;
        }
        if (!items)
            throw resource.get('ex.pmr', {p: entry.pattern.name, r: 'items'});

        return invalidRules.length === 0;
    }
};
export default validator;
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
            rule, i, p1, p2,
            reg = false,
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
                case RuleTypes.pattern:
                    debug && validatorBase.validateParamsCount(1, entry, rule);

                    reg = true;
                    if (!basicValidator.isRegMatch(valueToValidate, rule.params[0]))
                        invalidRules.push(rule);
                    break;
                case RuleTypes.min:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (valueToValidate.length <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (valueToValidate.length < p1)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.max:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (valueToValidate.length >= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (valueToValidate.length > p1)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.range:
                    debug && validatorBase.validateParamsCount(2, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);
                    p2 = validatorBase.getParamValue(rule.params[1], 'i', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule, 0)) {
                        //isOut
                        if (valueToValidate.length <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (valueToValidate.length < p1)
                            invalidRules.push(rule);
                    }

                    if (validatorBase.isOut(rule, 1)) {
                        //isOut
                        if (valueToValidate.length >= p2)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (valueToValidate.length > p2)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.len:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                    if (valueToValidate.length !== p1)
                        invalidRules.push(rule);

                    break;
                case RuleTypes.confirmed:
                    if (!entry.confirmInput || (entry.confirmInput.valueToValidate !== valueToValidate))
                        invalidRules.push(rule);
                    break;
                default:
                    if (!validatorBase.customRule(entry, i))
                        invalidRules.push(rule);
            }
            i++;
        }
        if (!reg)
            throw resource.get('ex.pmr', {p: entry.pattern.name, r: 'pattern'});
        return invalidRules.length === 0;
    }
};
export default validator;
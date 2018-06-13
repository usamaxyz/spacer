import ValidationEntry from "../base/validation-entry";
import RuleTypes from "../base/constants/RuleTypes";
import config from "../../../config";
import validatorBase from './validator-base'
import basicValidator from '../basic-validators'
import Rule from '../base/rule'

/**
 * @type {ValidationEntry}
 */
let entry;

let validator = {
    set(_entry) {
        entry = _entry;
    },
    validate: function () {
        validatorBase.applyPreRules(entry);
        let invalidRules = entry.pattern.invalidRules,
            l = entry.pattern.rules.length,
            isLite = entry.pattern.isLite,
            valueToValidate = entry.input.valueToValidate,
            rule, i, p1, p2,
            debug = config.debug;

        if (!valueToValidate) {
            if (entry.pattern.required) {
                invalidRules.push(entry.pattern.required);
                if (!isLite) {
                    invalidRules.push(new Rule('email', undefined));
                    for (i = 0; i < l; i++)
                        invalidRules.push(entry.pattern.rules[i]);
                }
                return false;
            }
            return true;
        }

        if (!basicValidator.isEmail(valueToValidate)) {
            invalidRules.push(new Rule('email', undefined));
            if (!isLite)
                for (i = 0; i < l; i++)
                    invalidRules.push(entry.pattern.rules[i]);
            return false;
        }


        i = 0;
        while (!(invalidRules.length && isLite) && i < l) {
            rule = entry.pattern.rules[i];
            switch (rule.type) {
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
                case RuleTypes.in_domain:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = [];
                    for (p2 = rule.params.length - 1; p2 >= 0; p2--)
                        p1.push(rule.params[p2]);

                    if (!basicValidator.isStringContainsOneOfArray(valueToValidate, p1))
                        invalidRules.push(rule);
                    break;
                case RuleTypes.not_in_domain:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = [];
                    for (p2 = rule.params.length - 1; p2 >= 0; p2--)
                        p1.push(rule.params[p2]);

                    if (basicValidator.isStringContainsOneOfArray(valueToValidate, p1))
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
        return invalidRules.length === 0;
    }
};
export default validator;
import ValidationEntry from "../base/validation-entry";
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
            rule, i, p1, p2, j, sum,
            k = valueToValidate.length,
            debug = config.debug;

        if (k === 0) {
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
                case RuleTypes.min:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                    j = 0;
                    sum = 0;

                    for (; j < k; j++)
                        sum += valueToValidate[j].size;

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (sum <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (sum < p1)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.max:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                    j = 0;
                    sum = 0;

                    for (; j < k; j++)
                        sum += valueToValidate[j].size;

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (sum >= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (sum > p1)
                            invalidRules.push(rule);
                    }
                    break;
                case RuleTypes.range:
                    debug && validatorBase.validateParamsCount(2, entry, rule);
                   p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name)* 1024 * 1024;
                    p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name)* 1024 * 1024;

                    j = 0;
                    sum = 0;

                    for (; j < k; j++)
                        sum += valueToValidate[j].size;

                    if (validatorBase.isOut(rule, 0)) {
                        //isOut
                        if (sum <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (sum < p1)
                            invalidRules.push(rule);
                    }

                    if (validatorBase.isOut(rule, 1)) {
                        //isOut
                        if (sum >= p2)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (sum > p2)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.s_min:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name)* 1024 * 1024;

                    j = 0;
                    for (; j < k; j++) {

                        if (validatorBase.isOut(rule)) {
                            //isOut
                            if (valueToValidate[j].size <= p1)
                                invalidRules.push(rule);
                        }
                        else {
                            //in
                            if (valueToValidate[j].size < p1)
                                invalidRules.push(rule);
                        }
                    }
                    break;
                case RuleTypes.s_max:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name)* 1024 * 1024;

                    j = 0;
                    for (; j < k; j++) {

                        if (validatorBase.isOut(rule)) {
                            //isOut
                            if (valueToValidate[j].size >= p1)
                                invalidRules.push(rule);
                        }
                        else {
                            //in
                            if (valueToValidate[j].size > p1)
                                invalidRules.push(rule);
                        }
                    }
                    break;
                case RuleTypes.s_range:
                    debug && validatorBase.validateParamsCount(2, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name)* 1024 * 1024;
                    p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name)* 1024 * 1024;

                    j = 0;

                    for (; j < k; j++) {

                        if (validatorBase.isOut(rule, 0)) {
                            //isOut
                            if (valueToValidate[j].size <= p1)
                                invalidRules.push(rule);
                        }
                        else {
                            //in
                            if (valueToValidate[j].size < p1)
                                invalidRules.push(rule);
                        }

                        if (validatorBase.isOut(rule, 1)) {
                            //isOut
                            if (valueToValidate[j].size >= p2)
                                invalidRules.push(rule);
                        }
                        else {
                            //in
                            if (valueToValidate[j].size > p2)
                                invalidRules.push(rule);
                        }
                    }
                    break;
                case RuleTypes.ext:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = [];
                    j = 0;
                    p2 = rule.params.length;

                    for (; j < p2; j++)
                        p1.push(rule.params[j]);

                    j = 0;
                    p2 = valueToValidate.length;
                    for (; j < p2; j++)
                        if (!basicValidator.isStringContainsOneOfArray(valueToValidate[j].name, p1))
                            invalidRules.push(rule);

                    break;
                case RuleTypes.len:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                    if (k !== p1)
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
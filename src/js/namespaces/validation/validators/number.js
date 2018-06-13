import ValidationEntry from "../base/validation-entry";
import RuleTypes from "../base/constants/RuleTypes";
import config from "../../../config";
import validatorBase from './validator-base'
import basic from '../../../basic'
import basicValidator from '../basic-validators'
import Rule from '../base/rule'

/**
 * @type {ValidationEntry}
 */
let entry;
let isInteger;

let validator = {
    set(_entry, _isInteger){
        entry = _entry;
        isInteger = _isInteger;
    },
    validate(){
        validatorBase.applyPreRules(entry);

        let invalidRules = entry.pattern.invalidRules,
            l = entry.pattern.rules.length,
            isLite = entry.pattern.isLite,
            valueToValidate = entry.input.valueToValidate,
            rule, i, p1, p2, parsedValue,
            debug = config.debug;

        //numbers are always trimmed
        if (!config.trimValues) {
            entry.input.valueToValidate = basic.trim(valueToValidate, true);
            if (entry.confirmInput)
                entry.confirmInput.valueToValidate = basic.trim(entry.confirmInput.valueToValidate, true);
        }

        if (!valueToValidate) {
            if (entry.pattern.required) {
                invalidRules.push(entry.pattern.required);
                if (!isLite) {
                    if (isInteger)
                        invalidRules.push(new Rule('integer', undefined));
                    else
                        invalidRules.push(new Rule('float', undefined));

                    for (i = 0; i < l; i++)
                        invalidRules.push(entry.pattern.rules[i]);
                }
                return false;
            }
            return true;
        }

        if (isInteger) {
            if (!basicValidator.isInteger(valueToValidate)) {
                invalidRules.push(new Rule('integer', undefined));
                if (!isLite)
                    for (i = 0; i < l; i++)
                        invalidRules.push(entry.pattern.rules[i]);
                return false;
            }
            else
                parsedValue = parseInt(valueToValidate);
        }
        else if (!basicValidator.isFloat(valueToValidate)) {
            invalidRules.push(new Rule('float', undefined));
            if (!isLite)
                for (i = 0; i < l; i++)
                    invalidRules.push(entry.pattern.rules[i]);
            return false;
        }
        else
            parsedValue = parseFloat(valueToValidate);

        i = 0;
        while (!(invalidRules.length && isLite) && i < l) {
            rule = entry.pattern.rules[i];
            switch (rule.type) {
                case RuleTypes.positive:
                    if (parsedValue < 0)
                        invalidRules.push(rule);
                    break;
                case RuleTypes.negative:
                    if (parsedValue >= 0)
                        invalidRules.push(rule);
                    break;
                case RuleTypes.min:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (parsedValue <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (parsedValue < p1)
                            invalidRules.push(rule);
                    }
                    break;
                case RuleTypes.max:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (parsedValue >= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (parsedValue > p1)
                            invalidRules.push(rule);
                    }

                    break;
                case RuleTypes.range:
                    debug && validatorBase.validateParamsCount(2, entry, rule);
                    p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);
                    p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name);

                    if (validatorBase.isOut(rule, 0)) {
                        //isOut
                        if (parsedValue <= p1)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (parsedValue < p1)
                            invalidRules.push(rule);
                    }

                    if (validatorBase.isOut(rule, 1)) {
                        //isOut
                        if (parsedValue >= p2)
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (parsedValue > p2)
                            invalidRules.push(rule);
                    }
                    break;
                case RuleTypes.not:
                    debug && validatorBase.validateParamsCount(1, entry, rule);
                    p1 = [];
                    for (p2 = rule.params.length - 1; p2 >= 0; p2--)
                        p1.push(rule.params[p2]);
                    if (basicValidator.isStringIn(valueToValidate, p1, true))
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
    },
};
export default validator;
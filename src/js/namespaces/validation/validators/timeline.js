import ValidationEntry from "../base/validation-entry";
import RuleTypes from "../base/constants/RuleTypes";
import config from "../../../config";
import validatorBase from './validator-base'
import basicValidator from '../basic-validators'
import Rule from "../base/rule";
/**
 * @type {ValidationEntry}
 */
let entry;

let validator = {
    set(_entry){
        entry = _entry;

        if (!entry.pattern.timelineFormat)
            entry.pattern.timelineFormat = new Rule('format', [config.timelineFormat]);
    },
    validate: function () {
        validatorBase.applyPreRules(entry);

        let invalidRules = entry.pattern.invalidRules,
            l = entry.pattern.rules.length,
            isLite = entry.pattern.isLite,
            valueToValidate = entry.input.valueToValidate,
            format = entry.pattern.timelineFormat.params[0],
            rule, i, p1, p2,
            debug = config.debug;

        if (!valueToValidate) {
            if (entry.pattern.required) {
                invalidRules.push(entry.pattern.required);
                if (!isLite) {
                    invalidRules.push(entry.pattern.timelineFormat);
                    for (i = 0; i < l; i++)
                        invalidRules.push(entry.pattern.rules[i]);
                }
                return false;
            }
            return true;
        }

        if (!basicValidator.isTimeline(valueToValidate, format)) {
            invalidRules.push(entry.pattern.timelineFormat);
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
                    if (debug) {
                        validatorBase.validateParamsCount(1, entry, rule);
                        validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                    }
                    p1 = rule.params[0];

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (!basicValidator.isTimelineAfter(valueToValidate, p1, format))
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (!basicValidator.isTimelineAfterOrEqual(valueToValidate, p1, format))
                            invalidRules.push(rule);
                    }
                    break;
                case RuleTypes.max:
                    if (debug) {
                        validatorBase.validateParamsCount(1, entry, rule);
                        validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                    }
                    p1 = rule.params[0];

                    if (validatorBase.isOut(rule)) {
                        //isOut
                        if (!basicValidator.isTimelineBefore(valueToValidate, p1, format))
                            invalidRules.push(rule);
                    }
                    else {
                        //in
                        if (!basicValidator.isTimelineBeforeOrEqual(valueToValidate, p1, format))
                            invalidRules.push(rule);
                    }
                    break;
                case RuleTypes.range: {
                    if (debug) {
                        validatorBase.validateParamsCount(2, entry, rule);
                        validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                        validatorBase.getParamValue(rule.params[1], 't', entry.pattern.name, rule.name, format);
                    }
                    p1 = rule.params[0];
                    p2 = rule.params[1];

                    let boundaries = '';

                    boundaries += (validatorBase.isOut(rule, 0) ? '(' : '[');
                    boundaries += (validatorBase.isOut(rule, 1) ? ')' : ']');

                    if (!basicValidator.isTimelineBetween(
                        valueToValidate,
                        p1,
                        p2,
                        format,
                        boundaries))
                        invalidRules.push(rule);
                    break;
                }
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
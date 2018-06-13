import resource from "../../resource";
import config from "../../../config";
import ValidationEntry from "../base/validation-entry";
import basicValidators from "../basic-validators";
import basic from "../../../basic";
import Rule from "../base/rule";
import RuleTypes from "../base/constants/RuleTypes";

/**
 *
 * @param {ValidationEntry} v
 */
function applyPreRules(v) {
    let l = v.pattern.pre.length;
    /**
     *
     * @type {Array<string>}
     */
    let pre = v.pattern.pre;
    if (l) {
        for (let i = 0; i < l; i++) {
            if (config.debug
                && (!config.validationPre
                    || !config.validationPre[pre[i]]))
                throw resource.get('ex.pfnf', {p: pre[i]});

            v.input.valueToValidate = config.validationPre[pre[i]](v.input.valueToValidate);
            if (v.confirmInput)
                v.confirmInput.valueToValidate = config.validationPre[pre[i]](v.confirmInput.valueToValidate);
        }
        v.input.valueToValidate = basic.trim(v.input.valueToValidate.toString());
        if (v.confirmInput)
            v.confirmInput.valueToValidate = basic.trim(v.confirmInput.valueToValidate.toString());
    }
}

//Validation Custom Rules
function customRule(v, index) {
    let rule = v.pattern.rules[index];
    if (config.debug
        && (!config.validationCustomRules
            || !config.validationCustomRules[rule.name]
            || !basicValidators.isFunction(config.validationCustomRules[rule.name].validate)))
        throw resource.get('ex.rnf', {p: v.pattern.name, r: rule.name});
    return config.validationCustomRules[rule.name].validate(v, index);
}

function validateParamsCount(count, v, rule) {
    if (rule.params.length < count)
        throw resource.get('ex.ipc', {p: v.pattern.name, r: rule.name});
}

function getParamValue(param, type, patternName, ruleName, format) {
    let value;
    switch (type) {
        case 'i':
            value = parseInt(param);
            if (isNaN(value) && config.debug) {
                throw resource.get('ex.ipt', {p: patternName, r: ruleName, a: param});
            }
            return value;
        case 'f':
            value = parseFloat(param);
            if (isNaN(value) && config.debug) {
                throw resource.get('ex.ipt', {p: patternName, r: ruleName, a: param});
            }
            return value;
        case 't':
            //only check if value is a valid timeline
            value = moment(param, format, true);
            if (!value.isValid()) {
                throw resource.get('ex.ipt', {p: patternName, r: ruleName, a: param});
            }
            return value;
    }
}

/**
 * The default isOut is false for all rules.
 * @param {Rule} rule
 * @param index is used for range rule only: 0 for the 1st boundary, 1 for the 2nd boundary
 * @returns {boolean}
 */
function isOut(rule, index = 0) {
    let t;
    switch (rule.type) {
        case RuleTypes.min:
        case RuleTypes.s_min:
        case RuleTypes.max:
        case RuleTypes.s_max:
            //the first param is the param value. The second param is 'i' for in or 'o' for out
            t = rule.params[1];
            if (t)
                return t.toLowerCase() === 'o';
            return false;
        case RuleTypes.range:
        case RuleTypes.s_range:
            //the first 2 param are the boundaries. The 3rd param is ii io oi oo
            t = rule.params[2];
            if (t) {
                return t.toLowerCase()[index] === 'o';
            }
            return false;
    }
    return false;
}

export default {
    applyPreRules,
    customRule,
    validateParamsCount,
    getParamValue,
    isOut
}
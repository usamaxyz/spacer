import dialog from "../../dialog/dialog";
import config from "../../../config";
import resource from "../../resource";
import basicValidator from "../basic-validators";
import RuleTypes from "../base/constants/RuleTypes";
import ValidationEntry from "../base/validation-entry";
import validationBase from "../validators/validator-base";

/**
 *
 * @param {ValidationEntry} vo
 */
function populateErrorMessages(vo) {
    let rule, msg, replaceParam;
    for (let i = 0, l = vo.pattern.invalidRules.length; i < l; i++) {
        rule = vo.pattern.invalidRules[i];
        replaceParam = true;

        switch (rule.type) {
            case RuleTypes.min:
            case RuleTypes.max:{
                let tempName = rule.name + ((validationBase.isOut(rule) ? '_o' : '_i'));
                msg = resource.get(vo.pattern.name + '.' + tempName, {fn: vo.input.friendlyName});
                break;
            }
            case RuleTypes.in_domain:
            case RuleTypes.not_in_domain:
            case RuleTypes.ext:{
                let p1 = '', j = 0, m = rule.params.length;
                for (; j < (m - 1); j++)
                    p1 += rule.params[j] + ', ';
                p1 += rule.params[j];

                msg = resource.get(vo.pattern.name + '.' + rule.name, {
                    fn: vo.input.friendlyName,
                    p1: p1
                });

                replaceParam = false;
                break;
            }
            default:
                msg = resource.get(vo.pattern.name + '.' + rule.name, {fn: vo.input.friendlyName});
        }
        if (msg) {
            if (replaceParam) {
                msg = msg.replace(/:p[1-9]/g, function (matched) {
                    return rule.params[parseInt(matched[2]) - 1];
                });
            }
        }
        else
            msg = customMsg(vo, i);
        rule.message = msg;
    }
}

/**
 *
 * @param {ValidationEntry} vo
 */
function onErrorProxy(vo) {

    let s = config.validationCurrentDriver.split('.');
    if (s[0] === 'dialog') {
        //dialog.driverName
        if (s.length > 1)
            s = s[1];
        else
            s = s[0];

        let title = resource.get('validation.errorTitle');
        let msg = vo.pattern.invalidRules[0].message;

        if (s === 'dialog')
            dialog.message(title, msg, 'danger', 'danger');
        else {
            let obj = config.dialogDrivers[s];
            if (obj && obj.message)
                obj.message(title, msg, 'danger', 'danger');
            else
                throw resource.get('ex.ddnf', {p: s});
        }
    }
    else {
        s = s[0];
        let obj = config.validationDrivers[s];
        if (obj && obj.onError)
            obj.onError(vo);
        else
            throw resource.get('ex.vdnf', {p: s});

    }
}

function clearErrorProxy(input) {
    let s = config.validationCurrentDriver.split('.')[0];
    if (s !== 'dialog') {
        let obj = config.validationDrivers[s];
        if (obj && obj.clearError)
            obj.clearError(input);
        else
            throw resource.get('ex.vdnf', {p: s});
    }
}

/**
 *
 * @param {ValidationEntry} v
 * @param index
 * @returns {*}
 */
function customMsg(v, index) {
    let rule = v.pattern.invalidRules[index];
    if (config.debug
        && (!config.validationCustomRules
            || !config.validationCustomRules[rule.name]
            || !basicValidator.isFunction(config.validationCustomRules[rule.name].getErrorMessage)))
        throw resource.get('ex.mnf', {p: v.pattern.name, r: rule.name});
    return config.validationCustomRules[rule.name].getErrorMessage(v, index);
}

export default {
    populateErrorMessages,
    clearErrorProxy,
    onErrorProxy
}
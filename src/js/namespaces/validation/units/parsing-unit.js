import ValidationEntry from "../base/validation-entry";
import Rule from "../base/rule";
import resource from "../../resource";
import PatternTypes from "../base/constants/PatternTypes";
import RuleTypes from "../base/constants/RuleTypes";
import Input from "../base/input";
import basic from "../../../basic";
import Tags from "../base/constants/Tags";

/**
 *  Return Pattern object from pattern string
 * @param {ValidationEntry} entry
 */
function parsePattern(entry) {
    let patternStr = entry.pattern.string,
        //divide pattern string into: name and rules (rules as string without [])
        patternNameAndRules = patternStr.match(/^\s*([A-Za-z]+)\s*(?:\[\s*(.*)]\s*)?$/);

    if (!patternNameAndRules)
        throw resource.get('ex.se', {p: patternStr});

    //trimmed
    entry.pattern.name = patternNameAndRules[1].toLowerCase();
    entry.pattern.type = PatternTypes[entry.pattern.name];

    //rules (rules as string without [])
    let rulesStr = patternNameAndRules[2];

    if (!rulesStr)
        return;

    //extract ~~ expressions
    let tildeExpressions = rulesStr.match(/~[^~.]+~/g);
    if (tildeExpressions)
        for (let i = 0, l = tildeExpressions.length; i < l; i++)
            rulesStr = rulesStr.replace(tildeExpressions[i], 'r');


    let allRules = rulesStr.split('|');

    for (let i = 0, l = allRules.length; i < l; i++) {

        //divide rule into: name and params
        let rule = allRules[i].match(/^\s*([a-zA-Z_]+)\s*(?::\s*(.+))?$/);
        if (!rule)
            throw resource.get('ex.rnf', {
                p: entry.pattern.name,
                r: allRules[i],
            });
        let ruleName = rule[1],
            ruleParamStr;

        if (ruleName === 'pattern' || ruleName === 'format') {
            //get param from tilda expressions
            if (tildeExpressions && tildeExpressions.length)
                ruleParamStr = tildeExpressions.shift().match(/~([^~.]+)~/)[1];
            else
                throw resource.get('ex.ipc', {p: entry.pattern.name, r: ruleName});
        }
        else
            ruleParamStr = rule[2];

        addRule(entry, new Rule(ruleName.toLowerCase(), createParams(ruleParamStr)));
    }
}

/**
 *
 * @param {ValidationEntry} v
 * @param {Rule} rule
 */
function addRule(v, rule) {

    switch (rule.type) {
        case RuleTypes.lite:
            v.pattern.isLite = true;
            break;
        case RuleTypes.pre:
            v.pattern.pre = rule.params;
            break;
        case RuleTypes.required:
            v.pattern.required = rule;
            break;
        case RuleTypes.format:
            v.pattern.timelineFormat = rule;
            break;
        case RuleTypes.confirmed:
            getConfirmInput(v, rule.params);
            v.pattern.rules.push(rule);
            break;
        default:
            v.pattern.rules.push(rule);
    }
}


function createParams(paramStr) {

    let paramList = [];

    if (!paramStr)
        return paramList;

    let paramListStr = paramStr.split(',');

    for (let i = 0, l = paramListStr.length; i < l; i++) {

        let param = paramListStr[i].trim();

        if (param === '')
            throw resource.get('ex.se', {p: paramStr});
        else
            paramList.push(param);
    }

    return paramList;
}


/**
 *
 * @param {ValidationEntry} vo
 * @param params
 */
function getConfirmInput(vo, params) {

    let confirmInputName;
    if (params.length)
        confirmInputName = params[0];
    else
        confirmInputName = vo.input.name + '_confirmation';

    let confirmInput = vo.input.jquery.closest('form').find('input[name="' + confirmInputName + '"]');

    if (confirmInput.length) {
        vo.confirmInput = new Input(confirmInput);

        //add reference to confirm input to input: used in onError to remove error
        vo.input.jquery.data(Tags.confirmInput, confirmInput);
    }
}


function cacheValidationObject(v) {
    v.input.jquery.data(Tags.cachedValidationEntry, v);
}

function getCacheValidationObject(input) {
    return input.data(Tags.cachedValidationEntry);
}

/**
 *
 * @param {ValidationEntry} v
 */
function getInputValue(v) {
    //input
    if (v.pattern.type === PatternTypes.file)
        v.input.originalValue = v.input.jquery[0].files;
    else if (v.pattern.type === PatternTypes.check) {
        if (v.input.jquery.is(':checked'))
            v.input.originalValue = basic.trim(v.input.jquery.val()) || 'true';
        else
            v.input.originalValue = '';
    }
    else {
        //value is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
        v.input.originalValue = basic.trim(v.input.jquery.val());
        //confirm input
        if (v.confirmInput)
        //value is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
            v.confirmInput.originalValue = basic.trim(v.confirmInput.jquery.val());
    }
    //v.input.valueToValidate is to store value after applying pre rule
    v.input.valueToValidate = v.input.originalValue;

    if (v.confirmInput)
    //v.input.valueToValidate is to store value after applying pre rule
        v.confirmInput.valueToValidate = v.confirmInput.originalValue;
}

/**
 *
 * @param {JQuery} input
 * @returns {ValidationEntry}
 */
function parse(input) {
    let vo = getCacheValidationObject(input);

    if (!vo) {
        //pattern is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
        let patternStr = input.attr(Tags.validationTag);

        if (patternStr)
            patternStr = patternStr.trim();

        if (!patternStr)
            return undefined;

        vo = new ValidationEntry(input, patternStr);

        parsePattern(vo);
    }
    getInputValue(vo);
    cacheValidationObject(vo);
    return vo;
}

export default {
    parse,
}
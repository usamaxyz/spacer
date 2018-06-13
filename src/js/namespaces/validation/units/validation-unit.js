import config from "../../../config";
import resource from "../../resource";
import parsingUnit from "./parsing-unit";
import PatternTypes from "../base/constants/PatternTypes";
import errorUnit from "./error-unit";
import ValidationEntry from "../base/validation-entry";

import numberValidator from "../validators/number";
import stringValidator from "../validators/string";
import timelineValidator from "../validators/timeline";
import emailValidator from "../validators/email";
import urlValidator from "../validators/url";
import inValidator from "../validators/in";
import checkValidator from "../validators/check";
import fileValidator from "../validators/file";
import regexValidator from "../validators/regex";
import basic from "../../../basic";
import {getFormInputs} from "../../form";
import Tags, {cachingTags} from "../base/constants/Tags";

/**
 *
 * @param {ValidationEntry} vo
 */
function attachEvents(vo) {
    //ea => event attached
    if (!vo.input.jquery.data(Tags.isEventAttached)) {
        //Attach events
        if (config.validationCurrentDriver.split('.')[0] !== 'dialog') {
            //need validation (n): is a signal for not firing change event after input event
            vo.input.jquery.data(Tags.needValidation, true);
            vo.input.jquery
                .on('input.spa', function () {
                    clearTimeout(vo.input.jquery.data(Tags.timer));
                    vo.input.jquery.data(Tags.timer, setTimeout(function () {
                        validateInput(vo.input.jquery);
                        vo.input.jquery.data(Tags.needValidation, false);
                    }, config.reValidationDelay));
                })
                .on('change.spa', function () {
                    clearTimeout(vo.input.jquery.data(Tags.timer));
                    if (vo.input.jquery.data(Tags.needValidation)) {
                        vo.input.jquery.data(Tags.timer, setTimeout(function () {
                            validateInput(vo.input.jquery);
                        }, config.reValidationDelay));
                    }
                    else
                        vo.input.jquery.data(Tags.needValidation, true);
                });
            if (vo.confirmInput) {
                vo.input.jquery.data(Tags.needValidation, true);
                vo.confirmInput.jquery
                    .on('input.spa', function () {
                        clearTimeout(vo.input.jquery.data(Tags.timer));
                        vo.input.jquery.data(Tags.timer, setTimeout(function () {
                            validateInput(vo.input.jquery);
                            vo.input.jquery.data(Tags.needValidation, false);
                        }, config.reValidationDelay));
                    })
                    .on('change.spa', function () {
                        clearTimeout(vo.input.jquery.data(Tags.timer));
                        if (vo.input.jquery.data(Tags.needValidation)) {
                            vo.input.jquery.data(Tags.timer, setTimeout(function () {
                                validateInput(vo.input.jquery);
                            }, config.reValidationDelay));
                        }
                        else
                            vo.input.jquery.data(Tags.needValidation, true);
                    });
            }
        }
        //events attached (ea): indicate that event previously attached
        vo.input.jquery.data(Tags.isEventAttached, true);
        //End of attach
    }
}

function getValidator(vo) {
    switch (vo.pattern.type) {
        case PatternTypes.string:
            stringValidator.set(vo);
            return stringValidator;
        case PatternTypes.integer:
            numberValidator.set(vo, true);
            return numberValidator;
        case PatternTypes.float:
            numberValidator.set(vo, false);
            return numberValidator;
        case PatternTypes.timeline:
            timelineValidator.set(vo);
            return timelineValidator;
        case PatternTypes.email:
            emailValidator.set(vo);
            return emailValidator;
        case PatternTypes.url:
            urlValidator.set(vo);
            return urlValidator;
        case PatternTypes.in:
            inValidator.set(vo);
            return inValidator;
        case PatternTypes.file:
            fileValidator.set(vo);
            return fileValidator;
        case PatternTypes.regex:
            regexValidator.set(vo);
            return regexValidator;
        case PatternTypes.check:
            checkValidator.set(vo);
            return checkValidator;
        default:
            throw resource.get('ex.usp', {p: vo.pattern.name});
    }
}

/**
 *
 * @param input
 * @param isSilent  is used with isValidInput() that return true or false only (no output)
 * @returns {boolean}
 */
function validateInput(input, isSilent) {

    let vo = parsingUnit.parse(input);

    if (!vo)
        return true;

    vo.pattern.invalidRules = [];
    errorUnit.clearErrorProxy(input);
    if (!getValidator(vo).validate()) {
        if (!isSilent) {
            errorUnit.populateErrorMessages(vo);
            errorUnit.onErrorProxy(vo);
            attachEvents(vo);
        }
        return false;
    }
    return true;
}

function validate(form) {
    form = basic.sis(form);
    if (!form.length)
        throw resource.get('ex.fnf');
    let inputs = getFormInputs(form),
        isValid = true,
        isDialogDriver = config.validationCurrentDriver.split('.')[0] === 'dialog',
        l = inputs.length,
        i = 0;
    for (; i < l; i++)
        if (!validateInput($(inputs[i]))) {
            isValid = false;
            if (isDialogDriver)
                return false;
        }
    return isValid;
}

function isValidInput(input) {
    return validateInput(basic.sis(input), true);
}

function resetValidation(form) {
    form = basic.sis(form);
    if (!form.length)
        throw resource.get('ex.fnf');
    let inputs = getFormInputs(form).off('.spa').removeData(cachingTags);
    for (let i = 0, l = inputs.length; i < l; i++)
        errorUnit.clearErrorProxy($(inputs[i]));
}

export default {
    validate,
    resetValidation,
    isValidInput,
}
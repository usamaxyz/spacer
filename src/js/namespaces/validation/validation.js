import config from '../../config'
import validationUnit from './units/validation-unit'
import basicValidators from './basic-validators'


let validation = {
    getErrorList: config.validationDrivers.listOfErrors.getErrorList,
    validate: validationUnit.validate,
    resetValidation: validationUnit.resetValidation,
    isValidInput: validationUnit.isValidInput,

    //value validators
    isInteger: basicValidators.isInteger,

    isFloat: basicValidators.isFloat,

    isEmail: basicValidators.isEmail,

    isUrl: basicValidators.isUrl,

    isPositiveNumber: basicValidators.isPositiveNumber,

    isNegativeNumber: basicValidators.isNegativeNumber,

    isStringOf: basicValidators.isStringOf,

    isStringContainsOneOfRegex: basicValidators.isStringContainsOneOfRegex,

    isStringContainsOneOfArray: basicValidators.isStringContainsOneOfArray,

    isStringIn: basicValidators.isStringIn,

    isTimeline: basicValidators.isTimeline,

    isTimelineBeforeOrEqual: basicValidators.isTimelineBeforeOrEqual,

    isTimelineAfterOrEqual: basicValidators.isTimelineAfterOrEqual,

    isTimelineBefore: basicValidators.isTimelineBefore,

    isTimelineAfter: basicValidators.isTimelineAfter,

    isTimelineBetween: basicValidators.isTimelineBetween,

    isRegMatch: basicValidators.isRegMatch,

    isFunction: basicValidators.isFunction,

    isArray: basicValidators.isArray,
};

export default validation;
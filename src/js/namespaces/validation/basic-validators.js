import resource from "../resource";

function generateStringRegex(patternsArray) {
    let reg = '',
        //dash: should be the last character in the reg exp
        dash = false,
        i = 0,
        l = patternsArray.length;
    for (; i < l; i++) {
        switch (patternsArray[i]) {
            case 'alpha':
                reg = reg + 'a-zA-Z';
                break;
            case 'num':
                reg = reg + '0-9';
                break;
            case 'underscore':
                reg = reg + '_';
                break;
            case 'dash':
                dash = true;
                break;
            case 'spaces':
                reg = reg + '\\s';
                break;
            case 'dot':
                reg = reg + '.';
                break;
            case 'comma':
                reg = reg + ',';
                break;
            default:
                throw resource.get('ex.usst', {p: patternsArray[i]});
        }
    }
    if (dash)
        reg = reg + '-';
    return reg;
}

let basicValidators = {
    isInteger: function (value) {
        return basicValidators.isRegMatch(value, /^[+-]?\d+$/) || basicValidators.isRegMatch(value, /^[+-]?[\u0660-\u0669]+$/);
    },

    isFloat: function (value) {
        return basicValidators.isRegMatch(value, /^[+-]?([0-9]*[.])?[0-9]+$/) || basicValidators.isRegMatch(value, /^[+-]?([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
    },

    isEmail: function (value) {
        return basicValidators.isRegMatch(value, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    },

    isUrl: function (value) {
        // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
        //     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        //     '(\\:\\d+)?'+ // port
        //     '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
        //     '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
        //     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return basicValidators.isRegMatch(value, /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%@_.~+&:]*)*(\?[;&a-z\d%@_.,~+:=-]*)?(#[-a-z\d_]*)?$/i);
    },

    isPositiveNumber: function (value) {
        return basicValidators.isRegMatch(value, /^[+]?([0-9]*[.])?[0-9]+$/) || basicValidators.isRegMatch(value, /^[+]?([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
    },

    isNegativeNumber: function (value) {
        return basicValidators.isRegMatch(value, /^[-]([0-9]*[.])?[0-9]+$/) || basicValidators.isRegMatch(value, /^[-]([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
    },

    isStringOf: function (value, patternsArray) {
        let reg = generateStringRegex(patternsArray);
        //all character should meet the regex
        reg = '^[' + reg + ']+$';
        return basicValidators.isRegMatch(value, reg);
    },

    isStringContainsOneOfRegex: function (value, patternsArray) {
        let reg = generateStringRegex(patternsArray);
        //search for one character at least that belong to the regex
        reg = '[' + reg + ']+';
        return basicValidators.isRegMatch(value, reg);
    },

    isStringContainsOneOfArray: function (value, array, caseSensitive) {
        if (!caseSensitive)
            value = value.toLowerCase();
        for (let i = 0, l = array.length; i < l; i++)
            if (value.indexOf(caseSensitive ? array[i] : array[i].toLowerCase()) >= 0)
                return true;
        return false;
    },

    isStringIn: function (value, array, caseSensitive) {
        //caseSensitive: default is false;
        if (!caseSensitive)
            value = value.toLowerCase();
        for (let i = 0, l = array.length; i < l; i++)
            if (value === (caseSensitive ? array[i] : array[i].toLowerCase()))
                return true;
        return false;
    },

    isTimeline: function (value, format) {
        return moment(value, format, true).isValid();
    },

    isTimelineBeforeOrEqual: function (value, boundary, format) {
        let p1 = moment(boundary, format, true),
            p2 = moment(value, format, true);
        return p1.isValid() && p2.isValid() && !p1.isBefore(p2);
    },

    isTimelineAfterOrEqual: function (value, boundary, format) {
        let p1 = moment(boundary, format, true),
            p2 = moment(value, format, true);
        return p1.isValid() && p2.isValid() && !p1.isAfter(p2);
    },
    isTimelineBefore: function (value, boundary, format) {
        let p1 = moment(boundary, format, true),
            p2 = moment(value, format, true);
        return p1.isValid() && p2.isValid() && p2.isBefore(p1);
    },

    isTimelineAfter: function (value, boundary, format) {
        let p1 = moment(boundary, format, true),
            p2 = moment(value, format, true);
        return p1.isValid() && p2.isValid() && p2.isAfter(p1);
    },

    isTimelineBetween: function (value, min, max, format, boundaries) {
        let p1 = moment(value, format, true),
            p2 = moment(min, format, true),
            p3 = moment(max, format, true);

        return p1.isValid() && p2.isValid() && p3.isValid() && p1.isBetween(p2, p3, null, boundaries || '[]');
    },

    isRegMatch: function (value, reg) {
        return (new RegExp(reg)).test(value);
    },

    isFunction: function (value) {
        return typeof value === 'function';
    },

    isArray: function (value) {
        return value && value.constructor === Array;
    }
};

export default basicValidators
import ValidationEntry from '../base/validation-entry'
import Rule from '../base/rule'
import PatternTypes from '../base/constants/PatternTypes'
import basicValidator from '../basic-validators'
import resource from "../../resource";
import tags from "../base/constants/Tags";

let customRules = {
    // validationCustomRules: {
    //     ruleName: {
    //         validate: function (vo, index) {
    //             var rule = vo.pattern.rules[index];
    //             //return true or false
    //         },
    //         getErrorMessage: function (vo, index) {
    //             var rule = vo.invalidRules[index];
    //             //return string
    //         },
    //     },
    // },

    'min_input': {
        /**
         *  Min than input value. For integer, float and timeline patterns only
         *
         *  get p1 from:
         *  1. local tag
         *  2. related input friendly name
         *  3. related input value
         *
         * @param {ValidationEntry} vo
         * @param index
         * @returns {boolean}
         */
        validate: function (vo, index) {
            //return true or false

            let valueToValidate = vo.input.valueToValidate,
                /**
                 * @type Rule
                 */
                rule = vo.pattern.rules[index],
                /**
                 * @type JQuery
                 */
                minInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]'),

                /**
                 *
                 * @type {string|*}
                 */
                format = vo.pattern.timelineFormat.params[0];

            if (minInput.length) {

                let minInputValue = minInput.val();

                if (minInputValue) {
                    let isOut = rule.params[1] === 'o';
                    switch (vo.pattern.type) {
                        case PatternTypes.integer:
                        case PatternTypes.float:{
                            let parsedValue = parseFloat(valueToValidate);
                            minInputValue = parseFloat(minInputValue);

                            if (isNaN(minInputValue)) {
                                return false;
                            }
                            if (isOut) {
                                //isOut
                                if (parsedValue <= minInputValue)
                                    return false;
                            }
                            else {
                                //in
                                if (parsedValue < minInputValue)
                                    return false
                            }
                            break;
                        }
                        case PatternTypes.timeline:
                            if (isOut) {
                                //isOut
                                if (!basicValidator.isTimelineAfter(valueToValidate, minInputValue, format))
                                    return false;
                            }
                            else {
                                //in
                                if (!basicValidator.isTimelineAfterOrEqual(valueToValidate, minInputValue, format))
                                    return false;
                            }
                            break;
                    }
                }
            }
            return true;
        },
        /**
         *
         * @param {ValidationEntry} vo
         * @param index
         * @returns {string}
         */
        getErrorMessage: function (vo, index) {
            //return string

            /**
             * @type Rule
             */
            let rule = vo.pattern.invalidRules[index];

            let ruleName = 'min' + ((rule.params[1] === 'o' ? '_o' : '_i'));

            /**
             * get p1 from:
             *  1. rule 3rd parameter
             *  2. related input friendly name
             *  3. related input value
             */

            //rule 3rd parameter
            let p1 = rule.params[2];

            let relatedInput;

            //related input friendly name
            if (!p1) {
                relatedInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]');
                p1 = relatedInput.attr(tags.friendlyName);
            }

            //related input value
            if (!p1) {
                //no from-min tag is provided => get the value which is existed for sure
                p1 = relatedInput.val();
            }

            return resource.get(vo.pattern.name + '.' + ruleName, {
                fn: vo.input.friendlyName,
                p1: p1,
            });
        },
    },
    'max_input': {
        /**
         *  Max than input value. For integer, float and timeline patterns only
         * @param {ValidationEntry} vo
         * @param index
         * @returns {boolean}
         */
        validate: function (vo, index) {
            //return true or false

            let valueToValidate = vo.input.valueToValidate,
                /**
                 * @type Rule
                 */
                rule = vo.pattern.rules[index],
                /**
                 * @type JQuery
                 */
                maxInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]'),

                /**
                 *
                 * @type {string|*}
                 */
                format = vo.pattern.timelineFormat.params[0];

            if (maxInput.length) {

                let maxInputValue = maxInput.val();

                if (maxInputValue) {
                    let isOut = rule.params[1] === 'o';
                    switch (vo.pattern.type) {
                        case PatternTypes.integer:
                        case PatternTypes.float:{
                            let parsedValue = parseFloat(valueToValidate);
                            maxInputValue = parseFloat(maxInputValue);

                            if (isNaN(maxInputValue)) {
                                return false;
                            }
                            if (isOut) {
                                //isOut
                                if (parsedValue >= maxInputValue)
                                    return false;
                            }
                            else {
                                //in
                                if (parsedValue > maxInputValue)
                                    return false
                            }
                            break;
                        }
                        case PatternTypes.timeline:
                            if (isOut) {
                                //isOut
                                if (!basicValidator.isTimelineBefore(valueToValidate, maxInputValue, format))
                                    return false;
                            }
                            else {
                                //in
                                if (!basicValidator.isTimelineBeforeOrEqual(valueToValidate, maxInputValue, format))
                                    return false;
                            }
                            break;
                    }
                }
            }
            return true;
        },
        /**
         *
         * @param {ValidationEntry} vo
         * @param index
         * @returns {string}
         */
        getErrorMessage: function (vo, index) {
            //return string

            /**
             * @type Rule
             */
            let rule = vo.pattern.invalidRules[index];

            let ruleName = 'max' + ((rule.params[1] === 'o' ? '_o' : '_i'));

            /**
             * get p1 from:
             *  1. rule 3rd parameter
             *  2. related input friendly name
             *  3. related input value
             */

                //rule 3rd parameter
            let p1 = rule.params[2];

            let relatedInput;

            //related input friendly name
            if (!p1) {
                relatedInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]');
                p1 = relatedInput.attr(tags.friendlyName);
            }

            //related input value
            if (!p1) {
                //no from-min tag is provided => get the value which is existed for sure
                p1 = relatedInput.val();
            }

            return resource.get(vo.pattern.name + '.' + ruleName, {
                fn: vo.input.friendlyName,
                p1: p1,
            });
        },
    },
};

export default customRules;
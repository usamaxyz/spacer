import ValidationEntry from "../base/validation-entry";
import validatorBase from './validator-base'

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

        if (!entry.input.valueToValidate && entry.pattern.required) {
            entry.pattern.invalidRules.push(entry.pattern.required);
            return false;
        }
        return entry.pattern.invalidRules.length === 0;
    }
};
export default validator;
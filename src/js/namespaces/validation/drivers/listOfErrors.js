import config from "../../../config";
import ValidationEntry from '../base/validation-entry'

let validationErrors = [];
let listOfErrors = {
    /**
     *
     * @param {ValidationEntry} vo
     */
    onError: function (vo) {
        //add new errors
        for (let i = 0, l = vo.pattern.invalidRules.length; i < l; i++)
            validationErrors.push({
                msg: vo.pattern.invalidRules[i].message,
                input: vo.input
            });
        let ul = $(config.listOfErrorsSelector);
        if (ul.length) {
            let str = '';
            for (let i = 0, l = validationErrors.length; i < l; i++)
                str += '<li>' + validationErrors[i].msg + '</li>';
            ul.html(str);
        }
    },
    clearError: function (inputJq) {
        for (let i = validationErrors.length - 1; i >= 0; i--)
            if (validationErrors[i].input.jquery[0] === inputJq[0])
                validationErrors.splice(i, 1);
        let ul = $(config.listOfErrorsSelector);
        if (ul.length) {
            let str = '',
                l = validationErrors.length;
            for (let i = 0; i < l; i++)
                str += '<li>' + validationErrors[i].msg + '</li>';
            ul.html(str);
        }
    },
    getErrorList: function () {
        let result = [];
        for (let i = 0, l = validationErrors.length; i < l; i++) {
            let newItem = validationErrors[i];

            let index = -1;
            for (let _j = 0, _m = result.length; _j < _m; _j++)
                if (result[_j].input.jquery[0] === newItem.input.jquery[0]) {
                    index = _j;
                    break;
                }
            if (index === -1)
            //not exist
                result.push({
                    input: newItem.input,
                    errors: [newItem.msg]
                });
            else
            //exist => add message to error list
                result[index].errors.push(newItem.msg);
        }
        return result;
    }
};

export default listOfErrors
'use strict';

var listOfErrors = function () {
    var validationErrors = [],
        listOfErrorsSelector = '#spa-listOfErrors';

    return {
        setListOfErrorsSelector: function setListOfErrorsSelector(v) {
            listOfErrorsSelector = v;
            return this;
        },
        onError: function onError(vo) {
            //add new errors
            for (var i = 0, l = vo.pattern.invalidRules.length; i < l; i++) {
                validationErrors.push({
                    msg: vo.pattern.invalidRules[i].message,
                    input: vo.input
                });
            }var ul = $(listOfErrorsSelector);
            if (ul.length) {
                var str = '';
                for (var _i = 0, _l = validationErrors.length; _i < _l; _i++) {
                    str += '<li>' + validationErrors[_i].msg + '</li>';
                }ul.html(str);
            }
        },
        clearError: function clearError(inputJq) {
            for (var i = validationErrors.length - 1; i >= 0; i--) {
                if (validationErrors[i].input.jquery[0] === inputJq[0]) validationErrors.splice(i, 1);
            }var ul = $(listOfErrorsSelector);
            if (ul.length) {
                var str = '';
                for (var _i2 = 0, l = validationErrors.length; _i2 < l; _i2++) {
                    str += '<li>' + validationErrors[_i2].msg + '</li>';
                }ul.html(str);
            }
        },
        getErrorList: function getErrorList() {
            var result = [];
            for (var i = 0, l = validationErrors.length; i < l; i++) {
                var newItem = validationErrors[i];

                var index = -1;
                for (var _j = 0, _m = result.length; _j < _m; _j++) {
                    if (result[_j].input.jquery[0] === newItem.input.jquery[0]) {
                        index = _j;
                        break;
                    }
                }if (index === -1)
                    //not exist
                    result.push({
                        input: newItem.input,
                        errors: [newItem.msg]
                    });else
                    //exist => add message to error list
                    result[index].errors.push(newItem.msg);
            }
            return result;
        }
    };
}();
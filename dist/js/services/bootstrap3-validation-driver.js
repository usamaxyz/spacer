'use strict';

var bootstrap3ValidationDriver = {
    onError: function onError(vo) {
        var invalidRules = vo.pattern.invalidRules;
        var helpBlock = vo.input.jquery.closest('[class*="form-group"]').addClass('has-error').find('.help-block');
        if (helpBlock.length !== 0) {
            var html = '';
            if (invalidRules.length === 1) html = invalidRules[0].message;else {
                html = '<ul>';
                for (var i = 0, l = invalidRules.length; i < l; i++) {
                    html = html + '<li>' + invalidRules[i].message + '</li>';
                }html = html + '</ul>';
            }
            helpBlock.html(html);
        }
        if (vo.confirmInput) {
            var found = false;
            for (var _i = 0, _l = invalidRules.length; _i < _l; _i++) {
                if (invalidRules[_i].type === spa.ruleTypes.confirmed) {
                    found = true;
                    break;
                }
            }if (found) vo.confirmInput.jquery.closest('[class*="form-group"]').addClass('has-error');
        }
    },
    clearError: function clearError(inputJq) {
        inputJq.closest('[class*="form-group"]').removeClass('has-error').find('.help-block').html('');
        //confirm input
        var ci = inputJq.data('_spa-ci');
        if (ci) ci.closest('[class*="form-group"]').removeClass('has-error');
    }
};
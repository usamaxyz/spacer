import RuleTypes from '../base/constants/RuleTypes'
import ValidationEntry from '../base/validation-entry'

let bootstrap3 = {

    /**
     * @param {ValidationEntry} vo
     */
    onError: function (vo) {
        let invalidRules = vo.pattern.invalidRules;
        let helpBlock = vo.input.jquery.closest('[class*="form-group"]').addClass('has-error').find('.help-block');
        if (helpBlock.length !== 0) {
            let html = '';
            if (invalidRules.length === 1)
                html = vo.pattern.invalidRules[0].message;
            else {
                html = '<ul>';
                for (let i = 0, l = invalidRules.length; i < l; i++)
                    html = html + '<li>' + invalidRules[i].message + '</li>';
                html = html + '</ul>';
            }
            helpBlock.html(html);
        }
        if (vo.confirmInput) {
            let found = false;
            for (let i = 0, l = invalidRules.length; i < l; i++)
                if (invalidRules[i].type === RuleTypes.confirmed) {
                    found = true;
                    break;
                }
            if (found)
                vo.confirmInput.jquery.closest('[class*="form-group"]').addClass('has-error');
        }
    },
    clearError: function (inputJq) {
        inputJq.closest('[class*="form-group"]')
            .removeClass('has-error')
            .find('.help-block')
            .html('');
        //confirm input
        let ci = inputJq.data('_spa-ci');
        if (ci)
            ci.closest('[class*="form-group"]').removeClass('has-error');
    }
};
export default bootstrap3
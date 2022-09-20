window.bootstrap43HybridValidationDriver = {
    onError: function (vo) {
        let invalidRules = vo.pattern.invalidRules;
        let helpBlock = vo.input.jquery.addClass('is-invalid').closest('[class*="form-group"]').addClass('has-error has-danger').find('.invalid-feedback');
        if (helpBlock.length !== 0) {
            let html = '';
            if (invalidRules.length === 1)
                html = invalidRules[0].message;
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
                if (invalidRules[i].type === spa.ruleTypes.confirmed) {
                    found = true;
                    break;
                }
            if (found)
                vo.confirmInput.jquery.addClass('is-invalid');
        }
    },
    clearError: function (inputJq) {
        inputJq.removeClass('is-invalid')
            .closest('[class*="form-group"]')
            .removeClass('has-error has-danger')
            .find('.invalid-feedback')
            .html('');
        //confirm input
        let ci = inputJq.data('_spa-ci');
        if (ci)
            ci.removeClass('is-invalid');
    }
};
window.bootstrap4ValidationDriver = {
    onError: function (vo) {
        let invalidRules = vo.pattern.invalidRules;
        let helpBlock = vo.input.jquery.addClass('is-invalid').closest('[class*="form-group"]').find('.invalid-feedback');
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
            helpBlock.html(html).addClass('d-block');
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
            .find('.invalid-feedback')
            .removeClass('d-block')
            .html('');
        //confirm input
        let ci = inputJq.data('_spa-ci');
        if (ci)
            ci.removeClass('is-invalid');
    }
};
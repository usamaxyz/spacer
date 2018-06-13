import resource from './resource'
import ajax from './ajax'
import web from './web'
import dom from './dom'
import input from './input'
import validationUnit from './validation/units/validation-unit'
import basic from '../basic'

let formNamespace = {
    submitAjax: function (form, submitter, validate, fn) {
        form = basic.sis(form);
        submitter = basic.sis(submitter);
        if (!form.length || !submitter.length)
            throw resource.get('ex.fosnf');

        if (validate && !validationUnit.validate(form))
            return false;

        let url = form.attr('action') || web.getUrlWithQueryString();
        let verb = form.attr('method') || 'get';

        if (verb.trim().toLowerCase() === 'post') {
            if (form.find('input[type=file]').length) {
                //contains files
                //type = post
                let data = new FormData(form[0]);
                return ajax.request('POST', url, data, fn, true, undefined, submitter);
            }
            else
                return ajax.post(url, form.serialize(), fn, submitter);
        }
        else
            return ajax.get(url, form.serialize(), fn, submitter);
    },
    submit: function (form, submitter, validate) {
        form = basic.sis(form);
        submitter = basic.sis(submitter);
        if (!form.length || !submitter.length)
            throw resource.get('ex.fosnf');

        if (validate && !validationUnit.validate(form))
            return false;

        dom.setLoadingButton(submitter);
        form.submit();
    },
    registerNormalSubmitter: function (form, submitter, validate) {
        form = basic.sis(form);
        submitter = basic.sis(submitter);
        if (!form.length || !submitter.length)
            return;
        submitter.on('click', function (e) {
            e.preventDefault();
            formNamespace.submit(form, submitter, validate);
        });
    },
    registerAjaxSubmitter: function (form, submitter, validate, fn) {
        form = basic.sis(form);
        submitter = basic.sis(submitter);
        if (!form.length || !submitter.length)
            return;
        submitter.on('click', function (e) {
            e.preventDefault();
            formNamespace.submitAjax(form, submitter, validate, fn);
        });
    },
    getFormInputsAsObject: function (form) {
        form = basic.sis(form);
        if (!form.length)
            throw resource.get('ex.fnf');
        let result = {},
            inputs = getFormInputs(form);

        for (let i = 0, l = inputs.length; i < l; i++) {
            let elem = $(inputs[i]);
            let name = elem.attr('name');
            if (!name)
                return;
            if (elem.is(':checkbox')) {
                if ($('input[name="' + name + '"]').length === 1)
                //single
                    result[name] = input.checkable.isChecked(elem);
                else {
                    //multiple
                    if (input.checkable.isChecked(elem)) {
                        if (result[name])
                            result[name].push(basic.trim(elem.val()));
                        else
                            result[name] = [basic.trim(elem.val())];
                    }
                }
            }
            else if (elem.is(':radio'))
                result[name] = input.getValue('input[name="' + name + '"]:checked');
            else
                result[name] = input.getValue(elem);
        }
        return result;
    }
};

export default formNamespace

export function getFormInputs(s) {
    return s.find('input, textarea, select')
        .not(':input[type=button], :input[type=submit], :input[type=reset]');
}
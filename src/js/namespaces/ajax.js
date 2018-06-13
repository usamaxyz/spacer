import dom from './dom'
import web from './web'
import resource from './resource'
import dialog from './dialog/dialog'
import config from "../config";

let ajax = {
    request: function (verb, url, data, fn, isUpload, options, button) {
        let o = {
            headers: config.ajaxHeader,
            type: verb,
            url: url || web.getUrlWithQueryString(),
            data: data,
            // dataType: 'json',
            success: fn,
            error: config.ajaxOnError
        };
        if (isUpload) {
            o['cache'] = false;
            o['contentType'] = false;
            o['processData'] = false;
        }
        if (options)
            $.extend(o, options);

        let ajax = $.ajax(o);
        if (button)
            dom.setLoadingButton(button, ajax);
        return ajax;
    },
    post: function (url, data, fn, button) {
        let o = {
            headers: config.ajaxHeader,
            type: 'post',
            url: url || web.getUrlWithQueryString(),
            data: data,
            // dataType: 'json',
            success: fn,
            error: config.ajaxOnError
        };

        let ajax = $.ajax(o);
        if (button)
            dom.setLoadingButton(button, ajax);
        return ajax;
    },
    get: function (url, data, fn, button) {
        let o = {
            headers: config.ajaxHeader,
            type: 'get',
            url: url || web.getUrlWithQueryString(),
            data: data,
            // dataType: 'json',
            success: fn,
            error: config.ajaxOnError
        };

        let ajax = $.ajax(o);
        if (button)
            dom.setLoadingButton(button, ajax);
        return ajax;
    },
    delete: function (url, data, fn, button) {
        let o = {
            headers: config.ajaxHeader,
            type: 'delete',
            url: url || web.getUrlWithQueryString(),
            data: data,
            // dataType: 'json',
            success: fn,
            error: config.ajaxOnError
        };

        let ajax = $.ajax(o);
        if (button)
            dom.setLoadingButton(button, ajax);
        return ajax;
    },
    put: function (url, data, fn, button) {
        let o = {
            headers: config.ajaxHeader,
            type: 'put',
            url: url || web.getUrlWithQueryString(),
            data: data,
            // dataType: 'json',
            success: fn,
            error: config.ajaxOnError
        };

        let ajax = $.ajax(o);
        if (button)
            dom.setLoadingButton(button, ajax);
        return ajax;
    },
};

export default ajax

function ajaxOnError(jqXHR) {
    //jqXHR, textStatus, errorThrown
    dialog.messageError(
        resource.get('ajax.errorTitle'),
        resource.get('ajax.errorBody') + jqXHR.status);
}

function addLaravelToken() {
    let token = $('meta[name="csrf-token"]');
    if (token.length) {
        if (config.ajaxHeader)
            config.ajaxHeader['X-CSRF-TOKEN'] = token.attr('content');
        else
            config.ajaxHeader = {'X-CSRF-TOKEN': token.attr('content')};
    }
}

export {ajaxOnError, addLaravelToken}
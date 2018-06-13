import array from './namespaces/array'
import resource from './namespaces/resource'
import ajax from './namespaces/ajax'
import dialog from './namespaces/dialog/dialog'
import dom from './namespaces/dom'
import form from './namespaces/form'
import init from './namespaces/init'
import input from './namespaces/input'
import storage from './namespaces/storage'
import table from './namespaces/table'
import util from './namespaces/util'
import validation from './namespaces/validation/validation'
import web from './namespaces/web'
import {updateMomentLocale} from './namespaces/init'

import config from './config'
import {addLaravelToken} from './namespaces/ajax'

import moment from 'moment'
import $ from 'jquery'

window.$ = window.jQuery = $;
window.moment = moment;

let spacer = {
    setOptions: function (o) {
        $.extend(true, config, o);

        if (config.ajaxLaravelHeader) {
            addLaravelToken();
        }
        updateMomentLocale();
    },
    setDialogCD: function (d) {
        if (config.dialogDrivers[d])
            config.dialogCurrentDriver = d;
        else
            throw resource.get('ex.ddnf', {p: d});
    },
    setValidationCD: function (d) {
        let ok = false;
        if (config.validationDrivers[d]) {
            config.validationCurrentDriver = d;
            ok = true;
        }
        else {
            let s = d.split('.');
            if (s[0] === 'dialog') {
                if (s.length === 1) {
                    config.validationCurrentDriver = d;
                    ok = true
                }
                else if (s.length === 2) {
                    if (config.dialogDrivers[s[1]]) {
                        config.validationCurrentDriver = d;
                        ok = true;
                    }
                }
            }
        }
        if (!ok)
            throw resource.get('ex.vdnf', {p: d});
    },
    setFlashCD: function (d) {
        if (config.flashDrivers[d])
            config.flashCurrentDriver = d;
        else
            throw resource.get('ex.fdnf', {p: d});
    },
    getLocale: function () {
        return config.locale;
    },
    setLocale: function (l) {
        config.locale = l.toLowerCase();
        updateMomentLocale();
    },
    isLocale: function (l) {
        return config.locale === l.toLowerCase();
    },
    getTimelineFormat: function () {
        return config.timelineFormat;
    },

    ajax,
    array,
    dialog,
    dom,
    form,
    input,
    resource,
    table,
    util,
    validation,
    web,

    //not documented
    init,
    storage,
};

window.spa = spacer;

export default spacer
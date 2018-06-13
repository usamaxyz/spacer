import resource from './resource'
import dialog from './dialog/dialog'
import ajax from './ajax'
import web from './web'
import table from './table'
import basic from '../basic'
import config from '../config'

let init = {
    datepicker: function (input, options) {
        input = basic.sis(input);
        if (input.length) {
            let def = config.datepickerOptions[config.locale];
            if (options)
                def = $.extend({}, def, options);
            input.datepicker(def);
        }
    },
    select2: function (input, options) {
        input = basic.sis(input);
        if (input.length) {
            let def = { dir: (config.locale === 'ar' ? 'rtl' : 'ltr') };
            if (options)
                def = $.extend({}, def, options);
            input.select2(def);
        }
    },
    dataTable: function (table, options) {
        table = basic.sis(table);
        if (table.length) {
            let def = config.datatableOptions[config.locale];
            if (options)
                def = $.extend({}, def, options);
            table.DataTable(def);
        }
    },
    createCounter: function (input, counter, max) {
        input = basic.sis(input);
        counter = basic.sis(counter);
        if (input.length && counter.length) {
            input.on('keyup', function () {
                let targetObjLength = input.val().length;
                let delta = max - targetObjLength;
                if (delta < 0)
                    input.val(input.val().substring(0, max));
                counter.html(delta < 0 ? 0 : delta);
            });
            input.trigger('keyup');
        }
    },
    autoComplete: function (input, url, appendTo) {
        input = basic.sis(input);
        if (input.length) {
            input.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: url,
                        dataType: "jsonp",
                        data: {
                            term: request.term
                        },
                        success: function (data) {
                            response(data);
                        }
                    });
                },
                minLength: 2
            });
            if (appendTo) {
                //set appendTo option to appendTo variable
                input.autocomplete("option", "appendTo", appendTo);
            }
        }
    },
    showMsg: function (selector, dataAttribute, context) {
        if (context) {
            context = basic.sis(context);
            if (context.length) {
                context.on('click', selector, function (e) {
                    e.preventDefault();
                    dialog.message('', $(this).attr(dataAttribute), 'info', 'info');
                });
            }
        }
        else {
            selector = basic.sis(selector);
            if (selector.length) {
                selector.on('click', function (e) {
                    e.preventDefault();
                    dialog.message('', $(this).attr(dataAttribute), 'info', 'info');
                });
            }
        }
    },
    deleteAndRedirect: function (btnSelector, deleteUrl, redirectUrl, title, msg) {
        btnSelector = basic.sis(btnSelector);
        if (btnSelector.length) {
            btnSelector.on('click', function (e) {
                e.preventDefault();
                title = title ? title : resource.get('delete.title');
                msg = msg ? msg : resource.get('delete.confirm');
                dialog.confirm(title, msg, 'warning', 'warning', function () {
                    ajax.delete(deleteUrl, null, function (data) {
                        dialog.messageSuccess('', data.message, function () {
                            web.redirect(redirectUrl);
                        });
                    }, btnSelector);
                });
            });
        }
    },
    listDelete: function (btnSelector, idAttribute, url, tableSelector, title, msg) {
        btnSelector = basic.sis(btnSelector);
        if (btnSelector.length) {
            btnSelector.on('click', function (e) {
                e.preventDefault();
                let self = $(this);
                let delUrl = url.replace(':id', self.attr(idAttribute));
                title = title ? title : resource.get('delete.title');
                msg = msg ? msg : resource.get('delete.confirm');
                dialog.confirm(title, msg, 'warning', 'warning', function () {
                    ajax.delete(delUrl, null, function (data) {
                        dialog.messageSuccess('', data.message, function () {
                            table.removeRows(tableSelector, self.closest('tr'));
                        });
                    }, self);
                });
            });
        }
    },
};

export default init

function updateMomentLocale() {
    if (window.moment) {
        let currentLocale = config.locale;
        if (currentLocale === 'en') {
            //en is the original locale => already defined by default in moment
            moment.locale('en');
        }
        else {
            //locale is not en
            //try to set the locale: moment.locale returns the locale used. This is useful because Moment won't change locales if it doesn't know the one you specify.
            if (moment.locale(currentLocale) !== currentLocale) {
                //config.locale is not loaded into moment => we should load it => it will be set as default automatically
                let options = config.momentLocales[config.locale];
                if (options)
                    moment.locale(currentLocale, config.momentLocales[config.locale]);
            }
        }
    }
}

export {updateMomentLocale}
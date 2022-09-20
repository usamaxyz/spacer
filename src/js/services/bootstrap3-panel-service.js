window.bootstrap3PanelService = function () {
    let core = function (options) {
        let modalJq,
            confirmBtn;

        options = $.extend({}, spa.dialogDefaults, options);
        // options.status = options.status ? ('panel-' + options.status) : '';
        options.confirmBtn.class = options.confirmBtn.class ? options.confirmBtn.class : 'btn-default';
        options.cancelBtn.class = options.cancelBtn.class ? options.cancelBtn.class : 'btn-default';

        //build html
        let html = '<div id="_spa-modal" class="modal fade" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog ' + options.dialogClass + '" role="document"><div class="modal-content">' +
            '<div class="panel panel-' + options.status + '" style="margin-bottom: 0;">';

        if (options.title)
            html += '<div class="panel-heading" style="padding: 12px 15px;">' +
                '<h3 class="panel-title text-center" style="font-size: 18px;">' + options.title + '</h3></div>';

        html += '<div class="panel-body text-center">';

        if (options.icon)
            html += '<h3 class="text-' + options.status + '" style="margin-top: 0;">' + options.icon + '</h3>';

        if (options.message)
            html += '<p style="font-size: 18px;">' + options.message + '</p>';


        html += '<div id="_spa-dialog-content" style="width: 80%; margin: 23px auto 0;"></div>';

        if (options.confirmBtn.text || options.cancelBtn.text) {
            html += '</div><div class="panel-footer text-right">';

            if (options.confirmBtn.text)
                html += '<button id="_spa-dialog-confirm" type="button" class="btn ' + options.confirmBtn.class + '" style="min-width: 80px;">' + options.confirmBtn.text + '</button> ';

            if (options.cancelBtn.text)
                html += '<button id="_spa-dialog-cancel" type="button" class="btn ' + options.cancelBtn.class + '" style="min-width: 80px;">' + options.cancelBtn.text + '</button> ';

            html += '</div>';
        }
        html += '</div></div></div></div></div>';

        modalJq = $(html);
        confirmBtn = modalJq.find('#_spa-dialog-confirm');
        if (options.input)
            modalJq.find('#_spa-dialog-content').append(options.input);


        //attach to body and prepare events
        $('body').append(modalJq);

        let confirmed = false;
        let inputValue = undefined;
        if (options.confirmBtn.text)
            modalJq.on('click', '#_spa-dialog-confirm', function () {

                confirmed = true;
                if (options.input) {
                    if (!spa.validation.validate(modalJq))
                        return;
                    inputValue = spa.form.getFormInputsAsObject(modalJq);
                }

                if (options.preConfirm)
                    options.preConfirm.call(dialog, inputValue);

                if (options.closeOnConfirm)
                    dialog.hide();
            });
        if (options.cancelBtn.text)
            modalJq.on('click', '#_spa-dialog-cancel', function () {
                dialog.hide();
            });

        modalJq.on('hidden.bs.modal', function () {
            //cancel: cancel button, esc, click outside
            if (confirmed) {
                if (options.onConfirm) options.onConfirm.call(dialog, inputValue);
            }
            else {
                if (options.onCancel) options.onCancel.call(dialog);
            }
            modalJq.remove();
            dialog = undefined;
        });
        modalJq.modal();

        if (options.input)
            modalJq.find('input').first().focus();

        confirmBtn = modalJq.find('#_spa-dialog-confirm');

        let dialog = {
            hide: function () {
                modalJq.modal('hide');
            },
            showLoading: function () {
                if (confirmBtn.length)
                    spa.dom.setLoadingButton(confirmBtn);
            },
            removeLoading: function () {
                if (confirmBtn.length)
                    spa.dom.unsetLoadingButton(confirmBtn);
            }
        };

        return dialog
    };

    return {
        message(title, msg, status, icon, fn) {
            let b = {
                title: title,
                message: msg,
                status: status,
                icon: spa.resource.get('icon.' + icon) || icon,
                confirmBtn: {
                    text: spa.resource.get('btn.ok'),
                    class: 'btn-default'
                },
                onConfirm: fn
            };
            core(b);
        },

        confirm(title, msg, status, icon, fn1, fn2) {
            let b = {
                title: title,
                message: msg,
                status: status,
                icon: spa.resource.get('icon.' + icon) || icon,
                confirmBtn: {
                    text: spa.resource.get('btn.yes'),
                    class: 'btn-default'
                },
                cancelBtn: {
                    text: spa.resource.get('btn.no'),
                    class: 'btn-danger'
                },
                onConfirm: fn1,
                onCancel: fn2
            };
            core(b);
        },

        prompt(title, msg, status, icon, fn1, fn2) {
            let b = {
                title: title,
                message: msg,
                status: status,
                icon: spa.resource.get('icon.' + icon) || icon,
                input: '<input name="input" class="form-control" />',
                confirmBtn: {
                    text: spa.resource.get('btn.continue'),
                    class: 'btn-default'
                },
                cancelBtn: {
                    text: spa.resource.get('btn.cancel'),
                    class: 'btn-danger'
                },
                onConfirm: fn1,
                onCancel: fn2
            };
            core(b);
        }
    }

}();

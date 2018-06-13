import resource from "../../resource";

class SpacerDialog {
    constructor(service) {
        this.service = service;
    }

    message(title, msg, status, icon, fn) {
        let b = {
            title: title,
            message: msg,
            status: status,
            icon: resource.get('icon.' + icon) || icon,
            confirmBtn: {
                text: resource.get('btn.ok'),
                class: 'btn-default'
            },
            onConfirm: fn
        };
        this.service(b);
    }

    confirm(title, msg, status, icon, fn1, fn2) {
        let b = {
            title: title,
            message: msg,
            status: status,
            icon: resource.get('icon.' + icon) || icon,
            confirmBtn: {
                text: resource.get('btn.yes'),
                class: 'btn-default'
            },
            cancelBtn: {
                text: resource.get('btn.no'),
                class: 'btn-danger'
            },
            onConfirm: fn1,
            onCancel: fn2
        };
        this.service(b);
    }

    prompt(title, msg, status, icon, fn1, fn2) {
        let b = {
            title: title,
            message: msg,
            status: status,
            icon: resource.get('icon.' + icon) || icon,
            input: '<input name="input" class="form-control" />',
            confirmBtn: {
                text: resource.get('btn.continue'),
                class: 'btn-default'
            },
            cancelBtn: {
                text: resource.get('btn.cancel'),
                class: 'btn-danger'
            },
            onConfirm: fn1,
            onCancel: fn2
        };
        this.service(b);
    }
}

export default SpacerDialog;
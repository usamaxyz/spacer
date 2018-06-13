import resource from "../../resource";

function iconMapper(icon) {
    switch (icon) {
        case 'danger':
            return 'error';
        default:
            return icon;
    }
}

let sweatAlert = {
    message: function (title, msg, status, icon, fn) {
        swal({
            title: title,
            text: msg,
            icon: iconMapper(icon),
            button: resource.get('btn.ok')
        }).then(function () {
            if (fn) fn();
        });
    },
    confirm: function (title, msg, status, icon, fn1, fn2) {
        swal({
            title: title,
            text: msg,
            icon: iconMapper(icon),
            dangerMode: true,
            buttons: [resource.get('btn.no'), resource.get('btn.yes')]
        }).then(function (value) {
            if (value && fn1)
                fn1();
            else if (fn2)
                fn2();
        });
    },
    prompt: function (title, msg, status, icon, fn1, fn2) {
        swal({
            title: title,
            text: msg,
            icon: iconMapper(icon),
            content: "input",
            buttons: [resource.get('btn.cancel'), resource.get('btn.continue')]
        }).then(function (value) {
            if (value === null && fn2)
                if (fn2) fn2();
                else if (fn1) fn1(value);
        });
    }
};

export default sweatAlert;
import config from '../../config'
import bootstrap3Modal from './dialog-services/bootstrap3-modal'
import bootstrap3Panel from './dialog-services/bootstrap3-panel'

let dialog = {
    message: function (title, msg, status, icon, fn) {
        config.dialogDrivers[config.dialogCurrentDriver].message(title, msg, status, icon, fn);
    },
    confirm: function (title, msg, status, icon, fn1, fn2) {
        config.dialogDrivers[config.dialogCurrentDriver].confirm(title, msg, status, icon, fn1, fn2);
    },
    prompt: function (title, msg, status, icon, fn1, fn2) {
        config.dialogDrivers[config.dialogCurrentDriver].prompt(title, msg, status, icon, fn1, fn2);
    },

    messageSuccess: function (title, msg, fn) {
        config.dialogDrivers[config.dialogCurrentDriver].message(title, msg, 'success', 'success', fn);
    },
    messageError: function (title, msg, fn) {
        config.dialogDrivers[config.dialogCurrentDriver].message(title, msg, 'danger', 'danger', fn);
    },

    bootstrap3Panel,
    bootstrap3Modal,

    /*
    *   pos: top-left, top-center, top-right
    *   pos: bottom-left, bottom-center, bottom-right
    */
    flash: function (title, message, status, icon, timeout, position) {
        config.flashDrivers[config.flashCurrentDriver].flash(title, message, status, icon, timeout, position);
    },
    flashSuccess: function (title, message, icon, timeout, position) {
        config.flashDrivers[config.flashCurrentDriver].flash(title, message, 'success', icon, timeout, position);
    },
    flashError: function (title, message, icon, timeout, position) {
        config.flashDrivers[config.flashCurrentDriver].flash(title, message, 'danger', icon, timeout, position);
    }
};

export default dialog
import resource from './resource'
import basic from '../basic'
import tags from "./validation/base/constants/Tags";

/**
 * dataKey is used to store original button html before changing to loading icon
 */
const dataKey = '_spa-original-html';

let dom = {
    getFriendlyName: function(input) {
        //get friendly name
        let name = input.attr(tags.friendlyName);
        return (name === undefined) ? resource.get('validation.defaultFriendlyName') : name;
    },
    setDisable: function (item, status) {
        item = basic.sis(item);
        if (item.length) {
            if (item.is('button') || item.is('input'))
                item.prop('disabled', status);
            else
                status ? item.addClass('disabled') : item.removeClass('disabled');
            return item;
        }
    },
    setLoadingButton: function (button, ajax = undefined) {
        button = basic.sis(button);
        if (button.length) {
            button.data(dataKey, button.html());
            //fix the width
            button.css('min-width', button.css('width'));
            button.html(resource.get('icon.loading'));
            dom.setDisable(button, true);

            if (ajax) {
                ajax.always(function () {
                    dom.unsetLoadingButton(button);
                });
            }
            return button;
        }
    },
    unsetLoadingButton: function (button, html) {
        button = basic.sis(button);
        if (button.length) {
            button.html(html ? html : button.data(dataKey));
            dom.setDisable(button, false);
            button.css('min-width', 'auto');
            return button;
        }
    },
};

export default dom;
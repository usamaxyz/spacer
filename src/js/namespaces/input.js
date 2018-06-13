import basic from '../basic'

let inputNamespace = {
    // used in web production
    getValue: function (input) {
        input = basic.sis(input);
        if (input.length)
            return basic.trim(input.val());
    },
    getFiles: function (input) {
        input = basic.sis(input);
        if (input.length)
            return input[0].files;
    },
    setValue: function (input, value) {
        input = basic.sis(input);
        if (input.length)
            return input.val(value).trigger('change');
        return input;
    },
    select: {
        getSelectedOption: function (select) {
            select = basic.sis(select);
            if (select.length) {
                let o = select.find(':selected');
                if (o.length)
                    return o;
            }
        },
        getSelectedValue: function (select) {
            return inputNamespace.getValue(select);
        },
        getSelectedText: function (select) {
            let o = inputNamespace.select.getSelectedOption(select);
            if (o)
                return basic.trim(o.text());
        },
        getSelectedIndex: function (select) {
            select = basic.sis(select);
            if (select.length)
                return select.prop('selectedIndex');
            return -1;
        },
        setSelectedIndex: function (select, index) {
            if (index >= 0) {
                select = basic.sis(select);
                if (select.length) {
                    let o = select.find('option:nth-child(' + (index + 1) + ')');
                    if (o.length) {
                        o.prop('selected', true);
                        select.trigger('change');
                        return select;
                    }
                }
            }
        },
        setSelectedValue: function (select, value) {
            return inputNamespace.setValue(select, value);
        },
        setFirstOptionSelected: function (select) {
            select = basic.sis(select);
            if (select.length) {
                let ops = select.find('option:first-child');
                if (ops.length) {
                    ops.prop('selected', true);
                    select.trigger('change');
                    return select;
                }
            }
        },
        clearOptions: function (select) {
            select = basic.sis(select);
            if (select.length)
                return select.empty().trigger('change');
        },
        addOptions: function (select, options, removeCurrent, firstOptionLabel) {
            select = basic.sis(select);
            if (select.length) {
                let str = '';
                if (firstOptionLabel)
                    str += '<option selected disabled value>' + firstOptionLabel + '</option>';
                for (let i = 0, l = options.length; i < l; i++)
                    str += '<option value="' + options[i].value + '">' + options[i].text + '</option>';
                if (removeCurrent)
                    select.empty().html(str);
                else
                    select.append(str);
                return select.trigger('change');
            }
        },
        addOption: function (select, option, isSelected) {
            select = basic.sis(select);
            if (select.length) {
                let o = $('<option value="' + option.value + '">' + option.text + '</option>');
                select.append(o);

                if (isSelected)
                    o.prop('selected', true);
                return select.trigger('change');
            }
        }
    },
    checkable: {
        // used in web production
        isChecked: function (input) {
            input = basic.sis(input);
            if (input.length)
                return input.is(':checked');
        },
        set: function (input, status) {
            input = basic.sis(input);
            if (input.length)
                return input.prop("checked", status).trigger('change');
        },
        getRadioGroupValue: function (name) {
            return inputNamespace.getValue('input[name="' + name + '"]:checked');
        },
        getCheckboxGroupArray: function (name) {
            let value = [],
                g = $('input[name="' + name + '"]:checked');
            let l = g.length;
            if (l)
                for (let i = 0; i < l; i++)
                    value.push(basic.trim($(g[i]).val()));
            return value;
        }
    }
};

export default inputNamespace
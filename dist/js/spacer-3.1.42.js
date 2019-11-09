'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var spa = function () {

    //config
    var days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        daysShort = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
        daysMin = ['أح', 'اث', 'ث', 'أر', 'خ', 'ج', 'س'],
        months = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'أب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
        monthsShort = ['كانون 2', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'أب', 'أيلول', 'تشرين 1', 'تشرين 2', 'كانون 1'],
        dialogDefaults = {
        title: '',
        message: '',
        status: '',
        icon: '',
        input: '',
        closeOnConfirm: true,

        dialogClass: '',

        confirmBtn: {
            text: '',
            class: ''
        },
        cancelBtn: {
            text: '',
            class: ''
        }
    },
        PatternTypes = {
        integer: 1,
        float: 2,
        string: 3,
        timeline: 4,
        email: 5,
        url: 6,
        in: 7,
        check: 8,
        file: 9,
        regex: 10
    },
        RuleTypes = {
        required: 1,
        positive: 2,
        negative: 3,
        min: 4,
        max: 5,
        range: 6,
        not: 7,
        confirmed: 8,
        of: 9,
        not_of: 10,
        len: 11,
        format: 12,
        in_domain: 13,
        not_in_domain: 14,
        items: 15,
        ext: 16,
        pattern: 17,
        //single file
        s_min: 18,
        s_max: 19,
        s_range: 20,
        lite: 21,
        pre: 22
    },
        Tags = {
        validationTag: 'data-v-p',
        friendlyName: 'data-v-fn',

        //for validation
        cachedValidationEntry: '_spa-cve',
        confirmInput: '_spa-ci',
        isEventAttached: '_spa-iea',
        needValidation: '_spa-nv',
        timer: '_spa-t',

        //loading btn
        loadingHtml: '_spa-original-html'
    },
        cachingTags = '_spa-cve _spa-ci _spa-iea _spa-nv _spa-t';

    var config = {
        locale: 'en',
        debug: false,
        timelineFormat: 'D-M-YYYY',
        trimValues: true,

        ajaxOnError: function ajaxOnError(jqXHR) {
            //jqXHR, textStatus, errorThrown
            spa.dialog.messageError(spa.resource.get('ajax.errorTitle'), spa.resource.get('ajax.errorBody') + jqXHR.status);
        },
        ajaxLaravelHeader: false,
        ajaxHeader: undefined,

        //for util.token
        tokenValue: undefined,
        tokenName: undefined,

        /*
            'alert'
            'sweetAlert'
         */
        dialogCurrentDriver: 'alert',
        dialogDrivers: {
            alert: {
                message: function message(title, msg, status, icon, fn) {
                    window.alert(title + "\n" + msg);
                    if (fn) fn();
                },
                confirm: function confirm(title, msg, status, icon, fn1, fn2) {
                    if (window.confirm(title + "\n" + msg)) fn1();else if (fn2) fn2();
                },
                prompt: function prompt(title, msg, status, icon, fn1, fn2, defaultValue) {
                    var result = window.prompt(title + "\n" + msg, defaultValue);
                    if (result === null) {
                        if (fn2) fn2();
                    } else fn1(result);
                }
            },
            sweetAlert: function () {
                function iconMapper(icon) {
                    if (icon === 'danger') return 'error';
                    return icon;
                }

                return {
                    message: function message(title, msg, status, icon, fn) {
                        swal({
                            title: title,
                            text: msg,
                            icon: iconMapper(icon),
                            button: spa.resource.get('btn.ok')
                        }).then(function () {
                            if (fn) fn();
                        });
                    },
                    confirm: function confirm(title, msg, status, icon, fn1, fn2) {
                        swal({
                            title: title,
                            text: msg,
                            icon: iconMapper(icon),
                            dangerMode: true,
                            buttons: [spa.resource.get('btn.no'), spa.resource.get('btn.yes')]
                        }).then(function (value) {
                            if (value) fn1();else if (fn2) fn2();
                        });
                    },
                    prompt: function prompt(title, msg, status, icon, fn1, fn2, defaultValue) {
                        swal({
                            title: title,
                            text: msg,
                            icon: iconMapper(icon),
                            content: {
                                element: 'input',
                                attributes: {
                                    defaultValue: defaultValue
                                }
                            },
                            buttons: [spa.resource.get('btn.cancel'), spa.resource.get('btn.continue')]
                        }).then(function (value) {
                            if (value === null) {
                                if (fn2) fn2();
                            } else fn1(value);
                        });
                    }
                };
            }()
        },

        flashCurrentDriver: '',
        flashDrivers: {},

        /*
            'silent'
            'listOfErrors'
            'dialog'
            'dialog.alert'
            'dialog.sweetAlert'
            'flash'
         */
        validationCurrentDriver: 'dialog',
        validationDrivers: {
            silent: {
                onError: function onError() {},
                clearError: function clearError() {}
            },
            listOfErrors: function () {
                var validationErrors = [];

                return {
                    onError: function onError(vo) {
                        //add new errors
                        for (var i = 0, l = vo.pattern.invalidRules.length; i < l; i++) {
                            validationErrors.push({
                                msg: vo.pattern.invalidRules[i].message,
                                input: vo.input
                            });
                        }var ul = $(config.listOfErrorsSelector);
                        if (ul.length) {
                            var str = '';
                            for (var _i = 0, _l = validationErrors.length; _i < _l; _i++) {
                                str += '<li>' + validationErrors[_i].msg + '</li>';
                            }ul.html(str);
                        }
                    },
                    clearError: function clearError(inputJq) {
                        for (var i = validationErrors.length - 1; i >= 0; i--) {
                            if (validationErrors[i].input.jquery[0] === inputJq[0]) validationErrors.splice(i, 1);
                        }var ul = $(config.listOfErrorsSelector);
                        if (ul.length) {
                            var str = '',
                                l = validationErrors.length;
                            for (var _i2 = 0; _i2 < l; _i2++) {
                                str += '<li>' + validationErrors[_i2].msg + '</li>';
                            }ul.html(str);
                        }
                    },
                    getErrorList: function getErrorList() {
                        var result = [];
                        for (var i = 0, l = validationErrors.length; i < l; i++) {
                            var newItem = validationErrors[i];

                            var index = -1;
                            for (var _j = 0, _m = result.length; _j < _m; _j++) {
                                if (result[_j].input.jquery[0] === newItem.input.jquery[0]) {
                                    index = _j;
                                    break;
                                }
                            }if (index === -1)
                                //not exist
                                result.push({
                                    input: newItem.input,
                                    errors: [newItem.msg]
                                });else
                                //exist => add message to error list
                                result[index].errors.push(newItem.msg);
                        }
                        return result;
                    }
                };
            }()
        },
        reValidationDelay: 500,
        listOfErrorsSelector: '#spacer-listOfErrors',

        validationCustomRules: {
            'min_input': {
                /**
                 *  Min than input value. For integer, float and timeline patterns only
                 */
                validate: function validate(vo, index) {
                    //return true or false

                    var valueToValidate = vo.input.valueToValidate,
                        rule = vo.pattern.rules[index],
                        minInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]'),
                        format = vo.pattern.timelineFormat.params[0];

                    if (minInput.length) {

                        var minInputValue = minInput.val();

                        if (minInputValue) {
                            var isOut = rule.params[1] === 'o';
                            switch (vo.pattern.type) {
                                case PatternTypes.integer:
                                case PatternTypes.float:
                                    {
                                        var parsedValue = parseFloat(valueToValidate);
                                        minInputValue = parseFloat(minInputValue);

                                        if (isNaN(minInputValue)) {
                                            return false;
                                        }
                                        if (isOut) {
                                            //isOut
                                            if (parsedValue <= minInputValue) return false;
                                        } else {
                                            //in
                                            if (parsedValue < minInputValue) return false;
                                        }
                                        break;
                                    }
                                case PatternTypes.timeline:
                                    if (isOut) {
                                        //isOut
                                        if (!spa.validation.isTimelineAfter(valueToValidate, minInputValue, format)) return false;
                                    } else {
                                        //in
                                        if (!spa.validation.isTimelineAfterOrEqual(valueToValidate, minInputValue, format)) return false;
                                    }
                                    break;
                            }
                        }
                    }
                    return true;
                },
                getErrorMessage: function getErrorMessage(vo, index) {
                    //return string

                    var rule = vo.pattern.invalidRules[index];

                    var ruleName = 'min' + (rule.params[1] === 'o' ? '_o' : '_i');

                    /**
                     * get p1 from:
                     *  1. rule 3rd parameter
                     *  2. related input friendly name
                     *  3. related input value
                     */

                    //rule 3rd parameter
                    var p1 = rule.params[2];

                    var relatedInput = void 0;

                    //related input friendly name
                    if (!p1) {
                        relatedInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]');
                        p1 = relatedInput.attr(Tags.friendlyName);
                    }

                    //related input value
                    if (!p1) {
                        //no from-min tag is provided => get the value which is existed for sure
                        p1 = relatedInput.val();
                    }

                    return spa.resource.get(vo.pattern.name + '.' + ruleName, {
                        fn: vo.input.friendlyName,
                        p1: p1
                    });
                }
            },
            'max_input': {
                /**
                 *  Max than input value. For integer, float and timeline patterns only
                 */
                validate: function validate(vo, index) {
                    //return true or false

                    var valueToValidate = vo.input.valueToValidate,
                        rule = vo.pattern.rules[index],
                        maxInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]'),
                        format = vo.pattern.timelineFormat.params[0];

                    if (maxInput.length) {

                        var maxInputValue = maxInput.val();

                        if (maxInputValue) {
                            var isOut = rule.params[1] === 'o';
                            switch (vo.pattern.type) {
                                case PatternTypes.integer:
                                case PatternTypes.float:
                                    {
                                        var parsedValue = parseFloat(valueToValidate);
                                        maxInputValue = parseFloat(maxInputValue);

                                        if (isNaN(maxInputValue)) {
                                            return false;
                                        }
                                        if (isOut) {
                                            //isOut
                                            if (parsedValue >= maxInputValue) return false;
                                        } else {
                                            //in
                                            if (parsedValue > maxInputValue) return false;
                                        }
                                        break;
                                    }
                                case PatternTypes.timeline:
                                    if (isOut) {
                                        //isOut
                                        if (!spa.validation.isTimelineBefore(valueToValidate, maxInputValue, format)) return false;
                                    } else {
                                        //in
                                        if (!spa.validation.isTimelineBeforeOrEqual(valueToValidate, maxInputValue, format)) return false;
                                    }
                                    break;
                            }
                        }
                    }
                    return true;
                },
                getErrorMessage: function getErrorMessage(vo, index) {
                    //return string

                    var rule = vo.pattern.invalidRules[index];

                    var ruleName = 'max' + (rule.params[1] === 'o' ? '_o' : '_i');

                    /**
                     * get p1 from:
                     *  1. rule 3rd parameter
                     *  2. related input friendly name
                     *  3. related input value
                     */

                    //rule 3rd parameter
                    var p1 = rule.params[2];

                    var relatedInput = void 0;

                    //related input friendly name
                    if (!p1) {
                        relatedInput = vo.input.jquery.closest('form').find('input[name="' + rule.params[0] + '"]');
                        p1 = relatedInput.attr(Tags.friendlyName);
                    }

                    //related input value
                    if (!p1) {
                        //no from-min tag is provided => get the value which is existed for sure
                        p1 = relatedInput.val();
                    }

                    return spa.resource.get(vo.pattern.name + '.' + ruleName, {
                        fn: vo.input.friendlyName,
                        p1: p1
                    });
                }
            }
        },
        validationPre: undefined,
        validationIsLite: false,

        //momentLocales without en: because en is loaded by default
        momentLocales: {
            ar: {
                months: months,
                monthsShort: monthsShort,
                weekdays: days,
                weekdaysShort: daysShort,
                weekdaysMin: daysMin,
                weekdaysParseExact: true,
                longDateFormat: {
                    LT: 'HH:mm',
                    LTS: 'HH:mm:ss',
                    L: 'DD/MM/YYYY',
                    LL: 'D MMMM YYYY',
                    LLL: 'D MMMM YYYY HH:mm',
                    LLLL: 'dddd D MMMM YYYY HH:mm'
                },
                calendar: {
                    sameDay: '[اليوم على الساعة] LT',
                    nextDay: '[غدا على الساعة] LT',
                    nextWeek: 'dddd [على الساعة] LT',
                    lastDay: '[أمس على الساعة] LT',
                    lastWeek: 'dddd [على الساعة] LT',
                    sameElse: 'L'
                },
                relativeTime: {
                    future: 'في %s',
                    past: 'منذ %s',
                    s: 'ثوان',
                    ss: '%d ثانية',
                    m: 'دقيقة',
                    mm: '%d دقائق',
                    h: 'ساعة',
                    hh: '%d ساعات',
                    d: 'يوم',
                    dd: '%d أيام',
                    M: 'شهر',
                    MM: '%d أشهر',
                    y: 'سنة',
                    yy: '%d سنوات'
                },
                week: {
                    dow: 0, // Sunday is the first day of the week.
                    doy: 12 // The week that contains Jan 1st is the first week of the year.
                }
            }
        },
        datepickerOptions: {
            ar: {
                closeText: "إغلاق",
                prevText: "&#x3C;السابق",
                nextText: "التالي&#x3E;",
                currentText: "اليوم",
                monthNames: months,
                monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                dayNames: days,
                dayNamesShort: daysShort,
                dayNamesMin: daysMin,
                weekHeader: "أسبوع",
                firstDay: 1,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: '',

                dateFormat: 'dd-mm-yy',
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true
            },
            en: {
                dateFormat: 'dd-mm-yy',
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true
            }
        },
        datatableOptions: {
            ar: {
                paging: false,
                info: false,
                searching: false,
                order: [],
                language: {
                    decimal: "",
                    emptyTable: "لا توجد بيانات",
                    info: "عرض _START_ إلى _END_. الاجمالي _TOTAL_ عنصر",
                    infoEmpty: "لا توجد بيانات",
                    infoFiltered: "(filtered from _MAX_ total entries)",
                    infoPostFix: "",
                    thousands: ",",
                    lengthMenu: "عدد المداخل في كل صفحة  _MENU_",
                    loadingRecords: "جاري التحميل...",
                    processing: "جاري المعالجة...",
                    search: "فلترة: ",
                    zeroRecords: "لا توجد بيانات مطابقة",
                    paginate: {
                        first: "البداية",
                        last: "النهاية",
                        next: "التالي",
                        previous: "السابق"
                    },
                    aria: {
                        sortAscending: ": activate to sort column ascending",
                        sortDescending: ": activate to sort column descending"
                    }
                }
            },
            en: {
                paging: false,
                info: false,
                searching: false,
                order: []
            }
        },

        /*
         * options:
         *      1 => cookie
         *      2 => segment
         *      3 => query
         */
        localeMethod: 2,
        localeQueryKey: 'lang',
        defaultLocale: 'en',
        btnLoadingCurrentDriver: 'spin',
        btnLoadingDrivers: {
            spin: function () {
                function set(btn) {
                    btn = sis(btn);
                    if (btn.length) {
                        btn.data(Tags.loadingHtml, btn.html());
                        //fix the width
                        btn.css('min-width', btn.css('width'));
                        btn.html(spa.resource.get('icon.loading'));
                        spa.dom.setDisable(btn, true);
                        return btn;
                    }
                }

                function unset(btn, html) {
                    btn = sis(btn);
                    if (btn.length) {
                        btn.html(html ? html : btn.data(Tags.loadingHtml));
                        spa.dom.setDisable(btn, false);
                        btn.css('min-width', 'auto');
                        return btn;
                    }
                }

                return {
                    set: set,
                    unset: unset
                };
            }()
        }
    },
        resourcesBank = {
        'btn.ok': {
            en: 'Ok',
            ar: 'موافق'
        },
        'btn.cancel': {
            en: 'Cancel',
            ar: 'الغاء'
        },
        'btn.continue': {
            en: 'Continue',
            ar: 'المتابعة'
        },
        'btn.yes': {
            en: 'Yes',
            ar: 'نعم'
        },
        'btn.no': {
            en: 'No',
            ar: 'لا'
        },

        'ajax.errorTitle': {
            en: 'Request Error',
            ar: 'فشل الطلب'
        },
        'ajax.errorBody': {
            en: 'The request has been failed with error code: ',
            ar: 'حدث خطأ في الطلب. رقم الخطأ: '
        },

        //errors
        'validation.errorTitle': {
            en: 'Validation Error',
            ar: 'خطأ في البيانات'
        },
        'validation.defaultFriendlyName': {
            en: 'value',
            ar: 'المدخل'
        },

        //delete
        'delete.title': {
            en: 'Delete Item',
            ar: 'حذف العنصر'
        },
        'delete.confirm': {
            en: 'Item to be deleted. Continue?',
            ar: 'سيتم حذف العنصر. المتابعة؟'
        },

        //integer
        'integer.integer': {
            en: 'The :fn must be an integer number',
            ar: 'يجب أن يكون :fn رقم صحيح'
        },
        'integer.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'integer.positive': {
            en: 'The :fn must be positive number',
            ar: 'يجب أن يكون :fn رقم موجب'
        },
        'integer.negative': {
            en: 'The :fn must be negative number',
            ar: 'يجب أن يكون :fn رقم سالب'
        },
        'integer.min_i': {
            en: 'The :fn must be greater than or equal :p1',
            ar: ' يجب أن يكون :fn :p1 على الأقل'
        },
        'integer.min_o': {
            en: 'The :fn must be greater than :p1',
            ar: ' يجب أن يكون :fn أكبر من :p1'
        },
        'integer.max_i': {
            en: 'The :fn must be less than or equal :p1',
            ar: 'يجب أن يكون :fn :p1 على الأكثر'
        },
        'integer.max_o': {
            en: 'The :fn must be less than :p1',
            ar: 'يجب أن يكون :fn أقل من :p1'
        },
        'integer.range': {
            en: 'The :fn must be between :p1 and :p2',
            ar: 'يجب أن يكون :fn بين :p1 و :p2'
        },
        'integer.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },
        'integer.not': {
            en: 'The :fn is invalid',
            ar: ':fn غير صالح'
        },

        'float.float': {
            en: 'The :fn must be a float number',
            ar: 'يجب أن يكون :fn رقم صحيح'
        },
        'float.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'float.positive': {
            en: 'The :fn must be positive number',
            ar: 'يجب أن يكون :fn رقم صحيح موجب'
        },
        'float.negative': {
            en: 'The :fn must be negative number',
            ar: 'يجب أن يكون :fn رقم صحيح سالب'
        },
        'float.min_i': {
            en: 'The :fn must be greater than or equal :p1',
            ar: ' يجب أن يكون :fn :p1 على الأقل'
        },
        'float.min_o': {
            en: 'The :fn must be greater than :p1',
            ar: ' يجب أن يكون :fn أكبر من :p1'
        },
        'float.max_i': {
            en: 'The :fn must be less than or equal :p1',
            ar: 'يجب أن يكون :fn :p1 على الأكثر'
        },
        'float.max_o': {
            en: 'The :fn must be less than :p1',
            ar: 'يجب أن يكون :fn أقل من :p1'
        },
        'float.range': {
            en: 'The :fn must be between :p1 and :p2',
            ar: 'يجب أن يكون :fn بين :p1 و :p2'
        },
        'float.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },
        'float.not': {
            en: 'The :fn is invalid',
            ar: ':fn غير صالح'
        },
        'string.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'string.of': {
            en: 'The :fn contains unacceptable character(s)',
            ar: ':fn يحوي رموز غير صالحة'
        },
        'string.not_of': {
            en: 'The :fn contains unacceptable character(s)',
            ar: ':fn يحوي رموز غير صالحة'
        },
        'string.min_i': {
            en: 'The :fn must be :p1 character(s) at least',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل'
        },
        'string.min_o': {
            en: 'The :fn must be more than :p1 character(s)',
            ar: 'يجب أن يكون :fn أكثر من :p1 محرف'
        },
        'string.max_i': {
            en: 'The :fn may not contain more than :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر'
        },
        'string.max_o': {
            en: 'The :fn must be less than :p1 character(s)',
            ar: 'يجب أن يكون :fn أقل من :p1 محرف'
        },
        'string.range': {
            en: 'The :fn must be between :p1 and :p2 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف'
        },
        'string.len': {
            en: 'The :fn must be :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف'
        },
        'string.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },
        'string.not': {
            en: 'The :fn is invalid',
            ar: ':fn غير صالح'
        },

        'check.required': {
            en: 'Please choose :fn',
            ar: 'يرجى اختيار :fn'
        },

        'timeline.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'timeline.format': {
            en: 'The :fn is not in the correct format: :p1',
            ar: ':fn ليس بالتنسيق المطلوب: :p1'
        },
        'timeline.min_i': {
            en: 'The :fn must be a date after or equal :p1',
            ar: ' يجب أن يكون :fn أكبر من أو يساوي :p1'
        },
        'timeline.min_o': {
            en: 'The :fn must be a date after :p1',
            ar: ' يجب أن يكون :fn أكبر من :p1'
        },
        'timeline.max_i': {
            en: 'The :fn must be a date before or equal :p1',
            ar: ' يجب أن يكون :fn أصغر من أو يساوي :p1'
        },
        'timeline.max_o': {
            en: 'The :fn must be a date before :p1',
            ar: ' يجب أن يكون :fn أصغر من :p1'
        },
        'timeline.range': {
            en: 'The :fn must be between :p1 and :p2',
            ar: 'يجب أن يكون :fn بين :p1 و :p2'
        },
        'timeline.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },

        'email.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'email.email': {
            en: 'The :fn must be a valid email address',
            ar: ':fn غير صالح'
        },
        'email.min_i': {
            en: 'The :fn must be :p1 character(s) at least',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل'
        },
        'email.min_o': {
            en: 'The :fn must be more than :p1 character(s)',
            ar: 'يجب أن يكون :fn أكثر من :p1 محرف'
        },
        'email.max_i': {
            en: 'The :fn may not contain more than :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر'
        },
        'email.max_o': {
            en: 'The :fn must be less than :p1 character(s)',
            ar: 'يجب أن يكون :fn أقل من :p1 محرف'
        },
        'email.range': {
            en: 'The :fn must be between :p1 and :p2 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف'
        },
        'email.in_domain': {
            en: 'The :fn must be in these domains: :p1',
            ar: 'يجب أن يكون :fn ضمن النطاقات التالية: :p1'
        },
        'email.not_in_domain': {
            en: 'The :fn may not be in these domains: :p1',
            ar: 'يجب أن يكون :fn خارج النطاقات التالية: :p1'
        },
        'email.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },

        'url.url': {
            en: 'The :fn must be a valid url',
            ar: ':fn غير صالح'
        },
        'url.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'url.min_i': {
            en: 'The :fn must be :p1 character(s) at least',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل'
        },
        'url.min_o': {
            en: 'The :fn must be more than :p1 character(s)',
            ar: 'يجب أن يكون :fn أكثر من :p1 محرف'
        },
        'url.max_i': {
            en: 'The :fn may not contain more than :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر'
        },
        'url.max_o': {
            en: 'The :fn must be less than :p1 character(s)',
            ar: 'يجب أن يكون :fn أقل من :p1 محرف'
        },
        'url.range': {
            en: 'The :fn must be between :p1 and :p2 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف'
        },
        'url.in_domain': {
            en: 'The :fn must be in these domains: :p1',
            ar: 'يجب أن يكون :fn ضمن النطاقات التالية: :p1'
        },
        'url.not_in_domain': {
            en: 'The :fn may not be in these domains: :p1',
            ar: 'يجب أن يكون :fn خارج النطاقات التالية: :p1'
        },
        'url.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },

        'in.items': {
            en: 'The :fn is invalid',
            ar: ':fn غير صالح'
        },
        'in.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },

        'file.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'file.min_i': {
            en: 'The :fn must be at least :p1MB in total',
            ar: 'يجب أن يكون اجمالي حجم الملفات في :fn :p1MB على الأقل'
        },
        'file.min_o': {
            en: 'The :fn must be larger than :p1MB in total',
            ar: 'يجب أن يكون اجمالي حجم الملفات في :fn أكبر من :p1MB'
        },
        'file.max_i': {
            en: 'The :fn may not be greater than :p1MB in total',
            ar: 'يجب أن يكون اجمالي حجم الملفات في :fn :p1MB على الأكثر'
        },
        'file.max_o': {
            en: 'The :fn may not be greater than :p1MB in total',
            ar: 'يجب أن يكون اجمالي حجم الملفات في :fn أقل من :p1MB'
        },
        'file.range': {
            en: 'The :fn must be between :p1MB and :p2MB in total',
            ar: 'يجب أن يكون اجمالي حجم الملفات في :fn من :p1MB إلى :p2MB'
        },
        'file.s_min_i': {
            en: 'Each file in :fn must be at least :p1MB in total',
            ar: 'يجب أن يكون حجم الملف الواحد في :fn :p1MB على الأقل'
        },
        'file.s_min_o': {
            en: 'Each file in :fn must be larger than :p1MB in total',
            ar: 'يجب أن يكون حجم الملف الواحد في :fn أكبر من :p1MB'
        },
        'file.s_max_i': {
            en: 'Each file in :fn may not be greater than :p1MB in total',
            ar: 'يجب أن يكون حجم الملف الواحد في :fn :p1MB على الأكثر'
        },
        'file.s_max_o': {
            en: 'The :fn may not be greater than :p1MB in total',
            ar: 'يجب أن يكون حجم الملف الواحد في :fn أقل من :p1MB'
        },
        'file.s_range': {
            en: 'Each file in :fn must be between :p1MB and :p2MB',
            ar: 'يجب أن يكون حجم الملف الواحد في :fn من :p1MB إلى :p2MB'
        },
        'file.ext': {
            en: 'The :fn file(s) must be one of these formats: :p1',
            ar: 'يجب أن تكون كل الملفات في :fn بأحد الصيغ التالية: :p1'
        },
        'file.len': {
            en: 'The :fn may have :p1 file(s)',
            ar: 'يجب أن يحوي :fn على :p1 ملف (ملفات)'
        },

        'regex.required': {
            en: 'The :fn is required',
            ar: 'لا يجوز ترك :fn فارغ'
        },
        'regex.pattern': {
            en: 'The :fn is not valid',
            ar: ':fn غير صالح'
        },
        'regex.min_i': {
            en: 'The :fn must be :p1 character(s) at least',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل'
        },
        'regex.min_o': {
            en: 'The :fn must be more than :p1 character(s)',
            ar: 'يجب أن يكون :fn أكثر من :p1 محرف'
        },
        'regex.max_i': {
            en: 'The :fn may not contain more than :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر'
        },
        'regex.max_o': {
            en: 'The :fn must be less than :p1 character(s)',
            ar: 'يجب أن يكون :fn أقل من :p1 محرف'
        },
        'regex.range': {
            en: 'The :fn must be between :p1 and :p2 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف'
        },
        'regex.len': {
            en: 'The :fn must be :p1 character(s)',
            ar: 'يجب أن يكون :fn بطول :p1 محرف'
        },
        'regex.confirmed': {
            en: 'The :fn confirmation does not match',
            ar: 'تأكيد :fn غير مطابق'
        },

        //icons
        'icon.loading': {
            def: '<i class="fa fa-spinner fa-spin fa-fw"></i>'
        },
        'icon.success': {
            def: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-check fa-stack-1x"></i></span>'
        },
        'icon.danger': {
            def: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-times fa-stack-1x"></i></span>'
        },
        'icon.warning': {
            def: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-exclamation fa-stack-1x"></i></span>'
        },
        'icon.info': {
            def: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-info fa-stack-1x"></i></span>'
        },
        'icon.question': {
            def: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>'
        },

        //exceptions
        'ex.usst': {
            def: 'Spacer Error: Unsupported string type: :p'
        },
        'ex.pmr': {
            def: 'Spacer Error: The validation pattern :p misses a required rule: :r'
        },
        'ex.usp': {
            def: 'Spacer Error: Unsupported pattern: :p'
        },
        'ex.se': {
            def: 'Spacer Error: Syntax error: :p'
        },
        'ex.inf': {
            def: 'Spacer Error: Invalid parameter for :p.:r rule: input with name :n not found'
        },
        'ex.ipc': {
            def: 'Spacer Error: The validation rule :p.:r misses some parameters'
        },
        'ex.ipt': {
            def: 'Spacer Error: Invalid parameter for :p.:r rule: :a'
        },
        'ex.pfnf': {
            def: 'Spacer Error: pre function not found: :p'
        },
        'ex.rnf': {
            def: 'Spacer Error: No such a rule: :p.:r'
        },
        'ex.mnf': {
            def: 'Spacer Error: Error message not found for :p.:r'
        },
        'ex.ddnf': {
            def: 'Spacer Error: Dialog driver :p or one of its functions not found'
        },
        'ex.vdnf': {
            def: 'Spacer Error: Validation driver :p or one of its functions not found'
        },
        'ex.fdnf': {
            def: 'Spacer Error: Flash driver :p or one of its functions not found'
        },
        'ex.bldnf': {
            def: 'Spacer Error: Button loading driver :p or one of its functions not found'
        },
        'ex.fnf': {
            def: 'Spacer Error: Form not found'
        },
        //timeline
        'year': {
            en: 'year',
            ar: 'سنة'
        },
        'month': {
            en: 'month',
            ar: 'شهر'
        },
        'day': {
            en: 'day',
            ar: 'يوم'
        },
        'hour': {
            en: 'hour',
            ar: 'ساعة'
        },
        'minute': {
            en: 'minute',
            ar: 'دقيقة'
        },

        //general labels
        'and': {
            en: 'and',
            ar: 'و'
        }
    };

    //basic functions
    function sis(s) {
        return s instanceof $ ? s : $(s);
    }

    function trim(v, force) {
        if (config.trimValues || force) return v ? v.trim() : '';

        return v ? v : '';
    }

    /*
     * Namespace aids
     */

    //shared
    function addLaravelToken() {
        var token = $('meta[name="csrf-token"]');
        if (token.length) {
            if (config.ajaxHeader) config.ajaxHeader['X-CSRF-TOKEN'] = token.attr('content');else config.ajaxHeader = { 'X-CSRF-TOKEN': token.attr('content') };
        }
    }

    var driversUnit = function () {

        function validateAndGetDialogDriver(driver) {

            var driverObj = config.dialogDrivers[driver];

            if (config.debug && !(driverObj && driverObj.message && driverObj.confirm && driverObj.prompt)) throw spa.resource.get('ex.ddnf', { p: driver });

            return driverObj;
        }

        function validateAndGetValidationDriver(driver) {

            var driverObj = config.validationDrivers[driver];

            if (config.debug && !(driverObj && driverObj.onError && driverObj.clearError)) throw spa.resource.get('ex.vdnf', { p: driver });

            return driverObj;
        }

        function validateAndGetFlashDriver(driver) {

            var driverObj = config.flashDrivers[driver];

            if (config.debug && !(driverObj && driverObj.flash)) throw spa.resource.get('ex.fdnf', { p: driver });

            return driverObj;
        }

        function validateAndGetBtnLoadingDriver(driver) {

            var driverObj = config.btnLoadingDrivers[driver];

            if (config.debug && !(driverObj && driverObj.set && driverObj.unset)) throw spa.resource.get('ex.bldnf', { p: driver });

            return driverObj;
        }

        function setDialogCD(d) {
            driversUnit.dialog = validateAndGetDialogDriver(d);
            config.dialogCurrentDriver = d;
            if (driversUnit.validationIsDialog) {
                setValidationCD(config.validationCurrentDriver);
            }
        }

        function setFlashCD(d) {
            driversUnit.flash = validateAndGetFlashDriver(d);
            config.flashCurrentDriver = d;
            if (driversUnit.validationIsFlash) {
                setValidationCD(config.validationCurrentDriver);
            }
        }

        function setBtnLoadingCD(d) {
            driversUnit.btnLoading = validateAndGetBtnLoadingDriver(d);
            config.btnLoadingCurrentDriver = d;
        }

        function setValidationCD(d) {
            var driver = d.split('.');

            driversUnit.validationIsDialog = driver[0] === 'dialog';
            driversUnit.validationIsFlash = driversUnit.validationIsDialog ? false : driver[0] === 'flash';

            driversUnit.validationIsDialogOrFlashDriver = driversUnit.validationIsDialog || driversUnit.validationIsFlash;

            if (driversUnit.validationIsDialogOrFlashDriver) {
                if (driver.length === 1) {
                    //here: single word: dialog or flash
                    //drivers dialog and flash are already validated
                    driversUnit.validation = driversUnit.validationIsDialog ? config.dialogDrivers[config.dialogCurrentDriver] : config.flashDrivers[config.flashCurrentDriver];
                } else {
                    //driver.length is larger than 1 like dialog.driverName => let's take the second word (the driver name)
                    if (driversUnit.validationIsDialog) {
                        driversUnit.validation = validateAndGetDialogDriver(driver[1]);
                    } else {
                        driversUnit.validation = validateAndGetFlashDriver(driver[1]);
                    }
                }
            } else {
                driversUnit.validation = validateAndGetValidationDriver(driver[0]);
            }
            config.validationCurrentDriver = d;
        }

        return {
            setDialogCD: setDialogCD,
            setFlashCD: setFlashCD,
            setValidationCD: setValidationCD,
            setBtnLoadingCD: setBtnLoadingCD,
            dialog: undefined,
            flash: undefined,
            validation: undefined,
            btnLoading: undefined,
            validationIsDialog: false,
            validationIsFlash: false,
            validationIsDialogOrFlashDriver: false
        };
    }();

    //init driversUnit
    driversUnit.setDialogCD(config.dialogCurrentDriver);
    //driversUnit.setFlashCD(config.flashCurrentDriver);
    driversUnit.setValidationCD(config.validationCurrentDriver);
    driversUnit.setBtnLoadingCD(config.btnLoadingCurrentDriver);

    //form
    function getFormInputs(s) {
        return s.find('input, textarea, select').not(':input[type=button], :input[type=submit], :input[type=reset]');
    }

    //init
    function updateMomentLocale() {
        if (window.moment) {
            var currentLocale = config.locale;
            if (currentLocale === 'en') {
                //en is the original locale => already defined by default in moment
                moment.locale('en');
            } else {
                //locale is not en
                //try to set the locale: moment.locale returns the locale used. This is useful because Moment won't change locales if it doesn't know the one you specify.
                if (moment.locale(currentLocale) !== currentLocale) {
                    //config.locale is not loaded into moment => we should load it => it will be set as default automatically
                    var options = config.momentLocales[config.locale];
                    if (options) moment.locale(currentLocale, config.momentLocales[config.locale]);
                }
            }
        }
    }

    //base

    function newInput(jqueryObj) {
        return {
            jquery: jqueryObj,
            name: jqueryObj.attr('name'),

            friendlyName: spa.dom.getFriendlyName(jqueryObj),

            //evaluated on every validation
            originalValue: '',
            valueToValidate: ''
        };
    }

    function newPattern(patternStr) {
        return {
            string: patternStr,
            type: -1,
            name: undefined,
            rules: [],
            isLite: config.validationIsLite,
            //Rule
            timelineFormat: undefined,
            //Rule
            required: undefined,
            pre: [],
            invalidRules: []
        };
    }

    function newRule(name, params) {
        return {
            params: params,
            type: RuleTypes[name],
            name: name,
            message: undefined
        };
    }

    function newValidationEntry(jqueryObj, patternStr) {
        return {
            input: newInput(jqueryObj),
            confirmInput: undefined,
            pattern: newPattern(patternStr)
        };
    }

    //error unit
    var errorUnit = function () {

        function getErrorMessage(input, patternName, ruleKey) {
            return input.data('v-' + patternName + '-' + ruleKey + '-' + config.locale) || input.data('v-' + patternName + '-' + ruleKey) || spa.resource.get(patternName + '.' + ruleKey);
        }

        function populateErrorMessages(vo) {
            var rule = void 0,
                msg = void 0,
                replaceParam = void 0;
            for (var i = 0, l = vo.pattern.invalidRules.length; i < l; i++) {
                rule = vo.pattern.invalidRules[i];
                replaceParam = true;

                switch (rule.type) {
                    case RuleTypes.min:
                    case RuleTypes.max:
                        {
                            var tempName = rule.name + (validatorBase.isOut(rule) ? '_o' : '_i');
                            msg = getErrorMessage(vo.input.jquery, vo.pattern.name, tempName);
                            msg = spa.resource.replace(msg, { fn: vo.input.friendlyName });
                            break;
                        }
                    case RuleTypes.in_domain:
                    case RuleTypes.not_in_domain:
                    case RuleTypes.ext:
                        {
                            var p1 = '',
                                j = 0,
                                m = rule.params.length;
                            for (; j < m - 1; j++) {
                                p1 += rule.params[j] + ', ';
                            }p1 += rule.params[j];

                            msg = getErrorMessage(vo.input.jquery, vo.pattern.name, rule.name);
                            msg = spa.resource.replace(msg, {
                                fn: vo.input.friendlyName,
                                p1: p1
                            });

                            replaceParam = false;
                            break;
                        }
                    default:
                        msg = getErrorMessage(vo.input.jquery, vo.pattern.name, rule.name);
                        if (msg) msg = spa.resource.replace(msg, { fn: vo.input.friendlyName });
                }
                if (msg) {
                    if (replaceParam) {
                        msg = msg.replace(/:p[1-9]/g, function (matched) {
                            return rule.params[parseInt(matched[2]) - 1];
                        });
                    }
                } else msg = customMsg(vo, i);
                rule.message = msg;
            }
        }

        function onErrorProxy(vo) {
            if (driversUnit.validationIsDialogOrFlashDriver) {

                var title = spa.resource.get('validation.errorTitle');
                var msg = vo.pattern.invalidRules[0].message;

                if (driversUnit.validationIsDialog) driversUnit.validation.message(title, msg, 'danger', 'danger');else driversUnit.validation.flash(title, msg, 'danger');

                vo.input.jquery.focus();
            } else {
                driversUnit.validation.onError(vo);
            }
        }

        function clearErrorProxy(input) {
            if (!driversUnit.validationIsDialogOrFlashDriver) {
                driversUnit.validation.clearError(input);
            }
        }

        function customMsg(v, index) {
            var rule = v.pattern.invalidRules[index];
            if (config.debug && !(config.validationCustomRules && config.validationCustomRules[rule.name] && spa.validation.isFunction(config.validationCustomRules[rule.name].getErrorMessage))) throw spa.resource.get('ex.mnf', { p: v.pattern.name, r: rule.name });
            return config.validationCustomRules[rule.name].getErrorMessage(v, index);
        }

        return {
            populateErrorMessages: populateErrorMessages,
            clearErrorProxy: clearErrorProxy,
            onErrorProxy: onErrorProxy
        };
    }();

    //parsing unit
    var parsingUnit = function () {

        /**
         *  Return Pattern object from pattern string
         */
        function parsePattern(entry) {
            var patternStr = entry.pattern.string,

            //divide pattern string into: name and rules (rules as string without [])
            patternNameAndRules = patternStr.match(/^\s*([A-Za-z]+)\s*(?:\[\s*(.*)]\s*)?$/);

            if (!patternNameAndRules) throw spa.resource.get('ex.se', { p: patternStr });

            //trimmed
            entry.pattern.name = patternNameAndRules[1].toLowerCase();
            entry.pattern.type = PatternTypes[entry.pattern.name];

            //rules (rules as string without [])
            var rulesStr = patternNameAndRules[2];

            if (!rulesStr) return;

            //extract ~~ expressions
            var tildeExpressions = rulesStr.match(/~[^~.]+~/g);
            if (tildeExpressions) for (var i = 0, l = tildeExpressions.length; i < l; i++) {
                rulesStr = rulesStr.replace(tildeExpressions[i], 'r');
            }var allRules = rulesStr.split('|');

            for (var _i3 = 0, _l2 = allRules.length; _i3 < _l2; _i3++) {

                //divide rule into: name and params
                var rule = allRules[_i3].match(/^\s*([a-zA-Z_]+)\s*(?::\s*(.+))?$/);
                if (!rule) throw spa.resource.get('ex.rnf', {
                    p: entry.pattern.name,
                    r: allRules[_i3]
                });
                var ruleName = rule[1],
                    ruleParamStr = void 0;

                if (ruleName === 'pattern' || ruleName === 'format') {
                    //get param from tilda expressions
                    if (tildeExpressions && tildeExpressions.length) ruleParamStr = tildeExpressions.shift().match(/~([^~.]+)~/)[1];else throw spa.resource.get('ex.ipc', { p: entry.pattern.name, r: ruleName });
                } else ruleParamStr = rule[2];

                addRule(entry, newRule(ruleName.toLowerCase(), createParams(ruleParamStr)));
            }
        }

        function addRule(v, rule) {

            switch (rule.type) {
                case RuleTypes.lite:
                    v.pattern.isLite = true;
                    break;
                case RuleTypes.pre:
                    v.pattern.pre = rule.params;
                    break;
                case RuleTypes.required:
                    v.pattern.required = rule;
                    break;
                case RuleTypes.format:
                    v.pattern.timelineFormat = rule;
                    break;
                case RuleTypes.confirmed:
                    getConfirmInput(v, rule.params);
                    v.pattern.rules.push(rule);
                    break;
                default:
                    v.pattern.rules.push(rule);
            }
        }

        function createParams(paramStr) {

            var paramList = [];

            if (!paramStr) return paramList;

            var paramListStr = paramStr.split(',');

            for (var i = 0, l = paramListStr.length; i < l; i++) {

                var param = paramListStr[i].trim();

                if (param === '') throw spa.resource.get('ex.se', { p: paramStr });else paramList.push(param);
            }

            return paramList;
        }

        function getConfirmInput(vo, params) {

            var confirmInputName = void 0;
            if (params.length) confirmInputName = params[0];else confirmInputName = vo.input.name + '_confirmation';

            var confirmInput = vo.input.jquery.closest('form').find('input[name="' + confirmInputName + '"]');

            if (confirmInput.length) {
                vo.confirmInput = newInput(confirmInput);

                //add reference to confirm input to input: used in onError to remove error
                vo.input.jquery.data(Tags.confirmInput, confirmInput);
            }
        }

        function cacheValidationObject(v) {
            v.input.jquery.data(Tags.cachedValidationEntry, v);
        }

        function getCacheValidationObject(input) {
            return input.data(Tags.cachedValidationEntry);
        }

        function getInputValue(v) {
            //input
            if (v.pattern.type === PatternTypes.file) v.input.originalValue = v.input.jquery[0].files;else if (v.pattern.type === PatternTypes.check) {
                if (v.input.jquery.is(':checked')) v.input.originalValue = trim(v.input.jquery.val()) || 'true';else v.input.originalValue = '';
            } else {
                //value is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
                v.input.originalValue = trim(v.input.jquery.val());
                //confirm input
                if (v.confirmInput)
                    //value is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
                    v.confirmInput.originalValue = trim(v.confirmInput.jquery.val());
            }
            //v.input.valueToValidate is to store value after applying pre rule
            v.input.valueToValidate = v.input.originalValue;

            if (v.confirmInput)
                //v.input.valueToValidate is to store value after applying pre rule
                v.confirmInput.valueToValidate = v.confirmInput.originalValue;
        }

        function parse(input) {
            var vo = getCacheValidationObject(input);

            if (!vo) {
                //pattern is one of 3: has a value, '', undefined. ('', undefined evaluated to false in if statement)
                var patternStr = input.attr(Tags.validationTag);

                if (patternStr) patternStr = patternStr.trim();

                if (!patternStr) return undefined;

                vo = newValidationEntry(input, patternStr);

                parsePattern(vo);
            }
            getInputValue(vo);
            cacheValidationObject(vo);
            return vo;
        }

        return {
            parse: parse
        };
    }();

    //validation unit
    var validationUnit = function () {

        function attachEvents(vo) {
            //ea => event attached
            if (!vo.input.jquery.data(Tags.isEventAttached)) {
                //Attach events
                if (!driversUnit.validationIsDialogOrFlashDriver) {
                    //need validation (n): is a signal for not firing change event after input event
                    vo.input.jquery.data(Tags.needValidation, true);
                    vo.input.jquery.on('input.spa', function () {
                        clearTimeout(vo.input.jquery.data(Tags.timer));
                        vo.input.jquery.data(Tags.timer, setTimeout(function () {
                            validateInput(vo.input.jquery);
                            vo.input.jquery.data(Tags.needValidation, false);
                        }, config.reValidationDelay));
                    }).on('change.spa', function () {
                        clearTimeout(vo.input.jquery.data(Tags.timer));
                        if (vo.input.jquery.data(Tags.needValidation)) {
                            vo.input.jquery.data(Tags.timer, setTimeout(function () {
                                validateInput(vo.input.jquery);
                            }, config.reValidationDelay));
                        } else vo.input.jquery.data(Tags.needValidation, true);
                    });
                    if (vo.confirmInput) {
                        vo.input.jquery.data(Tags.needValidation, true);
                        vo.confirmInput.jquery.on('input.spa', function () {
                            clearTimeout(vo.input.jquery.data(Tags.timer));
                            vo.input.jquery.data(Tags.timer, setTimeout(function () {
                                validateInput(vo.input.jquery);
                                vo.input.jquery.data(Tags.needValidation, false);
                            }, config.reValidationDelay));
                        }).on('change.spa', function () {
                            clearTimeout(vo.input.jquery.data(Tags.timer));
                            if (vo.input.jquery.data(Tags.needValidation)) {
                                vo.input.jquery.data(Tags.timer, setTimeout(function () {
                                    validateInput(vo.input.jquery);
                                }, config.reValidationDelay));
                            } else vo.input.jquery.data(Tags.needValidation, true);
                        });
                    }
                }
                //events attached (ea): indicate that event previously attached
                vo.input.jquery.data(Tags.isEventAttached, true);
                //End of attach
            }
        }

        function getValidator(vo) {
            switch (vo.pattern.type) {
                case PatternTypes.string:
                    validators.string.set(vo);
                    return validators.string;
                case PatternTypes.integer:
                    validators.number.set(vo, true);
                    return validators.number;
                case PatternTypes.float:
                    validators.number.set(vo, false);
                    return validators.number;
                case PatternTypes.timeline:
                    validators.timeline.set(vo);
                    return validators.timeline;
                case PatternTypes.email:
                    validators.email.set(vo);
                    return validators.email;
                case PatternTypes.url:
                    validators.url.set(vo);
                    return validators.url;
                case PatternTypes.in:
                    validators.in.set(vo);
                    return validators.in;
                case PatternTypes.file:
                    validators.file.set(vo);
                    return validators.file;
                case PatternTypes.regex:
                    validators.regex.set(vo);
                    return validators.regex;
                case PatternTypes.check:
                    validators.check.set(vo);
                    return validators.check;
                default:
                    throw spa.resource.get('ex.usp', { p: vo.pattern.name });
            }
        }

        function validateInput(input, isSilent) {

            var vo = parsingUnit.parse(input);

            if (!vo) return true;

            vo.pattern.invalidRules = [];
            errorUnit.clearErrorProxy(input);
            if (!getValidator(vo).validate()) {
                if (!isSilent) {
                    errorUnit.populateErrorMessages(vo);
                    errorUnit.onErrorProxy(vo);
                    attachEvents(vo);
                }
                return false;
            }
            return true;
        }

        function validate(form, isSilent, exclude) {
            form = sis(form);
            if (!form.length) throw spa.resource.get('ex.fnf');
            var inputs = getFormInputs(form),
                isValid = true,
                isDialogDriver = driversUnit.validationIsDialogOrFlashDriver,
                l = inputs.length,
                i = 0;
            if (exclude) inputs = inputs.not(exclude);
            for (; i < l; i++) {
                if (!validateInput($(inputs[i]), isSilent)) {
                    isValid = false;
                    if (isDialogDriver) return false;
                }
            }return isValid;
        }

        function isValidInput(input, isSilent) {
            return validateInput(sis(input), isSilent);
        }

        function resetValidation(form) {
            form = sis(form);
            if (!form.length) throw spa.resource.get('ex.fnf');
            var inputs = getFormInputs(form).off('.spa').removeData(cachingTags);
            for (var i = 0, l = inputs.length; i < l; i++) {
                errorUnit.clearErrorProxy($(inputs[i]));
            }
        }

        return {
            validate: validate,
            resetValidation: resetValidation,
            isValidInput: isValidInput
        };
    }();

    var validatorBase = function () {

        function applyPreRules(v) {
            var l = v.pattern.pre.length;
            var pre = v.pattern.pre;
            if (l) {
                for (var i = 0; i < l; i++) {
                    if (config.debug && (!config.validationPre || !config.validationPre[pre[i]])) throw spa.resource.get('ex.pfnf', { p: pre[i] });

                    v.input.valueToValidate = config.validationPre[pre[i]](v.input.valueToValidate);
                    if (v.confirmInput) v.confirmInput.valueToValidate = config.validationPre[pre[i]](v.confirmInput.valueToValidate);
                }
                v.input.valueToValidate = trim(v.input.valueToValidate.toString());
                if (v.confirmInput) v.confirmInput.valueToValidate = trim(v.confirmInput.valueToValidate.toString());
            }
        }

        //Validation Custom Rules
        function customRule(v, index) {
            var rule = v.pattern.rules[index];
            if (config.debug && (!config.validationCustomRules || !config.validationCustomRules[rule.name] || !spa.validation.isFunction(config.validationCustomRules[rule.name].validate))) throw spa.resource.get('ex.rnf', { p: v.pattern.name, r: rule.name });
            return config.validationCustomRules[rule.name].validate(v, index);
        }

        function validateParamsCount(count, v, rule) {
            if (rule.params.length < count) throw spa.resource.get('ex.ipc', { p: v.pattern.name, r: rule.name });
        }

        function getParamValue(param, type, patternName, ruleName, format) {
            var value = void 0;
            switch (type) {
                case 'i':
                    value = parseInt(param);
                    if (isNaN(value) && config.debug) {
                        throw spa.resource.get('ex.ipt', { p: patternName, r: ruleName, a: param });
                    }
                    return value;
                case 'f':
                    value = parseFloat(param);
                    if (isNaN(value) && config.debug) {
                        throw spa.resource.get('ex.ipt', { p: patternName, r: ruleName, a: param });
                    }
                    return value;
                case 't':
                    //only check if value is a valid timeline
                    value = spa.validation.isTimeline(param, format);
                    if (!value) throw spa.resource.get('ex.ipt', { p: patternName, r: ruleName, a: param });
                    return value;
            }
        }

        /**
         * The default isOut is false for all rules.
         * index is used for range rule only: 0 for the 1st boundary, 1 for the 2nd boundary
         */
        function isOut(rule) {
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var t = void 0;
            switch (rule.type) {
                case RuleTypes.min:
                case RuleTypes.s_min:
                case RuleTypes.max:
                case RuleTypes.s_max:
                    //the first param is the param value. The second param is 'i' for in or 'o' for out
                    t = rule.params[1];
                    if (t) return t.toLowerCase() === 'o';
                    return false;
                case RuleTypes.range:
                case RuleTypes.s_range:
                    //the first 2 param are the boundaries. The 3rd param is ii io oi oo
                    t = rule.params[2];
                    if (t) {
                        return t.toLowerCase()[index] === 'o';
                    }
                    return false;
            }
            return false;
        }

        return {
            applyPreRules: applyPreRules,
            customRule: customRule,
            validateParamsCount: validateParamsCount,
            getParamValue: getParamValue,
            isOut: isOut
        };
    }();

    var validators = {
        check: function () {
            var entry = void 0;

            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    if (!entry.input.valueToValidate && entry.pattern.required) {
                        entry.pattern.invalidRules.push(entry.pattern.required);
                        return false;
                    }
                    return entry.pattern.invalidRules.length === 0;
                }
            };
        }(),
        email: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);
                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) {
                                invalidRules.push(newRule('email', undefined));
                                for (i = 0; i < l; i++) {
                                    invalidRules.push(entry.pattern.rules[i]);
                                }
                            }
                            return false;
                        }
                        return true;
                    }

                    if (!spa.validation.isEmail(valueToValidate)) {
                        invalidRules.push(newRule('email', undefined));
                        if (!isLite) for (i = 0; i < l; i++) {
                            invalidRules.push(entry.pattern.rules[i]);
                        }return false;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);
                                p2 = validatorBase.getParamValue(rule.params[1], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (valueToValidate.length >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p2) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.in_domain:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (!spa.validation.isStringContainsOneOfArray(valueToValidate, p1)) invalidRules.push(rule);
                                break;
                            case RuleTypes.not_in_domain:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (spa.validation.isStringContainsOneOfArray(valueToValidate, p1)) invalidRules.push(rule);
                                break;
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    return invalidRules.length === 0;
                }
            };
        }(),
        file: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        j = void 0,
                        sum = void 0,
                        k = valueToValidate.length,
                        debug = config.debug;

                    if (k === 0) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) for (i = 0; i < l; i++) {
                                invalidRules.push(entry.pattern.rules[i]);
                            }return false;
                        }
                        return true;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;
                                sum = 0;

                                for (; j < k; j++) {
                                    sum += valueToValidate[j].size;
                                }if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (sum <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (sum < p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;
                                sum = 0;

                                for (; j < k; j++) {
                                    sum += valueToValidate[j].size;
                                }if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (sum >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (sum > p1) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;
                                p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;
                                sum = 0;

                                for (; j < k; j++) {
                                    sum += valueToValidate[j].size;
                                }if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (sum <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (sum < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (sum >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (sum > p2) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.s_min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;
                                for (; j < k; j++) {

                                    if (validatorBase.isOut(rule)) {
                                        //isOut
                                        if (valueToValidate[j].size <= p1) invalidRules.push(rule);
                                    } else {
                                        //in
                                        if (valueToValidate[j].size < p1) invalidRules.push(rule);
                                    }
                                }
                                break;
                            case RuleTypes.s_max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;
                                for (; j < k; j++) {

                                    if (validatorBase.isOut(rule)) {
                                        //isOut
                                        if (valueToValidate[j].size >= p1) invalidRules.push(rule);
                                    } else {
                                        //in
                                        if (valueToValidate[j].size > p1) invalidRules.push(rule);
                                    }
                                }
                                break;
                            case RuleTypes.s_range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name) * 1024 * 1024;
                                p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name) * 1024 * 1024;

                                j = 0;

                                for (; j < k; j++) {

                                    if (validatorBase.isOut(rule, 0)) {
                                        //isOut
                                        if (valueToValidate[j].size <= p1) invalidRules.push(rule);
                                    } else {
                                        //in
                                        if (valueToValidate[j].size < p1) invalidRules.push(rule);
                                    }

                                    if (validatorBase.isOut(rule, 1)) {
                                        //isOut
                                        if (valueToValidate[j].size >= p2) invalidRules.push(rule);
                                    } else {
                                        //in
                                        if (valueToValidate[j].size > p2) invalidRules.push(rule);
                                    }
                                }
                                break;
                            case RuleTypes.ext:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = [];
                                j = 0;
                                p2 = rule.params.length;

                                for (; j < p2; j++) {
                                    p1.push(rule.params[j]);
                                }j = 0;
                                p2 = valueToValidate.length;
                                for (; j < p2; j++) {
                                    if (!spa.validation.isStringContainsOneOfArray(valueToValidate[j].name, p1)) invalidRules.push(rule);
                                }break;
                            case RuleTypes.len:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                                if (k !== p1) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    return invalidRules.length === 0;
                }
            };
        }(),
        in: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        items = false,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) for (i = 0; i < l; i++) {
                                invalidRules.push(entry.pattern.rules[i]);
                            }return false;
                        }
                        return true;
                    }

                    i = 0;

                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.items:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                items = true;
                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (!spa.validation.isStringIn(valueToValidate, p1, true)) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    if (!items) throw spa.resource.get('ex.pmr', { p: entry.pattern.name, r: 'items' });

                    return invalidRules.length === 0;
                }
            };
        }(),
        number: function () {
            var entry = void 0,
                isInteger = void 0;
            return {
                set: function set(_entry, _isInteger) {
                    entry = _entry;
                    isInteger = _isInteger;
                },
                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        parsedValue = void 0,
                        debug = config.debug;

                    //numbers are always trimmed
                    if (!config.trimValues) {
                        entry.input.valueToValidate = trim(valueToValidate, true);
                        if (entry.confirmInput) entry.confirmInput.valueToValidate = trim(entry.confirmInput.valueToValidate, true);
                    }

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) {
                                if (isInteger) invalidRules.push(newRule('integer', undefined));else invalidRules.push(newRule('float', undefined));

                                for (i = 0; i < l; i++) {
                                    invalidRules.push(entry.pattern.rules[i]);
                                }
                            }
                            return false;
                        }
                        return true;
                    }

                    if (isInteger) {
                        if (!spa.validation.isInteger(valueToValidate)) {
                            invalidRules.push(newRule('integer', undefined));
                            if (!isLite) for (i = 0; i < l; i++) {
                                invalidRules.push(entry.pattern.rules[i]);
                            }return false;
                        } else parsedValue = parseInt(valueToValidate);
                    } else if (!spa.validation.isFloat(valueToValidate)) {
                        invalidRules.push(newRule('float', undefined));
                        if (!isLite) for (i = 0; i < l; i++) {
                            invalidRules.push(entry.pattern.rules[i]);
                        }return false;
                    } else parsedValue = parseFloat(valueToValidate);

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.positive:
                                if (parsedValue < 0) invalidRules.push(rule);
                                break;
                            case RuleTypes.negative:
                                if (parsedValue >= 0) invalidRules.push(rule);
                                break;
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (parsedValue <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (parsedValue < p1) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (parsedValue >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (parsedValue > p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'f', entry.pattern.name, rule.name);
                                p2 = validatorBase.getParamValue(rule.params[1], 'f', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (parsedValue <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (parsedValue < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (parsedValue >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (parsedValue > p2) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.not:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (spa.validation.isStringIn(valueToValidate, p1, true)) invalidRules.push(rule);
                                break;
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }

                    return invalidRules.length === 0;
                }
            };
        }(),
        regex: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        reg = false,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) for (i = 0; i < l; i++) {
                                invalidRules.push(entry.pattern.rules[i]);
                            }return false;
                        }
                        return true;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.pattern:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                reg = true;
                                if (!spa.validation.isRegMatch(valueToValidate, rule.params[0])) invalidRules.push(rule);
                                break;
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);
                                p2 = validatorBase.getParamValue(rule.params[1], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (valueToValidate.length >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p2) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.len:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (valueToValidate.length !== p1) invalidRules.push(rule);

                                break;
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    if (!reg) throw spa.resource.get('ex.pmr', { p: entry.pattern.name, r: 'pattern' });
                    return invalidRules.length === 0;
                }
            };
        }(),
        string: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) for (i = 0; i < l; i++) {
                                invalidRules.push(entry.pattern.rules[i]);
                            }return false;
                        }
                        return true;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.of:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                if (!spa.validation.isStringOf(valueToValidate, rule.params)) invalidRules.push(rule);
                                break;
                            case RuleTypes.not_of:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                if (spa.validation.isStringContainsOneOfRegex(valueToValidate, rule.params)) invalidRules.push(rule);
                                break;
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p1) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);
                                p2 = validatorBase.getParamValue(rule.params[1], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (valueToValidate.length >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p2) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.len:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (valueToValidate.length !== p1) invalidRules.push(rule);
                                break;
                            case RuleTypes.not:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (spa.validation.isStringIn(valueToValidate, p1, true)) invalidRules.push(rule);
                                break;
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    return invalidRules.length === 0;
                }
            };
        }(),
        timeline: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;

                    if (!entry.pattern.timelineFormat) entry.pattern.timelineFormat = newRule('format', [config.timelineFormat]);
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        format = entry.pattern.timelineFormat.params[0],
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) {
                                invalidRules.push(entry.pattern.timelineFormat);
                                for (i = 0; i < l; i++) {
                                    invalidRules.push(entry.pattern.rules[i]);
                                }
                            }
                            return false;
                        }
                        return true;
                    }

                    valueToValidate = spa.validation.isTimeline(valueToValidate, format);
                    if (!valueToValidate) {
                        invalidRules.push(entry.pattern.timelineFormat);
                        if (!isLite) for (i = 0; i < l; i++) {
                            invalidRules.push(entry.pattern.rules[i]);
                        }return false;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.min:
                                if (debug) {
                                    validatorBase.validateParamsCount(1, entry, rule);
                                    p1 = validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                                } else p1 = rule.params[0];

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (!spa.validation.isTimelineAfter(valueToValidate, p1, format)) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (!spa.validation.isTimelineAfterOrEqual(valueToValidate, p1, format)) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.max:
                                if (debug) {
                                    validatorBase.validateParamsCount(1, entry, rule);
                                    p1 = validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                                } else p1 = rule.params[0];

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (!spa.validation.isTimelineBefore(valueToValidate, p1, format)) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (!spa.validation.isTimelineBeforeOrEqual(valueToValidate, p1, format)) invalidRules.push(rule);
                                }
                                break;
                            case RuleTypes.range:
                                {
                                    if (debug) {
                                        validatorBase.validateParamsCount(2, entry, rule);
                                        p1 = validatorBase.getParamValue(rule.params[0], 't', entry.pattern.name, rule.name, format);
                                        p2 = validatorBase.getParamValue(rule.params[1], 't', entry.pattern.name, rule.name, format);
                                    } else {
                                        p1 = rule.params[0];
                                        p2 = rule.params[1];
                                    }

                                    var boundaries = '';

                                    boundaries += validatorBase.isOut(rule, 0) ? '(' : '[';
                                    boundaries += validatorBase.isOut(rule, 1) ? ')' : ']';

                                    if (!spa.validation.isTimelineBetween(valueToValidate, p1, p2, format, boundaries)) invalidRules.push(rule);
                                    break;
                                }
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== entry.input.valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    return invalidRules.length === 0;
                }
            };
        }(),
        url: function () {
            var entry = void 0;
            return {
                set: function set(_entry) {
                    entry = _entry;
                },

                validate: function validate() {
                    validatorBase.applyPreRules(entry);

                    var invalidRules = entry.pattern.invalidRules,
                        l = entry.pattern.rules.length,
                        isLite = entry.pattern.isLite,
                        valueToValidate = entry.input.valueToValidate,
                        rule = void 0,
                        i = void 0,
                        p1 = void 0,
                        p2 = void 0,
                        debug = config.debug;

                    if (!valueToValidate) {
                        if (entry.pattern.required) {
                            invalidRules.push(entry.pattern.required);
                            if (!isLite) {
                                invalidRules.push(newRule('url', undefined));
                                for (i = 0; i < l; i++) {
                                    invalidRules.push(entry.pattern.rules[i]);
                                }
                            }
                            return false;
                        }
                        return true;
                    }
                    if (!spa.validation.isUrl(valueToValidate)) {
                        invalidRules.push(newRule('url', undefined));
                        if (!isLite) for (i = 0; i < l; i++) {
                            invalidRules.push(entry.pattern.rules[i]);
                        }return false;
                    }

                    i = 0;
                    while (!(invalidRules.length && isLite) && i < l) {
                        rule = entry.pattern.rules[i];
                        switch (rule.type) {
                            case RuleTypes.min:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.max:
                                debug && validatorBase.validateParamsCount(1, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule)) {
                                    //isOut
                                    if (valueToValidate.length >= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p1) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.range:
                                debug && validatorBase.validateParamsCount(2, entry, rule);
                                p1 = validatorBase.getParamValue(rule.params[0], 'i', entry.pattern.name, rule.name);
                                p2 = validatorBase.getParamValue(rule.params[1], 'i', entry.pattern.name, rule.name);

                                if (validatorBase.isOut(rule, 0)) {
                                    //isOut
                                    if (valueToValidate.length <= p1) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length < p1) invalidRules.push(rule);
                                }

                                if (validatorBase.isOut(rule, 1)) {
                                    //isOut
                                    if (valueToValidate.length >= p2) invalidRules.push(rule);
                                } else {
                                    //in
                                    if (valueToValidate.length > p2) invalidRules.push(rule);
                                }

                                break;
                            case RuleTypes.in_domain:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (!spa.validation.isStringContainsOneOfArray(valueToValidate, p1)) invalidRules.push(rule);
                                break;
                            case RuleTypes.not_in_domain:
                                debug && validatorBase.validateParamsCount(1, entry, rule);

                                p1 = [];
                                for (p2 = rule.params.length - 1; p2 >= 0; p2--) {
                                    p1.push(rule.params[p2]);
                                }if (spa.validation.isStringContainsOneOfArray(valueToValidate, p1)) invalidRules.push(rule);
                                break;
                            case RuleTypes.confirmed:
                                if (!entry.confirmInput || entry.confirmInput.valueToValidate !== valueToValidate) invalidRules.push(rule);
                                break;
                            default:
                                if (!validatorBase.customRule(entry, i)) invalidRules.push(rule);
                        }
                        i++;
                    }
                    return invalidRules.length === 0;
                }
            };
        }()
    };

    function generateStringRegex(patternsArray) {
        var reg = '',

        //dash: should be the last character in the reg exp
        dash = false,
            i = 0,
            l = patternsArray.length;
        for (; i < l; i++) {
            switch (patternsArray[i]) {
                case 'alpha':
                    reg = reg + 'a-zA-Z';
                    break;
                case 'num':
                    reg = reg + '0-9';
                    break;
                case 'underscore':
                    reg = reg + '_';
                    break;
                case 'dash':
                    dash = true;
                    break;
                case 'spaces':
                    reg = reg + '\\s';
                    break;
                case 'dot':
                    reg = reg + '.';
                    break;
                case 'comma':
                    reg = reg + ',';
                    break;
                default:
                    throw spa.resource.get('ex.usst', { p: patternsArray[i] });
            }
        }
        if (dash) reg = reg + '-';
        return reg;
    }

    return {
        dialogDefaults: dialogDefaults,
        patternTypes: PatternTypes,
        ruleTypes: RuleTypes,
        tags: Tags,
        cachingTags: cachingTags,

        setOptions: function setOptions(o) {
            $.extend(true, config, o);

            if (o.dialogCurrentDriver) driversUnit.setDialogCD(o.dialogCurrentDriver);

            if (o.flashCurrentDriver) driversUnit.setFlashCD(o.flashCurrentDriver);

            if (o.validationCurrentDriver) driversUnit.setValidationCD(o.validationCurrentDriver);

            if (o.ajaxLaravelHeader) addLaravelToken();

            if (o.btnLoadingCurrentDriver) driversUnit.setBtnLoadingCD(o.btnLoadingCurrentDriver);

            updateMomentLocale();
        },
        setDialogCD: driversUnit.setDialogCD,
        setValidationCD: driversUnit.setValidationCD,
        setFlashCD: driversUnit.setFlashCD,
        setBtnLoadingCD: driversUnit.setBtnLoadingCD,
        getLocale: function getLocale() {
            return config.locale;
        },
        setLocale: function setLocale(l) {
            config.locale = l.toLowerCase();
            updateMomentLocale();
        },
        isLocale: function isLocale(l) {
            return config.locale === l.toLowerCase();
        },
        isDebug: function isDebug() {
            return config.debug;
        },
        getTimelineFormat: function getTimelineFormat() {
            return config.timelineFormat;
        },

        dialog: {
            message: function message(title, msg, status, icon, fn) {
                driversUnit.dialog.message(title, msg, status, icon, fn);
            },
            confirm: function confirm(title, msg, status, icon, fn1, fn2) {
                driversUnit.dialog.confirm(title, msg, status, icon, fn1, fn2);
            },
            prompt: function prompt(title, msg, status, icon, fn1, fn2, defaultValue) {
                driversUnit.dialog.prompt(title, msg, status, icon, fn1, fn2, defaultValue);
            },

            messageSuccess: function messageSuccess(title, msg, fn) {
                driversUnit.dialog.message(title, msg, 'success', 'success', fn);
            },
            messageError: function messageError(title, msg, fn) {
                driversUnit.dialog.message(title, msg, 'danger', 'danger', fn);
            },
            confirmDelete: function confirmDelete(fn, title, msg) {
                spa.dialog.confirm(title || spa.resource.get('delete.title'), msg || spa.resource.get('delete.confirm'), 'warning', 'warning', function () {
                    fn();
                });
            },

            /*
            *   pos: top-left, top-center, top-right
            *   pos: bottom-left, bottom-center, bottom-right
            */
            flash: function flash(title, message, status, icon, timeout, position) {
                driversUnit.flash.flash(title, message, status, icon, timeout, position);
            },
            flashSuccess: function flashSuccess(title, message, icon, timeout, position) {
                driversUnit.flash.flash(title, message, 'success', icon, timeout, position);
            },
            flashError: function flashError(title, message, icon, timeout, position) {
                driversUnit.flash.flash(title, message, 'danger', icon, timeout, position);
            }
        },

        validation: {
            getErrorList: config.validationDrivers.listOfErrors.getErrorList,
            validate: validationUnit.validate,
            resetValidation: validationUnit.resetValidation,
            isValidInput: validationUnit.isValidInput,

            //value validators
            isInteger: function isInteger(value) {
                return spa.validation.isRegMatch(value, /^[+-]?\d+$/) || spa.validation.isRegMatch(value, /^[+-]?[\u0660-\u0669]+$/);
            },

            isFloat: function isFloat(value) {
                return spa.validation.isRegMatch(value, /^[+-]?([0-9]*[.])?[0-9]+$/) || spa.validation.isRegMatch(value, /^[+-]?([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
            },

            isEmail: function isEmail(value) {
                return spa.validation.isRegMatch(value, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            },

            isUrl: function isUrl(value) {
                // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
                //     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                //     '(\\:\\d+)?'+ // port
                //     '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
                //     '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
                //     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                return spa.validation.isRegMatch(value, /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%@_.~+&:]*)*(\?[;&a-z\d%@_.,~+:=-]*)?(#[-a-z\d_]*)?$/i);
            },

            isPositiveNumber: function isPositiveNumber(value) {
                return spa.validation.isRegMatch(value, /^[+]?([0-9]*[.])?[0-9]+$/) || spa.validation.isRegMatch(value, /^[+]?([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
            },

            isNegativeNumber: function isNegativeNumber(value) {
                return spa.validation.isRegMatch(value, /^[-]([0-9]*[.])?[0-9]+$/) || spa.validation.isRegMatch(value, /^[-]([\u0660-\u0669]*[.])?[\u0660-\u0669]+$/);
            },

            isStringOf: function isStringOf(value, patternsArray) {
                var reg = generateStringRegex(patternsArray);
                //all character should meet the regex
                reg = '^[' + reg + ']+$';
                return spa.validation.isRegMatch(value, reg);
            },

            isStringContainsOneOfRegex: function isStringContainsOneOfRegex(value, patternsArray) {
                var reg = generateStringRegex(patternsArray);
                //search for one character at least that belong to the regex
                reg = '[' + reg + ']+';
                return spa.validation.isRegMatch(value, reg);
            },

            isStringContainsOneOfArray: function isStringContainsOneOfArray(value, array, caseSensitive) {
                if (!caseSensitive) value = value.toLowerCase();
                for (var i = 0, l = array.length; i < l; i++) {
                    if (value.indexOf(caseSensitive ? array[i] : array[i].toLowerCase()) >= 0) return true;
                }return false;
            },

            isStringIn: function isStringIn(value, array, caseSensitive) {
                //caseSensitive: default is false;
                if (!caseSensitive) value = value.toLowerCase();
                for (var i = 0, l = array.length; i < l; i++) {
                    if (value === (caseSensitive ? array[i] : array[i].toLowerCase())) return true;
                }return false;
            },

            isTimeline: function isTimeline(value, format) {
                var t = moment(value, format, true);
                if (t.isValid()) return t;
                return false;
                // return moment(value, format, true).isValid();
            },

            isTimelineBeforeOrEqual: function isTimelineBeforeOrEqual(value, boundary, format) {
                var p1 = moment.isMoment(boundary) ? boundary : moment(boundary, format, true),
                    p2 = moment.isMoment(value) ? value : moment(value, format, true);
                return p1.isValid() && p2.isValid() && !p1.isBefore(p2);
            },

            isTimelineAfterOrEqual: function isTimelineAfterOrEqual(value, boundary, format) {
                var p1 = moment.isMoment(boundary) ? boundary : moment(boundary, format, true),
                    p2 = moment.isMoment(value) ? value : moment(value, format, true);
                return p1.isValid() && p2.isValid() && !p1.isAfter(p2);
            },

            isTimelineBefore: function isTimelineBefore(value, boundary, format) {
                var p1 = moment.isMoment(boundary) ? boundary : moment(boundary, format, true),
                    p2 = moment.isMoment(value) ? value : moment(value, format, true);
                return p1.isValid() && p2.isValid() && p2.isBefore(p1);
            },

            isTimelineAfter: function isTimelineAfter(value, boundary, format) {
                var p1 = moment.isMoment(boundary) ? boundary : moment(boundary, format, true),
                    p2 = moment.isMoment(value) ? value : moment(value, format, true);
                return p1.isValid() && p2.isValid() && p2.isAfter(p1);
            },

            isTimelineBetween: function isTimelineBetween(value, min, max, format, boundaries) {
                var p1 = moment.isMoment(value) ? value : moment(value, format, true),
                    p2 = moment.isMoment(min) ? min : moment(min, format, true),
                    p3 = moment.isMoment(max) ? max : moment(max, format, true);

                return p1.isValid() && p2.isValid() && p3.isValid() && p1.isBetween(p2, p3, null, boundaries || '[]');
            },

            isRegMatch: function isRegMatch(value, reg) {
                return new RegExp(reg).test(value);
            },

            isFunction: function isFunction(value) {
                return typeof value === 'function';
            },

            isArray: function isArray(value) {
                return value && value.constructor === Array;
            }
        },

        ajax: {
            request: function request(verb, url, data, fn, isUpload, options, button) {
                var o = {
                    headers: config.ajaxHeader,
                    type: verb,
                    url: url || spa.web.getUrl(),
                    data: data,
                    // dataType: 'json',
                    error: config.ajaxOnError
                };
                if (isUpload) {
                    o['cache'] = false;
                    o['contentType'] = false;
                    o['processData'] = false;
                }
                if (options) $.extend(o, options);

                var ajax = $.ajax(o);
                if (button) {
                    spa.dom.setLoadingButton(button);
                    ajax.always(function () {
                        spa.dom.unsetLoadingButton(button);
                    });
                }
                return ajax.done(fn);
            },
            post: function post(url, data, fn, button) {
                var o = {
                    headers: config.ajaxHeader,
                    type: 'post',
                    url: url || spa.web.getUrl(),
                    data: data,
                    // dataType: 'json',
                    error: config.ajaxOnError
                };

                var ajax = $.ajax(o);
                if (button) {
                    spa.dom.setLoadingButton(button);
                    ajax.always(function () {
                        spa.dom.unsetLoadingButton(button);
                    });
                }
                return ajax.done(fn);
            },
            get: function get(url, data, fn, button) {
                var o = {
                    headers: config.ajaxHeader,
                    type: 'get',
                    url: url || spa.web.getUrl(),
                    data: data,
                    // dataType: 'json',
                    error: config.ajaxOnError
                };

                var ajax = $.ajax(o);
                if (button) {
                    spa.dom.setLoadingButton(button);
                    ajax.always(function () {
                        spa.dom.unsetLoadingButton(button);
                    });
                }
                return ajax.done(fn);
            },
            delete: function _delete(url, data, fn, button) {
                var o = {
                    headers: config.ajaxHeader,
                    type: 'delete',
                    url: url || spa.web.getUrl(),
                    data: data,
                    // dataType: 'json',
                    error: config.ajaxOnError
                };

                var ajax = $.ajax(o);
                if (button) {
                    spa.dom.setLoadingButton(button);
                    ajax.always(function () {
                        spa.dom.unsetLoadingButton(button);
                    });
                }
                return ajax.done(fn);
            },
            put: function put(url, data, fn, button) {
                var o = {
                    headers: config.ajaxHeader,
                    type: 'put',
                    url: url || spa.web.getUrl(),
                    data: data,
                    // dataType: 'json',
                    error: config.ajaxOnError
                };

                var ajax = $.ajax(o);
                if (button) {
                    spa.dom.setLoadingButton(button);
                    ajax.always(function () {
                        spa.dom.unsetLoadingButton(button);
                    });
                }
                return ajax.done(fn);
            },
            postBtn: function postBtn(button, url, data, fn) {
                return sis(button).on('click', function (e) {
                    e.preventDefault();
                    spa.ajax.post(url, data, fn, $(this));
                });
            },
            getBtn: function getBtn(button, url, data, fn) {
                return sis(button).on('click', function (e) {
                    e.preventDefault();
                    spa.ajax.get(url, data, fn, $(this));
                });
            },
            deleteBtn: function deleteBtn(button, url, data, fn) {
                return sis(button).on('click', function (e) {
                    e.preventDefault();
                    spa.ajax.delete(url, data, fn, $(this));
                });
            },
            putBtn: function putBtn(button, url, data, fn) {
                return sis(button).on('click', function (e) {
                    e.preventDefault();
                    spa.ajax.put(url, data, fn, $(this));
                });
            }
        },

        array: {
            insertLast: function insertLast(array, item) {
                return array.push(item);
            },
            insertFirst: function insertFirst(array, item) {
                return array.unshift(item);
            },
            insertAt: function insertAt(array, index, item) {
                array.splice(index, 0, item);
                return array.length;
            },
            removeLast: function removeLast(array) {
                return array.pop();
            },
            removeFirst: function removeFirst(array) {
                return array.shift();
            },
            removeAt: function removeAt(array, index) {
                var item = array[index];
                array.splice(index, 1);
                return item;
            },
            removeWhere: function removeWhere(array, fn) {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (fn(array[i], i) === true) spa.array.removeAt(array, i);
                }
            },
            searchGetBool: function searchGetBool(array, fn) {
                for (var i = 0, l = array.length; i < l; i++) {
                    if (fn(array[i], i) === true) return true;
                }return false;
            },
            searchGetIndex: function searchGetIndex(array, fn) {
                for (var i = 0, l = array.length; i < l; i++) {
                    if (fn(array[i], i) === true) return i;
                }return -1;
            },
            searchGetItem: function searchGetItem(array, fn) {
                for (var i = 0, l = array.length; i < l; i++) {
                    if (fn(array[i], i) === true) return array[i];
                }return undefined;
            },
            foreach: function foreach(enumerable, fn) {
                if (spa.validation.isArray(enumerable)) {
                    for (var i = 0, l = enumerable.length; i < l; i++) {
                        if (fn(enumerable[i], i) === false) break;
                    }
                } else for (var key in enumerable) {
                    if (enumerable.hasOwnProperty(key)) {
                        if (fn(enumerable[key], key) === false) break;
                    }
                }
            },
            foreachReversed: function foreachReversed(array, fn) {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (fn(array[i], i) === false) break;
                }
            },
            toString: function toString(array) {
                return '[' + array.join(', ') + ']';
            },
            copy: function copy(array) {
                return $.extend(true, [], array);
            },
            filter: function filter(array, fn) {
                var _new = [];
                if (fn) {
                    for (var i = 0, l = array.length; i < l; i++) {
                        if (fn(array[i], i) === true) _new.push(array[i]);
                    }
                } else {
                    for (var _i4 = 0, _l3 = array.length; _i4 < _l3; _i4++) {
                        if (array[_i4]) _new.push(array[_i4]);
                    }
                }
                return _new;
            },
            map: function map(array, fn) {
                var _new = [],
                    temp = undefined;
                if (fn) {
                    for (var i = 0, l = array.length; i < l; i++) {
                        temp = fn(array[i], i);
                        if (temp) _new.push(temp);
                    }
                }
                return _new;
            },
            wrap: function wrap(array) {
                if (!array) return [];
                return spa.validation.isArray(array) ? array : [array];
            }
        },

        dom: {
            click: function click(btn, fn) {
                return sis(btn).on('click', fn);
            },
            getFriendlyName: function getFriendlyName(input) {
                //get friendly name
                var name = input.attr(Tags.friendlyName);
                return name === undefined ? spa.resource.get('validation.defaultFriendlyName') : name;
            },
            setDisable: function setDisable(item, status) {
                item = sis(item);
                if (item.length) {
                    if (item.is(':input')) item.prop('disabled', status);else status ? item.addClass('disabled') : item.removeClass('disabled');
                    return item;
                }
            },
            setLoadingButton: function setLoadingButton(btn) {
                driversUnit.btnLoading.set(btn);
            },
            unsetLoadingButton: function unsetLoadingButton(btn, html) {
                driversUnit.btnLoading.unset(btn, html);
            },
            //option is {id: '', class: '', attr: {k1: v1, k2, v2}}
            addHtmlAttr: function addHtmlAttr(jquery, option) {
                jquery.attr('id', option.id).addClass(option.class);

                if (option.attr) for (var k in option.attr) {
                    jquery.attr(k, option.attr[k]);
                }return jquery;
            }
        },

        form: {
            submitAjax: function submitAjax(form, submitter, validate, fn) {
                form = sis(form);
                if (!form.length) throw spa.resource.get('ex.fnf');

                if (validate && !validationUnit.validate(form)) return false;

                var url = form.attr('action') || spa.web.getUrl();
                var verb = form.attr('method') || 'get';

                if (verb.trim().toLowerCase() === 'post') {
                    if (form.find('input[type=file]').length) {
                        //contains files
                        //type = post
                        var data = new FormData(form[0]);
                        return spa.ajax.request('POST', url, data, fn, true, undefined, submitter);
                    } else return spa.ajax.post(url, form.serialize(), fn, submitter);
                } else return spa.ajax.get(url, form.serialize(), fn, submitter);
            },
            submit: function submit(form, submitter, validate) {
                form = sis(form);
                if (!form.length) throw spa.resource.get('ex.fnf');

                if (validate && !validationUnit.validate(form)) return false;

                spa.dom.setLoadingButton(submitter);
                form.submit();
            },
            registerNormalSubmitter: function registerNormalSubmitter(form, submitter, validate) {
                form = sis(form);
                submitter = sis(submitter);
                if (!form.length || !submitter.length) return;
                submitter.on('click', function (e) {
                    e.preventDefault();
                    spa.form.submit(form, submitter, validate);
                });
            },
            registerAjaxSubmitter: function registerAjaxSubmitter(form, submitter, validate, fn) {
                form = sis(form);
                submitter = sis(submitter);
                if (!form.length || !submitter.length) return;
                submitter.on('click', function (e) {
                    e.preventDefault();
                    spa.form.submitAjax(form, submitter, validate, fn);
                });
            },
            getFormInputsAsObject: function getFormInputsAsObject(form) {
                form = sis(form);
                if (!form.length) throw spa.resource.get('ex.fnf');

                var values = form.serializeArray(),
                    result = {};

                for (var i = 0, l = values.length; i < l; i++) {
                    var item = values[i];

                    if (result[item.name]) {
                        if (!spa.validation.isArray(result[item.name])) result[item.name] = [result[item.name]];
                        result[item.name].push(trim(item.value));
                    } else result[item.name] = trim(item.value);
                }

                return result;
            }
        },

        input: {
            getValue: function getValue(input) {
                input = sis(input);
                if (input.length) return trim(input.val());
            },
            getFiles: function getFiles(input) {
                input = sis(input);
                if (input.length) return input[0].files;
            },
            setValue: function setValue(input, value) {
                input = sis(input);
                if (input.length) return input.val(value).trigger('change');
                return input;
            },
            select: {
                getSelectedOption: function getSelectedOption(select) {
                    select = sis(select);
                    if (select.length) {
                        var o = select.find(':selected');
                        if (o.length) return o;
                    }
                },
                getSelectedValue: function getSelectedValue(select) {
                    return spa.input.getValue(select);
                },
                getSelectedText: function getSelectedText(select) {
                    var o = spa.input.select.getSelectedOption(select);
                    if (o) return trim(o.text());
                },
                getSelectedIndex: function getSelectedIndex(select) {
                    select = sis(select);
                    if (select.length) return select.prop('selectedIndex');
                    return -1;
                },
                setSelectedIndex: function setSelectedIndex(select, index) {
                    if (index >= 0) {
                        select = sis(select);
                        if (select.length) {
                            var o = select.find('option:nth-child(' + (index + 1) + ')');
                            if (o.length) {
                                o.prop('selected', true);
                                select.trigger('change');
                                return select;
                            }
                        }
                    }
                },
                setSelectedValue: function setSelectedValue(select, value) {
                    return spa.input.setValue(select, value);
                },
                setFirstOptionSelected: function setFirstOptionSelected(select) {
                    select = sis(select);
                    if (select.length) {
                        var ops = select.find('option:first-child');
                        if (ops.length) {
                            ops.prop('selected', true);
                            select.trigger('change');
                            return select;
                        }
                    }
                },
                clearOptions: function clearOptions(select) {
                    select = sis(select);
                    if (select.length) return select.empty().trigger('change');
                },
                addOptions: function addOptions(select, options, removeCurrent, firstOptionLabel) {
                    select = sis(select);
                    if (select.length) {
                        var ops = [];
                        if (firstOptionLabel) ops.push($('<option selected disabled value>' + firstOptionLabel + '</option>'));
                        for (var i = 0, l = options.length; i < l; i++) {
                            ops.push(spa.dom.addHtmlAttr($('<option value="' + options[i].value + '">' + options[i].text + '</option>'), options[i]));
                        }if (removeCurrent) select.empty().html(ops);else select.append(ops);
                        return select.trigger('change');
                    }
                },
                addOption: function addOption(select, option, isSelected) {
                    select = sis(select);
                    if (select.length) {
                        var o = spa.dom.addHtmlAttr($('<option value="' + option.value + '">' + option.text + '</option>'), option);

                        select.append(o);

                        if (isSelected) o.prop('selected', true);
                        return select.trigger('change');
                    }
                }
            },
            checkable: {
                // used in web production
                isChecked: function isChecked(input) {
                    input = sis(input);
                    if (input.length) return input.is(':checked');
                },
                set: function set(input, status) {
                    input = sis(input);
                    if (input.length) return input.prop("checked", status).trigger('change');
                },
                getRadioGroupValue: function getRadioGroupValue(name) {
                    return spa.input.getValue('input[name="' + name + '"]:checked');
                },
                getCheckboxGroupArray: function getCheckboxGroupArray(name) {
                    var value = [],
                        g = $('input[name="' + name + '"]:checked');
                    var l = g.length;
                    if (l) for (var i = 0; i < l; i++) {
                        value.push(trim($(g[i]).val()));
                    }return value;
                }
            }
        },

        resource: {
            //replace: {pa1: 'val2', pa2: 'val2'}
            get: function get(key, replace) {
                try {
                    var str = resourcesBank[key][config.locale] || resourcesBank[key]['def'];
                    if (str && replace) str = spa.resource.replace(str, replace);
                    return str;
                } catch (ex) {
                    return undefined;
                }
            },


            //{key: '', en: '', ar: ''}
            set: function set(resource) {
                var key = resource.key;
                delete resource.key;

                var temp = void 0;
                if (resourcesBank[key])
                    //exist
                    temp = resourcesBank[key];else {
                    //new
                    resourcesBank[key] = {};
                    temp = resourcesBank[key];
                }
                $.extend(temp, resource);
            },
            setArray: function setArray(resourceArray) {
                for (var i = 0, l = resourceArray.length; i < l; i++) {
                    spa.resource.set(resourceArray[i]);
                }
            },


            //replace: {pa1: 'val2', pa2: 'val2'}
            replace: function replace(str, _replace) {
                for (var k in _replace) {
                    // if (replace.hasOwnProperty(k))
                    str = str.replace(new RegExp(':' + k, 'g'), _replace[k]);
                }return str;
            }
        },

        table: {
            addRows: function addRows(table, rows) {
                table = sis(table);
                if (!table.length) return;

                var rowList = [],
                    singleRow = void 0;
                if (spa.validation.isArray(rows)) {
                    var i = 0,
                        l = rows.length,
                        _row = void 0,
                        j = void 0,
                        m = void 0,
                        col = void 0;
                    if (!l) return;
                    for (; i < l; i++) {
                        _row = rows[i];
                        singleRow = spa.dom.addHtmlAttr($('<tr>'), _row);

                        for (j = 0, m = _row.columns.length; j < m; j++) {
                            col = _row.columns[j];
                            singleRow.append(spa.dom.addHtmlAttr($('<td>'), col).html(col.data));
                        }
                        rowList.push(singleRow[0]);
                    }
                } else {
                    singleRow = spa.dom.addHtmlAttr($('<tr>'), rows);

                    for (var _j2 = 0, _m2 = rows.columns.length; _j2 < _m2; _j2++) {
                        var _col = rows.columns[_j2],
                            _td = spa.dom.addHtmlAttr($('<td>'), _col).html(_col.data);
                        singleRow.append(_td);
                    }
                    rowList.push(singleRow[0]);
                }

                if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) {
                    if (rowList.length > 1) table.DataTable().rows.add(rowList);else table.DataTable().row.add(rowList[0]);

                    table.DataTable().columns.adjust().draw();
                } else table.find('tbody').append(rowList);

                spa.table.updatePaginationTotal(rowList.length);
                return rowList.length === 1 ? rowList[0] : rowList;
            },
            removeRows: function removeRows(table, rows) {
                table = sis(table);

                if (!table.length) return;

                rows = table.find('tbody').find(rows);

                if (!rows.length) return;

                if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) {
                    if (rows.length > 1) table.DataTable().rows(rows).remove().draw();else table.DataTable().row(rows).remove().draw();
                } else rows.remove();

                spa.table.updatePaginationTotal(-rows.length);
                return rows;
            },
            removeChecked: function removeChecked(table, inputName) {
                table = sis(table);

                if (!table.length) return;

                var r = table.find('input[name="' + inputName + '"]:checked').closest('tr');
                if (!r.length) return;
                return spa.table.removeRows(table, r);
            },
            removeAll: function removeAll(table) {
                table = sis(table);
                if (!table.length) return;
                var result = table.find('tbody').find('tr');
                if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) table.DataTable().rows(result).remove().draw();else result.remove();

                spa.table.updatePaginationTotal(-result.length);
                return result;
            },
            moveRows: function moveRows(from, to, rows) {
                var r = spa.table.removeRows(from, rows);
                if (!r.length) return;
                to = sis(to);
                if (!to.length) return;
                if ($.fn.DataTable && $.fn.DataTable.isDataTable(to)) {
                    if (r.length > 1) to.DataTable().rows.add(r).draw();else to.DataTable().row.add(r).draw();
                } else to.find('tbody').append(r);
                return r;
            },
            moveChecked: function moveChecked(from, to, inputName) {
                var r = spa.table.removeChecked(from, inputName);
                if (!r.length) return;
                to = sis(to);
                if (!to.length) return;
                if ($.fn.DataTable && $.fn.DataTable.isDataTable(to)) {
                    if (r.length > 1) to.DataTable().rows.add(r).draw();else to.DataTable().row.add(r).draw();
                } else to.find('tbody').append(r);
                r.find(inputName).prop("checked", false);
                return r;
            },
            count: function count(table, rows) {
                table = sis(table);
                if (!table.length) return;
                if ($.fn.DataTable && $.fn.DataTable.isDataTable(table)) return rows ? table.DataTable().rows(rows).count() : table.DataTable().data().count();else return rows ? table.find('tbody').find(rows).length : table.find('tbody').find('tr').length;
            },

            updatePaginationTotal: function updatePaginationTotal(value, rowCountElement) {
                rowCountElement = rowCountElement ? sis(rowCountElement) : $('#pagination').find('.total');
                if (rowCountElement.length) {
                    var oldCount = 0;
                    try {
                        oldCount = parseInt(rowCountElement.text());
                    } catch (ex) {}
                    var newCount = oldCount + value;
                    rowCountElement.text(newCount);
                    return newCount;
                }
                return -1;
            }
        },

        util: {
            randomString: function randomString(length, num, small, capital) {
                var charset = undefined,
                    retVal = "";
                if (!num && !capital && !small) charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";else {
                    if (small) charset = "abcdefghijklmnopqrstuvwxyz";
                    if (capital) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    if (num) charset += "0123456789";
                }

                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }return retVal;
            },
            debounce: function debounce(delay, fn) {
                var timeout = void 0,
                    immediate = undefined;
                var d = function d() {
                    var context = this,
                        args = arguments;
                    var later = function later() {
                        timeout = null;
                        if (!immediate) fn.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, delay);
                    if (callNow) fn.apply(context, args);
                };
                d.cancel = function () {
                    clearTimeout(timeout);
                    timeout = null;
                };

                return d;
            },
            timer: function timer(interval, fn) {
                return setInterval(fn, interval);
            },
            cancelTimer: function cancelTimer(id) {
                clearInterval(id);
            },
            executeLater: function executeLater(delay, fn) {
                return setTimeout(fn, delay);
            },
            cancelExecuteLater: function cancelExecuteLater(id) {
                clearTimeout(id);
            },
            getTimelineDiff: function getTimelineDiff(timeline1, timeline2, format) {
                var duration = '';

                if (timeline1 && timeline2) {

                    if (!format) format = config.timelineFormat;

                    var _start = spa.validation.isTimeline(timeline1, format),
                        _end = spa.validation.isTimeline(timeline2, format);

                    if (_start && _end) {
                        var diffValue = _end.diff(_start);

                        if (diffValue > 0) {
                            var diff = moment.duration(diffValue),
                                years = diff.years(),
                                _months = diff.months(),
                                _days = diff.days(),
                                hours = diff.hours(),
                                minutes = diff.minutes();

                            if (years) {
                                duration += years + ' :year';
                            }

                            if (_months) {
                                if (duration) duration += ' :and ';
                                duration += _months + ' :month';
                            }

                            if (_days) {
                                if (duration) duration += ' :and ';
                                duration += _days + ' :day';
                            }

                            if (hours) {
                                if (duration) duration += ' :and ';
                                duration += hours + ' :hour';
                            }

                            if (minutes) {
                                if (duration) duration += ' :and ';
                                duration += minutes + ' :minute';
                            }
                        }

                        if (duration) duration = spa.resource.replace(duration, {
                            'year': spa.resource.get('year'),
                            'month': spa.resource.get('month'),
                            'day': spa.resource.get('day'),
                            'hour': spa.resource.get('hour'),
                            'minute': spa.resource.get('minute'),

                            'and': spa.resource.get('and')
                        });
                    }
                }
                return duration;
            },
            formatDate: function formatDate(date, format) {
                return moment(date).format(format || spa.getTimelineFormat());
            },
            token: {
                addToObj: function addToObj(obj) {
                    obj[config.tokenName] = config.tokenValue;
                    return obj;
                },
                addToForm: function addToForm(form) {
                    form.prepend('<input type="hidden" name="' + config.tokenName + '" value="' + config.tokenValue + '" />');
                }
            }
        },

        web: {
            reload: function reload(ReloadFromServer) {
                window.location.reload(ReloadFromServer);
            },
            redirect: function redirect(url) {
                // window.location.href = u;
                window.location.replace(url);
            },
            newTab: function newTab(url) {
                window.open(url, '_blank');
            },

            getUrl: function getUrl(url) {
                if (url === undefined) url = window.location.href;
                return new URL(url, window.location.origin).href;
            },
            pathHas: function pathHas(key, path) {
                if (!path) path = spa.web.getPathWithoutQueryString();
                return path.indexOf(key) !== -1;
            },
            getUrlWithoutQueryString: function getUrlWithoutQueryString(url) {
                if (url === undefined) url = window.location.href;
                return new URL(url, window.location.origin).origin;
            },

            getPath: function getPath(url) {
                if (url === undefined) url = window.location.href;
                url = new URL(url, window.location.origin);
                return url.pathname + url.search;
            },

            getPathWithoutQueryString: function getPathWithoutQueryString(url) {
                if (url === undefined) url = window.location.href;
                return new URL(url, window.location.origin).pathname;
            },

            getQueryStringAsObject: function getQueryStringAsObject(url) {
                if (url === undefined) url = window.location.href;
                var result = {};
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = new URL(url, window.location.origin).searchParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var pair = _step.value;

                        result[pair[0]] = pair[1];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return result;
            },

            getQueryString: function getQueryString(name, url) {
                if (url === undefined) url = window.location.href;
                url = new URL(url, window.location.origin);
                return name ? url.searchParams.get(name) : url.search;
            },

            updateQueryString: function updateQueryString(obj, url) {
                if (url === undefined) url = window.location.href;
                url = new URL(url, window.location.origin);
                for (var k in obj) {
                    url.searchParams.set(k, obj[k]);
                }return url.href;
            },

            removeQueryString: function removeQueryString(key, url) {
                if (url === undefined) url = window.location.href;
                url = new URL(url, window.location.origin);
                if (key) {
                    url.searchParams.delete(key);
                    return url.href;
                } else return url.origin;
            },

            localize: function localize(url, locale, method) {
                if (url === undefined) url = window.location.href;
                locale = locale || config.locale;
                if (locale === config.defaultLocale) return url;
                method = method || config.localeMethod;
                if (method == '1') {
                    //cookie
                    return url;
                }
                if (method == '2') {
                    url = new URL(url, window.location.origin);
                    //segment
                    url.pathname = '/' + locale + url.pathname;
                    return url.href;
                }

                //query
                return spa.web.updateQueryString(_defineProperty({}, config.localeQueryKey, locale), url);
            },

            urlSegments: function urlSegments(index, url) {
                if (url === undefined) url = window.location.href;
                url = new URL(url, window.location.origin);
                var segments = spa.array.filter(url.pathname.split('/'));
                if (index) return segments[index - 1];else return segments;
            }
        },

        init: {
            datepicker: function datepicker(input, options) {
                input = sis(input);
                if (input.length) {
                    var def = config.datepickerOptions[config.locale];
                    if (options) def = $.extend({}, def, options);
                    input.datepicker(def);
                }
            },
            datepickerOnChange: function datepickerOnChange(s, fn) {
                return sis(s).each(function (index, item) {
                    item = $(item);
                    var oldVal = item.val();
                    item.on('change', function () {
                        var newVal = item.val();
                        if (newVal !== oldVal) {
                            oldVal = newVal;
                            fn(item, newVal);
                        }
                    });
                });
            },
            select2: function select2(input, options) {
                input = sis(input);
                if (input.length) {
                    var def = { dir: config.locale === 'ar' ? 'rtl' : 'ltr' };
                    if (options) def = $.extend({}, def, options);
                    input.select2(def);
                }
            },
            dataTable: function dataTable(table, options) {
                table = sis(table);
                if (table.length) {
                    var def = config.datatableOptions[config.locale];
                    if (options) def = $.extend({}, def, options);
                    table.DataTable(def);
                }
            },
            createCounter: function createCounter(input, counter, max) {
                input = sis(input);
                counter = sis(counter);
                if (input.length && counter.length) {
                    input.on('keyup', function () {
                        var targetObjLength = input.val().length;
                        var delta = max - targetObjLength;
                        if (delta < 0) input.val(input.val().substring(0, max));
                        counter.html(delta < 0 ? 0 : delta);
                    });
                    input.trigger('keyup');
                }
            },
            autoComplete: function autoComplete(input, url, appendTo) {
                input = sis(input);
                if (input.length) {
                    input.autocomplete({
                        source: function source(request, response) {
                            $.ajax({
                                url: url,
                                dataType: "json",
                                data: {
                                    term: request.term
                                },
                                success: function success(data) {
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
            showMsg: function showMsg(selector, dataAttribute, context) {
                if (context) {
                    context = sis(context);
                    if (context.length) {
                        context.on('click', selector, function (e) {
                            e.preventDefault();
                            spa.dialog.message('', $(this).attr(dataAttribute));
                        });
                    }
                } else {
                    selector = sis(selector);
                    if (selector.length) {
                        selector.on('click', function (e) {
                            e.preventDefault();
                            spa.dialog.message('', $(this).attr(dataAttribute));
                        });
                    }
                }
            },
            deleteAndRedirect: function deleteAndRedirect(btnSelector, deleteUrl, redirectUrl, title, msg) {
                btnSelector = sis(btnSelector);
                if (btnSelector.length) {
                    btnSelector.on('click', function (e) {
                        e.preventDefault();
                        spa.dialog.confirm(title || spa.resource.get('delete.title'), msg || spa.resource.get('delete.confirm'), 'warning', 'warning', function () {
                            spa.ajax.delete(deleteUrl, null, function (data) {
                                spa.dialog.messageSuccess('', data.message, function () {
                                    spa.web.redirect(redirectUrl);
                                });
                            }, btnSelector);
                        });
                    });
                }
            },
            listDelete: function listDelete(btnSelector, idAttribute, url, tableSelector, title, msg) {
                sis(tableSelector).on('click', btnSelector, function (e) {
                    e.preventDefault();
                    var self = $(this);
                    var delUrl = url.replace(':id', self.attr(idAttribute));
                    spa.dialog.confirm(title || spa.resource.get('delete.title'), msg || spa.resource.get('delete.confirm'), 'warning', 'warning', function () {
                        spa.ajax.delete(delUrl, null, function (data) {
                            spa.dialog.messageSuccess('', data.message, function () {
                                spa.table.removeRows(tableSelector, self.closest('tr'));
                            });
                        }, self);
                    });
                });
            }
        }
    };
}();
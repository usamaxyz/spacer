import {ajaxOnError} from './namespaces/ajax'
import SpacerDialog from './namespaces/dialog/dialog-drivers/spacer-dialog'
import alert from './namespaces/dialog/dialog-drivers/alert'
import sweetAlert from './namespaces/dialog/dialog-drivers/sweet-alert'
import bootstrap3Panel from './namespaces/dialog/dialog-services/bootstrap3-panel'
import bootstrap3Modal from './namespaces/dialog/dialog-services/bootstrap3-modal'
import ukNotifyDriver from './namespaces/dialog/flash-drivers/uk-notify/driver'
import silent from './namespaces/validation/drivers/silent'
import bootstrap3 from './namespaces/validation/drivers/bootstrap3'
import listOfErrors from './namespaces/validation/drivers/listOfErrors'
import customRules from "./namespaces/validation/extentions/custom-rules";

const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    daysShort = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
    daysMin = ['أح', 'اث', 'ث', 'أر', 'خ', 'ج', 'س'],
    months= ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'أب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
    monthsShort= ['كانون 2', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'أب', 'أيلول', 'تشرين 1', 'تشرين 2', 'كانون 1'];

let config = {
    locale: 'en',
    debug: false,
    timelineFormat: 'D-M-YYYY',
    trimValues: true,

    ajaxHeader: undefined,
    ajaxOnError: ajaxOnError,
    ajaxLaravelHeader: false,

    /*
        'alert'
        'sweetAlert'
        'bootstrap3Panel'
        'bootstrap3Modal'
     */
    dialogCurrentDriver: 'bootstrap3Panel',
    dialogDrivers: {
        alert,
        sweetAlert,
        bootstrap3Panel: new SpacerDialog(bootstrap3Panel),
        bootstrap3Modal: new SpacerDialog(bootstrap3Modal),
    },

    /*
        'ukNotify'
     */
    flashCurrentDriver: 'ukNotify',
    flashDrivers: {
        'ukNotify': ukNotifyDriver,
    },

    /*
        'silent'
        'bootstrap3'
        'listOfErrors'
        'dialog'
        'dialog.alert'
        'dialog.sweetAlert'
        'dialog.bootstrap3Panel'
        'dialog.bootstrap3Modal'
     */
    validationCurrentDriver: 'bootstrap3',
    validationDrivers: {
        silent,
        bootstrap3,
        listOfErrors,
    },
    reValidationDelay: 500,
    listOfErrorsSelector: '#spacer-listOfErrors',

    validationCustomRules: customRules,
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
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        }
    },
    datepickerOptions:{
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
    datatableOptions:{
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
};

export default config
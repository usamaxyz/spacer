let resources = {
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
        en: 'The :fn must be an integer number.',
        ar: 'يجب أن يكون :fn رقم صحيح.'
    },
    'integer.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'integer.positive': {
        en: 'The :fn must be positive number.',
        ar: 'يجب أن يكون :fn رقم موجب.'
    },
    'integer.negative': {
        en: 'The :fn must be negative number.',
        ar: 'يجب أن يكون :fn رقم سالب.'
    },
    'integer.min_i': {
        en: 'The :fn must be less than or equal to :p1.',
        ar: ' يجب أن يكون :fn :p1 على الأقل.'
    },
    'integer.min_o': {
        en: 'The :fn must be greater than :p1.',
        ar: ' يجب أن يكون :fn أكبر من :p1.'
    },
    'integer.max_i': {
        en: 'The :fn may not be greater than :p1.',
        ar: 'يجب أن يكون :fn :p1 على الأكثر.'
    },
    'integer.max_o': {
        en: 'The :fn must be less than :p1.',
        ar: 'يجب أن يكون :fn أقل من :p1.'
    },
    'integer.range': {
        en: 'The :fn must be between :p1 and :p2.',
        ar: 'يجب أن يكون :fn بين :p1 و :p2.'
    },
    'integer.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },
    'integer.not': {
        en: 'The :fn is invalid.',
        ar: ':fn غير صالح.'
    },


    'float.float': {
        en: 'The :fn must be a float number.',
        ar: 'يجب أن يكون :fn رقم صحيح.'
    },
    'float.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'float.positive': {
        en: 'The :fn must be positive number.',
        ar: 'يجب أن يكون :fn رقم صحيح موجب.'
    },
    'float.negative': {
        en: 'The :fn must be negative number.',
        ar: 'يجب أن يكون :fn رقم صحيح سالب.'
    },
    'float.min_i': {
        en: 'The :fn must be less than or equal to :p1.',
        ar: ' يجب أن يكون :fn :p1 على الأقل.'
    },
    'float.min_o': {
        en: 'The :fn must be greater than :p1.',
        ar: ' يجب أن يكون :fn أكبر من :p1.'
    },
    'float.max_i': {
        en: 'The :fn may not be greater than :p1.',
        ar: 'يجب أن يكون :fn :p1 على الأكثر.'
    },
    'float.max_o': {
        en: 'The :fn must be less than :p1.',
        ar: 'يجب أن يكون :fn أقل من :p1.'
    },
    'float.range': {
        en: 'The :fn must be between :p1 and :p2.',
        ar: 'يجب أن يكون :fn بين :p1 و :p2.'
    },
    'float.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },
    'float.not': {
        en: 'The :fn is invalid.',
        ar: ':fn غير صالح.'
    },
    'string.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'string.of': {
        en: 'The :fn contains unacceptable character(s).',
        ar: ':fn يحوي رموز غير صالحة.'
    },
    'string.not_of': {
        en: 'The :fn contains unacceptable character(s).',
        ar: ':fn يحوي رموز غير صالحة.'
    },
    'string.min_i': {
        en: 'The :fn must be :p1 character(s) at least.',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل.'
    },
    'string.min_o': {
        en: 'The :fn must be more than :p1 character(s).',
        ar: 'يجب أن يكون :fn أكثر من :p1 محرف.'
    },
    'string.max_i': {
        en: 'The :fn may not contain more than :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر.'
    },
    'string.max_o': {
        en: 'The :fn must be less than :p1 character(s).',
        ar: 'يجب أن يكون :fn أقل من :p1 محرف.'
    },
    'string.range': {
        en: 'The :fn must be between :p1 and :p2 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف.'
    },
    'string.len': {
        en: 'The :fn must be :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف.'
    },
    'string.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },
    'string.not': {
        en: 'The :fn is invalid.',
        ar: ':fn غير صالح.'
    },

    'check.required': {
        en: 'Please choose :fn.',
        ar: 'يرجى اختيار :fn.'
    },

    'timeline.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'timeline.format': {
        en: 'The :fn is not in the correct format: :p1.',
        ar: ':fn ليس بالتنسيق المطلوب: :p1.'
    },
    'timeline.min_i': {
        en: 'The :fn must be a date after or equal to :p1.',
        ar: ' يجب أن يكون :fn أكبر من أو يساوي :p1.'
    },
    'timeline.min_o': {
        en: 'The :fn must be a date after :p1.',
        ar: ' يجب أن يكون :fn أكبر من :p1.'
    },
    'timeline.max_i': {
        en: 'The :fn must be a date before or equal to :p1.',
        ar: ' يجب أن يكون :fn أصغر من أو يساوي :p1.'
    },
    'timeline.max_o': {
        en: 'The :fn must be a date before :p1.',
        ar: ' يجب أن يكون :fn أصغر من :p1.'
    },
    'timeline.range': {
        en: 'The :fn must be between :p1 and :p2.',
        ar: 'يجب أن يكون :fn بين :p1 و :p2.'
    },
    'timeline.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },

    'email.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'email.email': {
        en: 'The :fn must be a valid email address.',
        ar: ':fn غير صالح.'
    },
    'email.min_i': {
        en: 'The :fn must be :p1 character(s) at least.',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل.'
    },
    'email.min_o': {
        en: 'The :fn must be more than :p1 character(s).',
        ar: 'يجب أن يكون :fn أكثر من :p1 محرف.'
    },
    'email.max_i': {
        en: 'The :fn may not contain more than :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر.'
    },
    'email.max_o': {
        en: 'The :fn must be less than :p1 character(s).',
        ar: 'يجب أن يكون :fn أقل من :p1 محرف.'
    },
    'email.range': {
        en: 'The :fn must be between :p1 and :p2 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف.'
    },
    'email.in_domain': {
        en: 'The :fn must be in these domains: :p1.',
        ar: 'يجب أن يكون :fn ضمن النطاقات التالية: :p1.'
    },
    'email.not_in_domain': {
        en: 'The :fn may not be in these domains: :p1.',
        ar: 'يجب أن يكون :fn خارج النطاقات التالية: :p1.'
    },
    'email.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },

    'url.url': {
        en: 'The :fn must be a valid url.',
        ar: ':fn غير صالح.'
    },
    'url.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'url.min_i': {
        en: 'The :fn must be :p1 character(s) at least.',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل.'
    },
    'url.min_o': {
        en: 'The :fn must be more than :p1 character(s).',
        ar: 'يجب أن يكون :fn أكثر من :p1 محرف.'
    },
    'url.max_i': {
        en: 'The :fn may not contain more than :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر.'
    },
    'url.max_o': {
        en: 'The :fn must be less than :p1 character(s).',
        ar: 'يجب أن يكون :fn أقل من :p1 محرف.'
    },
    'url.range': {
        en: 'The :fn must be between :p1 and :p2 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف.'
    },
    'url.in_domain': {
        en: 'The :fn must be in these domains: :p1.',
        ar: 'يجب أن يكون :fn ضمن النطاقات التالية: :p1.'
    },
    'url.not_in_domain': {
        en: 'The :fn may not be in these domains: :p1.',
        ar: 'يجب أن يكون :fn خارج النطاقات التالية: :p1.'
    },
    'url.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
    },

    'in.items': {
        en: 'The :fn is invalid.',
        ar: ':fn غير صالح.'
    },
    'in.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },

    'file.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'file.min_i': {
        en: 'The :fn must be at least :p1MB in total.',
        ar: 'يجب أن يكون اجمالي حجم الملفات في :fn :p1MB على الأقل.'
    },
    'file.min_o': {
        en: 'The :fn must be larger than :p1MB in total.',
        ar: 'يجب أن يكون اجمالي حجم الملفات في :fn أكبر من :p1MB.'
    },
    'file.max_i': {
        en: 'The :fn may not be greater than :p1MB in total.',
        ar: 'يجب أن يكون اجمالي حجم الملفات في :fn :p1MB على الأكثر.'
    },
    'file.max_o': {
        en: 'The :fn may not be greater than :p1MB in total.',
        ar: 'يجب أن يكون اجمالي حجم الملفات في :fn أقل من :p1MB.'
    },
    'file.range': {
        en: 'The :fn must be between :p1MB and :p2MB in total.',
        ar: 'يجب أن يكون اجمالي حجم الملفات في :fn من :p1MB إلى :p2MB.'
    },
    'file.s_min_i': {
        en: 'Each file in :fn must be at least :p1MB in total.',
        ar: 'يجب أن يكون حجم الملف الواحد في :fn :p1MB على الأقل.'
    },
    'file.s_min_o': {
        en: 'Each file in :fn must be larger than :p1MB in total.',
        ar: 'يجب أن يكون حجم الملف الواحد في :fn أكبر من :p1MB.'
    },
    'file.s_max_i': {
        en: 'Each file in :fn may not be greater than :p1MB in total.',
        ar: 'يجب أن يكون حجم الملف الواحد في :fn :p1MB على الأكثر.'
    },
    'file.s_max_o': {
        en: 'The :fn may not be greater than :p1MB in total.',
        ar: 'يجب أن يكون حجم الملف الواحد في :fn أقل من :p1MB.'
    },
    'file.s_range': {
        en: 'Each file in :fn must be between :p1MB and :p2MB.',
        ar: 'يجب أن يكون حجم الملف الواحد في :fn من :p1MB إلى :p2MB.'
    },
    'file.ext': {
        en: 'The :fn file(s) must be one of these formats: :p1.',
        ar: 'يجب أن تكون كل الملفات في :fn بأحد الصيغ التالية: :p1.'
    },
    'file.len': {
        en: 'The :fn may have :p1 file(s).',
        ar: 'يجب أن يحوي :fn على :p1 ملف (ملفات).'
    },

    'regex.required': {
        en: 'The :fn is required.',
        ar: 'لا يجوز ترك :fn فارغ.'
    },
    'regex.pattern': {
        en: 'The :fn is not valid.',
        ar: ':fn غير صالح.'
    },
    'regex.min_i': {
        en: 'The :fn must be :p1 character(s) at least.',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأقل.'
    },
    'regex.min_o': {
        en: 'The :fn must be more than :p1 character(s).',
        ar: 'يجب أن يكون :fn أكثر من :p1 محرف.'
    },
    'regex.max_i': {
        en: 'The :fn may not contain more than :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف على الأكثر.'
    },
    'regex.max_o': {
        en: 'The :fn must be less than :p1 character(s).',
        ar: 'يجب أن يكون :fn أقل من :p1 محرف.'
    },
    'regex.range': {
        en: 'The :fn must be between :p1 and :p2 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 إلى :p2 محرف.'
    },
    'regex.len': {
        en: 'The :fn must be :p1 character(s).',
        ar: 'يجب أن يكون :fn بطول :p1 محرف.'
    },
    'regex.confirmed': {
        en: 'The :fn confirmation does not match.',
        ar: 'تأكيد :fn غير مطابق.'
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
        def: 'Spacer Error: Unsupported string type: :p.'
    },
    'ex.pmr': {
        def: 'Spacer Error: The validation pattern :p misses a required rule: :r.'
    },
    'ex.usp': {
        def: 'Spacer Error: Unsupported pattern: :p.'
    },
    'ex.se': {
        def: 'Spacer Error: Syntax error: :p.'
    },
    'ex.inf': {
        def: 'Spacer Error: Invalid parameter for :p.:r rule: input with name :n not found.'
    },
    'ex.ipc': {
        def: 'Spacer Error: The validation rule :p.:r misses some parameters.'
    },
    'ex.ipt': {
        def: 'Spacer Error: Invalid parameter for :p.:r rule: :a.'
    },
    'ex.pfnf': {
        def: 'Spacer Error: pre function not found: :p.'
    },
    'ex.rnf': {
        def: 'Spacer Error: No such a rule: :p.:r'
    },
    'ex.mnf': {
        def: 'Spacer Error: Error message not found for :p.:r'
    },
    'ex.ddnf': {
        def: 'Spacer Error: Dialog driver :p or one of its functions not found.'
    },
    'ex.vdnf': {
        def: 'Spacer Error: Validation driver :p or one of its functions not found.'
    },
    'ex.fdnf': {
        def: 'Spacer Error: Flash driver :p not found.'
    },
    'ex.fnf': {
        def: 'Spacer Error: Form not found.'
    },
    'ex.fosnf': {
        def: 'Spacer Error: Form or submitter not found.'
    }
};

export default resources;
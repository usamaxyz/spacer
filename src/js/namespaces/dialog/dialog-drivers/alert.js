let alert = {
    message: function (title, msg, status, icon, fn) {
        window.alert(title + "\n" + msg);
        if (fn) fn();
    },
    confirm: function (title, msg, status, icon, fn1, fn2) {
        if (window.confirm(title + "\n" + msg))
            if (fn1) fn1();
            else if (fn2) fn2();
    },
    prompt: function (title, msg, status, icon, fn1, fn2) {
        let result = window.prompt(title + "\n" + msg);
        if (result === null)
            if (fn2) fn2();
            else if (fn1) fn1(result);
    }
};

export default alert
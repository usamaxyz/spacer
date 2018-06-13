let util = {
    randomString: function (length, num, small, capital) {
        let charset = undefined,
            retVal = "";
        if (!num && !capital && !small)
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        else {
            if (small)
                charset = "abcdefghijklmnopqrstuvwxyz";
            if (capital)
                charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (num)
                charset += "0123456789";
        }

        for (let i = 0, n = charset.length; i < length; ++i)
            retVal += charset.charAt(Math.floor(Math.random() * n));
        return retVal;
    },
    debounce: function (delay, fn) {
        let timeout, immediate = undefined;
        let d = function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            let callNow = immediate && !timeout;
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
    timer: function (interval, fn) {
        return setInterval(fn, interval);
    },
    cancelTimer: function (id) {
        clearInterval(id);
    },
    executeLater: function (delay, fn) {
        return setTimeout(fn, delay);
    },
    cancelExecuteLater: function (id) {
        clearTimeout(id);
    }
};

export default util
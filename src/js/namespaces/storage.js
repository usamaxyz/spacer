let storage = {
    length: function () {
        localStorage.length;
    },
    set: function (key, value) {
        localStorage.setItem(key, value);
    },
    get: function (key) {
        localStorage.getItem(key);
    },
    remove: function (key) {
        localStorage.removeItem(key);
    },
    getAll: function () {
        return localStorage;
    },
    removeAll: function () {
        localStorage.clear();
    }
};

export default storage
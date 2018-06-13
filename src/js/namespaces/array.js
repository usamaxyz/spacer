import basicValidators from './validation/basic-validators'

let _array = {
    insertLast: function (array, item) {
        return array.push(item);
    },
    insertFirst: function (array, item) {
        return array.unshift(item);
    },
    insertAt: function (array, index, item) {
        array.splice(index, 0, item);
        return array.length;
    },
    removeLast: function (array) {
        return array.pop();
    },
    removeFirst: function (array) {
        return array.shift();
    },
    removeAt: function (array, index) {
        let item = array[index];
        array.splice(index, 1);
        return item;
    },
    removeWhere: function (array, fn) {
        for (let i = array.length - 1; i >= 0; i--)
            if (fn(array[i], i) === true)
                _array.removeAt(array, i);
    },
    searchGetBool: function (array, fn) {
        for (let i = 0, l = array.length; i < l; i++)
            if (fn(array[i], i) === true)
                return true;
        return false;
    },
    searchGetIndex: function (array, fn) {
        for (let i = 0, l = array.length; i < l; i++)
            if (fn(array[i], i) === true)
                return i;
        return -1;
    },
    searchGetItem: function (array, fn) {
        for (let i = 0, l = array.length; i < l; i++)
            if (fn(array[i], i) === true)
                return array[i];
        return undefined;
    },
    foreach: function (enumerable, fn) {
        if (basicValidators.isArray(enumerable)) {
            for (let i = 0, l = enumerable.length; i < l; i++)
                if (fn(enumerable[i], i) === false)
                    break;
        }
        else
            for (let key in enumerable) {
                if (enumerable.hasOwnProperty(key)) {
                    if (fn(enumerable[key], key) === false)
                        break;
                }
            }
    },
    foreachReversed: function (array, fn) {
        for (let i = array.length - 1; i >= 0; i--)
            if (fn(array[i], i) === false)
                break;
    },
    toString: function (array) {
        return '[' + array.join(', ') + ']';
    },
    copy: function (array) {
        return $.extend(true, [], array);
    }
};

export default _array
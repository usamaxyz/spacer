import config from './config'

let basic = {
    sis(s) {
        return (s instanceof $) ? s : $(s);
    },
    trim(v, force) {
        if (config.trimValues || force)
            return v ? v.trim() : '';

        return v ? v : '';
    }
};

export default basic
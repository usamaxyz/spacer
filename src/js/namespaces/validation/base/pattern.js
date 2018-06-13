import config from "../../../config";

class Pattern {

    constructor(patternStr) {
        this._string = patternStr;
        this._type = -1;
        this._name = undefined;
        this._rules = [];
        this._isLite = config.validationIsLite;
        //Rule
        this._timelineFormat = undefined;
        //Rule
        this._required = undefined;
        this._pre = [];
        this._invalidRules = [];
    }

    get string() {
        return this._string;
    }

    set string(value) {
        return this._string = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get rules() {
        return this._rules;
    }

    set rules(value) {
        return this._rules = value;
    }

    get isLite() {
        return this._isLite;
    }

    set isLite(value) {
        this._isLite = value;
    }

    get timelineFormat() {
        return this._timelineFormat;
    }

    set timelineFormat(value) {
        this._timelineFormat = value;
    }

    get required() {
        return this._required;
    }

    set required(value) {
        this._required = value;
    }

    get pre() {
        return this._pre;
    }

    set pre(value) {
        this._pre = value;
    }

    get invalidRules() {
        return this._invalidRules;
    }

    set invalidRules(value) {
        this._invalidRules = value;
    }
}
export default Pattern
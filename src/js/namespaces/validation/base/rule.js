import RuleTypes from "./constants/RuleTypes";

class Rule {

    constructor(name, params) {
        this._params = params;
        this._type = RuleTypes[name];
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get params() {
        return this._params;
    }

    set params(value) {
        this._params = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
}

export default Rule
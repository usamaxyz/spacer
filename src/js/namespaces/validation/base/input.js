import dom from "../../dom";

class Input {
    constructor(jqueryObj) {
        this._jquery = jqueryObj;
        this._name = jqueryObj.attr('name');

        this._friendlyName = dom.getFriendlyName(jqueryObj);

        //evaluated on every validation
        this._originalValue = '';
        this._valueToValidate = '';
    }

    get jquery() {
        return this._jquery;
    }

    set jquery(value) {
        return this._jquery = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        return this._name = value;
    }

    get friendlyName() {
        return this._friendlyName;
    }

    set friendlyName(value) {
        this._friendlyName = value;
    }

    get originalValue() {
        return this._originalValue;
    }

    set originalValue(value) {
        this._originalValue = value;
    }

    get valueToValidate() {
        return this._valueToValidate;
    }

    set valueToValidate(value) {
        this._valueToValidate = value;
    }
}

export default Input
import Input from "./input";
import Pattern from "./pattern";

class ValidationEntry {

    constructor(jqueryObj, patternStr) {
        this._input = new Input(jqueryObj);
        this._confirmInput = undefined;
        this._pattern = new Pattern(patternStr);
    }

    /**
     *
     * @returns {Input}
     */
    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }

    /**
     *
     * @returns {Input}
     */
    get confirmInput() {
        return this._confirmInput;
    }

    set confirmInput(value) {
        this._confirmInput = value;
    }

    /**
     *
     * @return {Pattern|*}
     */
    get pattern() {
        return this._pattern;
    }

    set pattern(value) {
        this._pattern = value;
    }
}

export default ValidationEntry
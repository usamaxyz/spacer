/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************************************!*\
  !*** ./src/js/services/bootstrap4-validation-driver.js ***!
  \*********************************************************/
window.bootstrap4ValidationDriver = {
  onError: function onError(vo) {
    var invalidRules = vo.pattern.invalidRules;
    var helpBlock = vo.input.jquery.addClass('is-invalid').closest('[class*="form-group"]').find('.invalid-feedback');

    if (helpBlock.length !== 0) {
      var html = '';
      if (invalidRules.length === 1) html = invalidRules[0].message;else {
        html = '<ul>';

        for (var i = 0, l = invalidRules.length; i < l; i++) {
          html = html + '<li>' + invalidRules[i].message + '</li>';
        }

        html = html + '</ul>';
      }
      helpBlock.html(html).addClass('d-block');
    }

    if (vo.confirmInput) {
      var found = false;

      for (var _i = 0, _l = invalidRules.length; _i < _l; _i++) {
        if (invalidRules[_i].type === spa.ruleTypes.confirmed) {
          found = true;
          break;
        }
      }

      if (found) vo.confirmInput.jquery.addClass('is-invalid');
    }
  },
  clearError: function clearError(inputJq) {
    inputJq.removeClass('is-invalid').closest('[class*="form-group"]').find('.invalid-feedback').removeClass('d-block').html(''); //confirm input

    var ci = inputJq.data('_spa-ci');
    if (ci) ci.removeClass('is-invalid');
  }
};
/******/ })()
;
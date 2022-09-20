/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./src/js/services/storage.js ***!
  \************************************/
window.storage = {
  length: function length() {
    localStorage.length;
  },
  set: function set(key, value) {
    localStorage.setItem(key, value);
  },
  get: function get(key) {
    localStorage.getItem(key);
  },
  remove: function remove(key) {
    localStorage.removeItem(key);
  },
  getAll: function getAll() {
    return localStorage;
  },
  removeAll: function removeAll() {
    localStorage.clear();
  }
};
/******/ })()
;
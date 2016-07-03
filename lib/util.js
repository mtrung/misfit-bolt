"use strict";

function isOn (value) {
  var str = ',0';
  return value.substr(value.length - str.length, str.length) !== str;
}

function assert (condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFunction(fn, message) {
  assert(typeof fn === 'function', `${fn} should be a function`);
}

module.exports = {isOn, assert, assertFunction};

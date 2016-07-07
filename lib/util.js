"use strict";

function assert (condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFunction(fn, message) {
  assert(typeof fn === 'function', `${fn} should be a function`);
}

function valid (property, value, max) {
  assert(value >= 0 && value <= max, `${property} should be an integer between 0 and ${max}. got ${value}.`);
}

module.exports = {assert, assertFunction, valid};

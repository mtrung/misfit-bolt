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

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
const ToLength = argument => {
	const len = Number(argument);
	if (Number.isNaN(len) || len <= 0) { return 0; }
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};

function padEnd(O, maxLength, fillString) {
  // const O = RequireObjectCoercible(this);
  const S = String(O);
  const intMaxLength = ToLength(maxLength);
  const stringLength = ToLength(S.length);
  if (intMaxLength <= stringLength) { return S; }
  let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
  if (filler === '') { return S; }
  const fillLen = intMaxLength - stringLength;
  while (filler.length < fillLen) {
    const fLen = filler.length;
    const remainingCodeUnits = fillLen - fLen;
    if (fLen > remainingCodeUnits) {
      filler += filler.slice(0, remainingCodeUnits);
    } else {
      filler += filler;
    }
  }
  const truncatedStringFiller = filler.slice(0, fillLen);
  return S + truncatedStringFiller;
};

module.exports = {assert, assertFunction, valid, padEnd};

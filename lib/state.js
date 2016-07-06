"use strict";

const packageName = require('../package').name,
      Color = require('color'),
      util = require('./util'),
      debug = require('debug')(`${packageName}#state`);

const valid = (property, value, max) => {
  util.assert(value >= 0 && value <= max, `${property} should be an integer between 0 and ${max}. got ${value}.`);
  debug(`set ${property} with value ${value}`);
}

class State {

  constructor(id) {
    this.id = id;
    this._buffer = new Buffer('');
    State.states.push(this);
  }

  get buffer() {
    return this._buffer;
  }

  set buffer(buffer) {
    if (!buffer) {
      buffer = "";
    }
    this._buffer = buffer;
  }

  get value() {
    return this._buffer.toString().replace(/,+$/, '').replace(/CLTMP 3200/, '255,255,255');
  }

  set value(value) {
    const length = 18;
    const padding = ','.repeat(length);
    const string = `${value}${padding}`.substring(0, length);
    debug(`set buffer with string ${string}`);
    this._buffer = new Buffer(string);
  }

  get color() {
    return new Color(`rgba(${this.value})`);
  }

  set color(color) {
    const rgb = color.rgb(),
          rgba = [rgb.r, rgb.g, rgb.b, color.alpha() * 100],
          value = rgba.join(',');

    debug(`set value with value ${value}`);
    this.value = value;
  }

  get rgba() {
    return [
      this.red,
      this.green,
      this.blue,
      this.alpha
    ];
  }

  set rgba(rgba) {
    debug(`set rgba with value ${rgba}`);
    this.red = rgba[0];
    this.green = rgba[1];
    this.blue = rgba[2];
    this.alpha = rgba[3];
  }

  get red() {
    return this.color.red();
  }

  set red(red) {
    valid('red', red, 255);
    this.color = this.color.red(red);
  }

  get green() {
    return this.color.green();
  }

  set green(green) {
    valid('green', green, 255);
    this.color = this.color.green(green);
  }

  get blue() {
    return this.color.blue();
  }

  set blue(blue) {
    valid('blue', blue, 255);
    this.color = this.color.blue(blue);
  }

  get alpha() {
    return this.color.alpha() * 100;
  }

  set alpha(alpha) {
    valid('alpha', alpha, 100);
    this.color = this.color.alpha(alpha / 100);
  }

  get hsb() {
    return [
      this.hue,
      this.saturation,
      this.brightness
    ];
  }

  set hsb(hsb) {
    debug(`set hsb with value ${hsb}`);
    this.hue = hsb[0];
    this.saturation = hsb[1];
    this.brightness = hsb[2];
  }

  get hue() {
    return this.color.hue();
  }

  set hue(hue) {
    valid('hue', hue, 360);
    this.color = this.color.hue(hue);
  }

  get saturation() {
    return this.color.saturation();
  }

  set saturation(saturation) {
    valid('saturation', saturation, 100);
    this.color = this.color.saturationv(saturation);
  }

  get brightness() {
    return this.alpha();
  }

  set brightness(brightness) {
    this.alpha = brightness;
  }

  static getState(id) {
    let state = State.states.filter((state) => {
      return state.id === id;
    })[0];
    return state ? state : new State(id);
  }

}

State.states = [];

module.exports = State;

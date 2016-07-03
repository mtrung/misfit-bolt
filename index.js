"use strict";

const debug = require('debug')(require('./package').name),
      State = require('./lib/state'),
      NobleDevice = require('noble-device'),
      util = require('./lib/util'),
      isOn = util.isOn,
      assertFunction = util.assertFunction;

const SERVICE_UUID = 'fff0',
      CONTROL_UUID = 'fff1',
      EFFECT_UUID = 'fffc',
      ADVERTISEMENT_NAME = 'MFBOLT',
      ON = 'CLTMP 3200,100',
      OFF = 'CLTMP 3200,0',
      GRADUAL_MODE = 'TS',
      NON_GRADUAL_MODE = 'TE',
      DEFAULT_COLOR = 'DF';

const Bolt = function(peripheral) {
  NobleDevice.call(this, peripheral);
  this.state = new State();
  this.id = peripheral.id;
}

Bolt.SCAN_UUIDS = [SERVICE_UUID]

Bolt.is = function(peripheral) {
  const localName = peripheral.advertisement.localName;
  return localName === undefined || localName === ADVERTISEMENT_NAME;
};

Bolt.bolts = [];

NobleDevice.Util.inherits(Bolt, NobleDevice);

Bolt.prototype.onDisconnect = function () {
  debug(`disconnected: ${this.id}`);
  Bolt.remove(this.id);
};

// Bolt.prototype.setGradualMode = function (gradualMode, done) {
//   this.writeServiceStringCharacteristic(EFFECT_UUID, gradualMode ? TS : TE, done);
// };

Bolt.prototype.get = function (done) {
  assertFunction(done);
  debug(`getting characteristic ${CONTROL_UUID} of service ${SERVICE_UUID}`);
  this.readDataCharacteristic(SERVICE_UUID, CONTROL_UUID, (error, buffer) => {
    debug(`got data ${buffer.toString()}`);
    this.state.buffer = buffer;
    done(error, this.state.value);
  });

  return this;
};

Bolt.prototype.set = function (value, done) {
  assertFunction(done);
  this.state.value = value;
  debug(`setting characteristic ${CONTROL_UUID} of service ${SERVICE_UUID} with data ${this.state.buffer}`);
  this.writeDataCharacteristic(SERVICE_UUID, CONTROL_UUID, this.state.buffer, done);
  return this;
};

Bolt.prototype.getRGBA = function (done) {
  assertFunction(done);
  debug(`getting rgba`);
  this.get((error) => {
    debug(`got rgba ${this.state.rgba}`);
    done(error, this.state.rgba);
  });
  return this;
};

Bolt.prototype.setRGBA = function (rgba, done) {
  assertFunction(done);
  debug(`setting rgba with ${rgba}`);
  this.state.rgba = rgba;
  return this.set(this.state.value, done);
};

Bolt.prototype.getHue = function (done) {
  assertFunction(done);
  debug(`getting hue`);
  this.get((error) => {
    debug(`got hue ${this.state.hue}`);
    done(error, this.state.hue);
  });
  return this;
};

Bolt.prototype.setHue = function (hue, done) {
  assertFunction(done);
  debug(`setting hue with ${hue}`);
  this.state.hue = hue;
  return this.set(this.state.value, done);
};

Bolt.prototype.getSaturation = function (done) {
  assertFunction(done);
  debug(`getting saturation`);
  this.get((error) => {
    debug(`got saturation ${this.state.saturation}`);
    done(error, this.state.saturation);
  });
  return this;
};

Bolt.prototype.setSaturation = function (saturation, done) {
  assertFunction(done);
  debug(`setting saturation with ${saturation}`);
  this.state.saturation = saturation;
  return this.set(this.state.value, done);
};

Bolt.prototype.getBrightness = function (done) {
  assertFunction(done);
  debug(`getting brightness`);
  this.get((error) => {
    debug(`got brightness ${this.state.brightness}`);
    done(error, this.state.brightness);
  });
  return this;
};

Bolt.prototype.setBrightness = function (brightness, done) {
  assertFunction(done);
  debug(`setting brightness with ${brightness}`);
  this.state.brightness = brightness;
  return this.set(this.state.value, done);
};

Bolt.prototype.getState = function (done) {
  assertFunction(done);
  debug(`getting state`);
  this.get((error) => {
    const state = isOn(this.state.value);
    debug(`got state ${state}`);
    done(error, state);
  });
};

Bolt.prototype.setState = function (state, done) {
  assertFunction(done);
  debug(`setting state with ${state}`);
  return this.set(state ? ON : OFF, done);
};

Bolt.prototype.toggleOff = function (done) {
  assertFunction(done);
  return this.set(OFF, done);
};

Bolt.prototype.toggleOn = function (done) {
  assertFunction(done);
  return this.set(ON, done);
};

function discovered (bolt) {
  debug(`discovered: ${bolt.id}`);
  bolt.connectAndSetup(() => {
    debug(`connected: ${bolt.id}`);
    Bolt.bolts.push(bolt)
  });
}

Bolt.start = function() {
  clearTimeout(Bolt.timer);
  Bolt.stopDiscoverAll(discovered);
  Bolt.timer = setTimeout(() => {
    Bolt.start();
  }, 15000);
  Bolt.discoverAll(discovered);
};

Bolt.get = function(id) {
  return Bolt.bolts.filter((bolt, index) => {
    return bolt.id === id;
  })[0];
};

Bolt.remove = function(id) {
  const bolt = Bolt.get(id);
  const index = Bolt.bolts.indexOf(bolt),
        found = index >= 0;
  if (found) {
    debug(`removed: ${bolt.id}`);
    Bolt.bolts.splice(index, 1);
    Bolt.start();
  }
  return found;
};

module.exports = Bolt;

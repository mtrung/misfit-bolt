"use strict";

/**
 * Module imports
 */

const debug = require('debug')(require('./package').name),
      State = require('./lib/state'),
      NobleDevice = require('noble-device'),
      util = require('./lib/util'),
      isOn = util.isOn,
      assertFunction = util.assertFunction;


/**
 * Constants
 */

const ADVERTISEMENT_NAME = 'MFBOLT',
      SERVICE_UUID = 'fff0',
      CONTROL_UUID = 'fff1',
      EFFECT_UUID = 'fffc',
      NAME_UUID = 'fff8',
      ON = 'CLTMP 3200,100',
      OFF = 'CLTMP 3200,0',
      GRADUAL_MODE = 'TS',
      NON_GRADUAL_MODE = 'TE',
      DEFAULT_COLOR = 'DF',
      DELAYED_PERSIST_MS = 1000;


/**
 * Constructor
 */

const Bolt = function(peripheral) {
  NobleDevice.call(this, peripheral);
  this.id = peripheral.id;
  this.state = State.getState(this.id);
}

NobleDevice.Util.inherits(Bolt, NobleDevice);


/**
 * Public
 */

Bolt.prototype.getRGBA = function (done) {
  assertFunction(done);
  debug(`getting rgba`);
  return this._readStateValue((error) => {
    debug(`got rgba ${this.state.rgba}`);
    done(error, this.state.rgba);
  });
};

Bolt.prototype.setRGBA = function (rgba, done) {
  assertFunction(done);
  debug(`setting rgba with ${rgba}`);
  this.state.rgba = rgba;
  return this._writeStateValue(this.state.value, done);
};

Bolt.prototype.getHue = function (done) {
  assertFunction(done);
  debug(`getting hue`);
  return this._readStateValue((error) => {
    debug(`got hue ${this.state.hue}`);
    done(error, this.state.hue);
  });
};

Bolt.prototype.setHue = function (hue, done) {
  assertFunction(done);
  debug(`setting hue with ${hue}`);
  this.state.hue = hue;
  return this._writeStateValue(this.state.value, done);
};

Bolt.prototype.getSaturation = function (done) {
  assertFunction(done);
  debug(`getting saturation`);
  return this._readStateValue((error) => {
    debug(`got saturation ${this.state.saturation}`);
    done(error, this.state.saturation);
  });
};

Bolt.prototype.setSaturation = function (saturation, done) {
  assertFunction(done);
  debug(`setting saturation with ${saturation}`);
  this.state.saturation = saturation;
  return this._writeStateValue(this.state.value, done);
};

Bolt.prototype.getBrightness = function (done) {
  assertFunction(done);
  debug(`getting brightness`);
  return this._readStateValue((error) => {
    debug(`got brightness ${this.state.brightness}`);
    done(error, this.state.brightness);
  });
};

Bolt.prototype.setBrightness = function (brightness, done) {
  assertFunction(done);
  debug(`setting brightness with ${brightness}`);
  this.state.brightness = brightness;
  return this._writeStateValue(this.state.value, done);
};

Bolt.prototype.getState = function (done) {
  assertFunction(done);
  debug(`getting state`);
  return this._readStateValue((error) => {
    const state = isOn(this.state.value);
    debug(`got state ${state}`);
    done(error, state);
  });
};

Bolt.prototype.setState = function (state, done) {
  assertFunction(done);
  debug(`setting state with ${state}`);
  return this._writeStateValue(state ? ON : OFF, done);
};

Bolt.prototype.getGradualMode = function (done) {
  assertFunction(done);
  debug(`getting gradual mode from state, got ${this.state.gradualMode}`);
  done(undefined, this.state.gradualMode);
  return this;
};

Bolt.prototype.setGradualMode = function (gradualMode, done) {
  assertFunction(done);
  debug(`setting gradual mode with ${gradualMode}`);
  this.state.gradualMode = gradualMode;
  this._write(EFFECT_UUID, new Buffer(gradualMode ? GRADUAL_MODE : NON_GRADUAL_MODE), done);
  return this;
};

Bolt.prototype.getName = function (done) {
  assertFunction(done);
  debug(`getting name`);
  return this._readStateValue((error) => {
    const name = this.state.name;
    debug(`got name ${name}`);
    done(error, name);
  });
};

Bolt.prototype.setName = function (name, done) {
  assertFunction(done);
  debug(`setting name with ${name}`);
  this._write(NAME_UUID, new Buffer(name), done);
};

Bolt.prototype.onDisconnect = function () {
  debug(`disconnected: ${this.id}`);
  Bolt.remove(this.id);
};


/**
 * Private (pseudo)
 */

Bolt.prototype._read = function (characteristic, done) {
  assertFunction(done);
  debug(`getting characteristic ${characteristic} of service ${SERVICE_UUID}`);
  this.readDataCharacteristic(SERVICE_UUID, characteristic, (error, buffer) => {
    debug(`got data ${buffer}`);
    done(error, buffer);
  });

  return this;
};

Bolt.prototype._write = function (characteristic, buffer, done) {
  assertFunction(done);
  debug(`setting characteristic ${characteristic} of service ${SERVICE_UUID} with data ${buffer}`);
  this.writeDataCharacteristic(SERVICE_UUID, characteristic, buffer, done);
  return this;
};

Bolt.prototype._readStateValue = function (done) {
  assertFunction(done);
  debug(`reading state value`);
  this._read(CONTROL_UUID, (error, buffer) => {
    debug(`got data ${buffer}`);
    this.state.buffer = buffer;
    done(error, this.state.value);
  });

  return this;
};

Bolt.prototype._writeStateValue = function (value, done) {
  assertFunction(done);
  this.state.value = value;
  debug(`writing state value with date ${value}`);
  this._write(CONTROL_UUID, this.state.buffer, () => {
    this._delayedPersist();
    done();
  });
  return this;
};

Bolt.prototype._delayedPersist = function () {
  clearTimeout(this.persistTimer);
  this.persistTimer = setTimeout(() => {
    debug(`setting characteristic ${EFFECT_UUID} of service ${SERVICE_UUID} with data ${DEFAULT_COLOR}`);
    this.writeDataCharacteristic(SERVICE_UUID, EFFECT_UUID, new Buffer(DEFAULT_COLOR));
  }, DELAYED_PERSIST_MS);
};


/**
 * Static
 */

Bolt.bolts = [];
Bolt.SCAN_UUIDS = [SERVICE_UUID]

Bolt.init = function() {
  clearTimeout(Bolt.timer);
  Bolt.stopDiscoverAll(Bolt.setup);
  Bolt.timer = setTimeout(() => {
    Bolt.init();
  }, 15000);
  Bolt.discoverAll(Bolt.setup);
};

Bolt.setup = function (bolt) {
  debug(`discovered: ${bolt.id}`);
  bolt.connectAndSetup(() => {
    debug(`connected: ${bolt.id}`);
    Bolt.bolts.push(bolt)
  });
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
    Bolt.init();
  }
  return found;
};

Bolt.is = function(peripheral) {
  return peripheral.advertisement.localName === ADVERTISEMENT_NAME;
};


/**
 * Module exports
 */

module.exports = Bolt;

"use strict";

/**
 * Module imports
 */

const debug = require('debug')(require('./package').name),
      State = require('./lib/state'),
      NobleDevice = require('noble-device'),
      assertFunction = require('./lib/util').assertFunction;


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
      PERSIST_DEFAULT_COLOR = 'DF',
      DELAYED_WRITE_MS = 500,
      DELAYED_PERSIST_MS = 1000,
      DISCOVERY_LOOP_MS = 15000;


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
 * Public Instance Methods
 */

/**
 * Retrieve RGBA values of the bolt
 * @param {Bolt~numbersGetterCallback} done - completion callback
 * @returns {Bolt}
 */

Bolt.prototype.getRGBA = function (done) {
  assertFunction(done);
  debug(`getting rgba`);
  return this._readStateValue((error) => {
    debug(`got rgba ${this.state.rgba}`);
    done(error, this.state.rgba);
  });
};

/**
 * Set RGBA values of the bolt
 * @param {number[]} rgba - Red / Green / Blue / Alpha values
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setRGBA = function (rgba, done) {
  assertFunction(done);
  debug(`setting rgba with ${rgba}`);
  this.state.rgba = rgba;
  return this._writeStateValue(done);
};

/**
 * Retrieve HSB values of the bolt
 * @param {Bolt~numbersGetterCallback} done - completion callback
 * @returns {Bolt}
 */

Bolt.prototype.getHSB = function (done) {
  assertFunction(done);
  debug(`getting hsb`);
  return this._readStateValue((error) => {
    debug(`got hsb ${this.state.hsb}`);
    done(error, this.state.hsb);
  });
};

/**
 * Set HSB values of the bolt
 * @param {number[]} rgba - Red / Green / Blue / Alpha values
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setHSB = function (hsb, done) {
  assertFunction(done);
  debug(`setting rgba with ${hsb}`);
  this.state.hsb = hsb;
  return this._writeStateValue(done);
};

/**
 * Retrieve Hue value of the bolt
 * @param {Bolt~numberGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getHue = function (done) {
  assertFunction(done);
  debug(`getting hue`);
  return this._readStateValue((error) => {
    debug(`got hue ${this.state.hue}`);
    done(error, this.state.hue);
  });
};

/**
 * Set Hue value of the bolt
 * @param {number} hue - Hue value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setHue = function (hue, done) {
  assertFunction(done);
  debug(`setting hue with ${hue}`);
  this.state.hue = hue;
  return this._writeStateValue(done);
};

/**
 * Retrieve Saturation value of the bolt
 * @param {Bolt~numberGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getSaturation = function (done) {
  assertFunction(done);
  debug(`getting saturation`);
  return this._readStateValue((error) => {
    debug(`got saturation ${this.state.saturation}`);
    done(error, this.state.saturation);
  });
};

/**
 * Set Saturation value of the bolt
 * @param {number} saturation - Saturation value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setSaturation = function (saturation, done) {
  assertFunction(done);
  debug(`setting saturation with ${saturation}`);
  this.state.saturation = saturation;
  return this._writeStateValue(done);
};

/**
 * Retrieve Brightness value of the bolt
 * @param {Bolt~numberGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getBrightness = function (done) {
  assertFunction(done);
  debug(`getting brightness`);
  return this._readStateValue((error) => {
    debug(`got brightness ${this.state.brightness}`);
    done(error, this.state.brightness);
  });
};

/**
 * Set Brightness value of the bolt
 * @param {number} brightness - Brightness value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setBrightness = function (brightness, done) {
  assertFunction(done);
  debug(`setting brightness with ${brightness}`);
  this.state.brightness = brightness;
  return this._writeStateValue(done);
};

/**
 * Retrieve State value of the bolt
 * @param {Bolt~booleanGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getState = function (done) {
  assertFunction(done);
  debug(`getting state`);
  return this._readStateValue((error) => {
    debug(`got state ${this.state.state}`);
    done(error, this.state.state);
  });
};

/**
 * Set State value of the bolt
 * @param {boolean} state - State value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setState = function (state, done) {
  assertFunction(done);
  debug(`setting state with ${state}`);
  this.state.state = state;
  return this._writeStateValue(done);
};

/**
 * Retrieve Gradual Mode value of the bolt
 * @param {Bolt~booleanGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getGradualMode = function (done) {
  assertFunction(done);
  debug(`getting gradual mode from state, got ${this.state.gradualMode}`);
  done(undefined, this.state.gradualMode);
  return this;
};

/**
 * Set Gradual Mode value of the bolt
 * @param {boolean} gradualMode - Gradual Mode value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setGradualMode = function (gradualMode, done) {
  assertFunction(done);
  debug(`setting gradual mode with ${gradualMode}`);
  this.state.gradualMode = gradualMode;
  this._write(EFFECT_UUID, new Buffer(gradualMode ? GRADUAL_MODE : NON_GRADUAL_MODE), done);
  return this;
};

/**
 * Retrieve Name value of the bolt
 * @param {Bolt~stringGetterCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.getName = function (done) {
  assertFunction(done);
  debug(`getting name`);
  return this._readStateValue((error) => {
    const name = this.state.name;
    debug(`got name ${name}`);
    done(error, name);
  });
};

/**
 * Set Name value of the bolt
 * @param {string} name - Name value
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype.setName = function (name, done) {
  assertFunction(done);
  debug(`setting name with ${name}`);
  this._write(NAME_UUID, new Buffer(name), done);
};

/**
 * Clean up disconnected bolts from internal registry
 * Automatically called on disconnect event
 */
Bolt.prototype.onDisconnect = function () {
  debug(`disconnected: ${this.id}`);
  Bolt.remove(this.id);
};


/**
 * Private (pseudo) Instance Methods
 */

/**
 * Read specific characteristic of the bolt
 * @param {string} characteristic - UUID of characteristic to read
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype._read = function (characteristic, done) {
  assertFunction(done);
  debug(`getting characteristic ${characteristic} of service ${SERVICE_UUID}`);
  this.readDataCharacteristic(SERVICE_UUID, characteristic, (error, buffer) => {
    if (buffer === undefined) {
      error = new Error("couldn't read buffer value for characteristic ${characteristic} of service ${SERVICE_UUID}");
    }
    debug(`got buffer ${buffer}`);
    done(error, buffer);
  });

  return this;
};

/**
 * Writes value to the bolt
 * @param {string} characteristic - UUID of characteristic to write
 * @param {Buffer} characteristic - Buffer value to write
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype._write = function (characteristic, buffer, done) {
  assertFunction(done);
  debug(`setting characteristic ${characteristic} of service ${SERVICE_UUID} with buffer ${buffer}`);
  this.writeDataCharacteristic(SERVICE_UUID, characteristic, buffer, done);
  return this;
};

/**
 * Read current value of the bolt and update internal state
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype._readStateValue = function (done) {
  assertFunction(done);
  debug(`reading state value`);
  this._read(CONTROL_UUID, (error, buffer) => {
    this.state.buffer = buffer;
    done(error, this.state.value);
  });

  return this;
};

/**
 * Write current internal state value on the bolt.
 * Real write is defered, callback is immediately invoked.
 * @param {Bolt~simpleCallback} done - completion callback
 * @returns {Bolt}
 */
Bolt.prototype._writeStateValue = function (done) {
  done();
  return this._delayedWrite();
};

/**
 * Delays writing to the bolt until DELAYED_WRITE_MS has elapsed.
 * @returns {Bolt}
 */
Bolt.prototype._delayedWrite = function () {
  clearTimeout(this.writeTimer);
  this.writeTimer = setTimeout(() => {
    debug(`writing state value with value ${this.state.value}`);
    this._write(CONTROL_UUID, this.state.buffer, () => {
      this._delayedPersist();
    });
  }, DELAYED_WRITE_MS);
  return this;
};

/**
 * Delays saving default value set to the bolt until DELAYED_PERSIST_MS has elapsed.
 * This essentially allows remembering the last value set if the bolt if physically turned off / unplugged.
 * @returns {Bolt}
 */
Bolt.prototype._delayedPersist = function () {
  clearTimeout(this.persistTimer);
  this.persistTimer = setTimeout(() => {
    debug(`setting characteristic ${EFFECT_UUID} of service ${SERVICE_UUID} with data ${PERSIST_DEFAULT_COLOR}`);
    this.writeDataCharacteristic(SERVICE_UUID, EFFECT_UUID, new Buffer(PERSIST_DEFAULT_COLOR));
  }, DELAYED_PERSIST_MS);
  return this;
};


/**
 * Public Static Methods
 */

/**
 * Used by Noble Device to detect bolt from other BLE devices.
 */
Bolt.SCAN_UUIDS = [SERVICE_UUID]

/**
 * Internal registry to keep track of currently discovered and connected bolts.
 */
Bolt.bolts = [];

/**
 * Counter for discover loop. Useful for debugging purposes mostly.
 */
Bolt.loopCount = 0;

/**
 * Starts the discovery loop.
 * Loop consist in stopping and starting the Bolt discovery process every DISCOVERY_LOOP_MS.
 * This is to paliate a potential issue with Noble device that becomes stale after a few hours
 * and loose connection with connected bolt / stop detecting previously disconnected bolts.
 */
Bolt.init = function() {
  this.loopCount ++;
  debug(`loop: ${Bolt.loopCount}`);
  clearTimeout(Bolt.timer);
  Bolt.stopDiscoverAll(Bolt._setup);
  Bolt.timer = setTimeout(() => {
    Bolt.init();
  }, DISCOVERY_LOOP_MS);
  Bolt.discoverAll(Bolt._setup);
};

/**
 * Retrieve an bolt from internal registry.
 * @param {string} id - bolt identifier
 * @returns {Bolt?}
 */
Bolt.get = function(id) {
  return Bolt.bolts.filter((bolt, index) => {
    return bolt.id === id;
  })[0];
};

/**
 * Remove an bolt from internal registry.
 * @param {string} id - bolt identifier
 * @returns {boolean}
 */
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

/**
 * Indicate if a BLE peripheral is a bolt.
 * Used by Noble Device during detection process.
 * @param {Noble~Peripheral} peripheral - Noble peripheral object
 * @returns {boolean}
 */
Bolt.is = function(peripheral) {
  return peripheral.advertisement.localName === ADVERTISEMENT_NAME;
};


/**
 * Private (pseudo) Static Methods
 */

/**
 * Callback used by discoverAll / stopDiscoverAll Noble device helpers.
 * Initialize the internal state representation of the bolt.
 * Keep track of newly discovered bolts in internal registry.
 */
Bolt._setup = function (bolt) {
  debug(`discovered: ${bolt.id}`);
  bolt.connectAndSetup(() => {
    bolt.getRGBA((error) => {
      if (error) {
        Bolt.init();
      } else {
        debug(`ready: ${bolt.id}`);
        Bolt.bolts.push(bolt)
      }
    });
  });
};


/**
 * Module exports
 */

module.exports = Bolt;


/**
 * Callbacks documentation
 */

/**
 * Simple completion callback
 * @callback Bolt~simpleCallback
 * @param {?error} Error while performing async operation
 */

/**
 * Numbers getter completion callback
 * @callback Bolt~numbersGetterCallback
 * @param {?error} Error while performing async operation
 * @param {?number[]} Value retrieved
 */

/**
 * Number getter completion callback
 * @callback Bolt~numberGetterCallback
 * @param {?error} Error while performing async operation
 * @param {?number} Value retrieved
 */

/**
 * Boolean getter completion callback
 * @callback Bolt~booleanGetterCallback
 * @param {?error} Error while performing async operation
 * @param {?boolean} Value retrieved
 */

/**
 * String getter completion callback
 * @callback Bolt~stringGetterCallback
 * @param {?error} Error while performing async operation
 * @param {?string} Value retrieved
 */
 
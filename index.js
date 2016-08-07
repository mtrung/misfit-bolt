"use strict";

// Module Imports
const debug = require('debug')(require('./package').name),
      State = require('./lib/state'),
      NobleDevice = require('noble-device'),
      assertFunction = require('./lib/util').assertFunction;


// Constants
const ADVERTISEMENT_NAME = 'MFBOLT',
      SERVICE_UUID = 'fff0',
      CONTROL_UUID = 'fff1',
      COLOR_FLOW_CHARID = 'fff7',

      FW_VER_UUID = 'fffd',

      NAME_UUID = 'fff8',
      NAME_NOTIFY_CHARID = 'fff9',
      NAME_QUERY = 'NF,,,,,,,,,,,,,',
      NAME_END   = 'NEND',//'NEND,,,,,,,,,,,',
      NAME_START = 'N 0',

      EFFECT_UUID = 'fffc',
      GRADUAL_MODE = 'TS',
      NON_GRADUAL_MODE = 'TE',
      PERSIST_DEFAULT_COLOR = 'DF',

      DELAYED_WRITE_MS = 500,
      DELAYED_PERSIST_MS = 1000,
      DISCOVERY_LOOP_MS = 15000;


/** @namespace */
const Bolt = function(peripheral) {
  NobleDevice.call(this, peripheral);
  this.id = peripheral.id;
  this.state = State.getState(this.id);
};

NobleDevice.Util.inherits(Bolt, NobleDevice);

/**
 * Retrieve Red, Green, Blue and Alpha values of the bolt in the form of an Array of Integers.
 * @example
 * bolt.getRGBA(function(error, rgba) {
 *   console.log('Current RGBA values are: ', rgba);
 * });
 *
 * @param {Function} done - completion callback
 * @param {NumbersGetterCallback} done - completion callback
 * @returns {Bolt}
 * @memberof Bolt
 * @public
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
 * Set RGBA values of the bolt.
 * @example
 * bolt.setRGBA([255, 0, 0, 10], function(error) {
 *   console.log('Bolt now set to red !');
 * });
 * @param {Array<number>} rgba - Red (0 to 255) / Green (0 to 255) / Blue (0 to 255) / Alpha (0 to 100) values
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setRGBA = function (rgba, done) {
  debug(`setting rgba with ${rgba}`);
  this.state.rgba = rgba;
  return this._writeStateValue(done);
};


/**
 * Retrieve Hue, Saturation and Brightness values of the bolt in the form of an Array of Integers.
 * @example
 * bolt.getHSB(function(error, hsb) {
 *   console.log('Current HSB values are: ', hsb);
 * });
 * @param {NumbersGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */

Bolt.prototype.getHSB = function (done) {
  debug(`getting hsb`);
  return this._readStateValue((error) => {
    debug(`got hsb ${this.state.hsb}`);
    done(error, this.state.hsb);
  });
};


/**
 * Set HSB values of the bolt.
 * @example
 * bolt.setHSB([0, 100, 10], function(error) {
 *   console.log('Bolt now set to red !');
 * });
 * @param {Array<number>} rgba - Hue (0 to 360) / Saturation (0 to 100) / Brightness (0 to 100) values
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setHSB = function (hsb, done) {
  debug(`setting rgba with ${hsb}`);
  this.state.hsb = hsb;
  return this._writeStateValue(done);
};


/**
 * Retrieve Hue value of the bolt.
 * @example
 * bolt.getHSB(function(error, hue) {
 *   console.log('Current Hue value is: ', hue);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getHue = function (done) {
  debug(`getting hue`);
  return this._readStateValue((error) => {
    debug(`got hue ${this.state.hue}`);
    done(error, this.state.hue);
  });
};


/**
 * Set Hue value of the bolt.
 * @example
 * bolt.setHue(10, function(error) {
 *   console.log('Hue is now set to 10');
 * });
 * @param {number} hue - Hue value (0 to 360)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setHue = function (hue, done) {
  debug(`setting hue with ${hue}`);
  this.state.hue = hue;
  return this._writeStateValue(done);
};


/**
 * Retrieve Saturation value of the bolt.
 * @example
 * bolt.getSaturation(function(error, saturation) {
 *   console.log('Current Saturation value is: ', saturation);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getSaturation = function (done) {
  debug(`getting saturation`);
  return this._readStateValue((error) => {
    debug(`got saturation ${this.state.saturation}`);
    done(error, this.state.saturation);
  });
};


/**
 * Set Saturation value of the bolt.
 * @example
 * bolt.setSaturation(10, function(error) {
 *   console.log('Saturation is now set to 10');
 * });
 * @param {number} saturation - Saturation value (0 to 100)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setSaturation = function (saturation, done) {
  debug(`setting saturation with ${saturation}`);
  this.state.saturation = saturation;
  return this._writeStateValue(done);
};


/**
 * Retrieve Brightness value of the bolt.
 * @example
 * bolt.getBrightness(function(error, brightness) {
 *   console.log('Current Brightness value is: ', brightness);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getBrightness = function (done) {
  debug(`getting brightness`);
  return this._readStateValue((error) => {
    debug(`got brightness ${this.state.brightness}`);
    done(error, this.state.brightness);
  });
};


/**
 * Set Brightness value of the bolt.
 * @example
 * bolt.setBrightness(10, function(error) {
 *   console.log('Brightness is now set to 10');
 * });
 * @param {number} brightness - Brightness value (0 to 100)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setBrightness = function (brightness, done) {
  debug(`setting brightness with ${brightness}`);
  this.state.brightness = brightness;
  return this._writeStateValue(done);
};


/**
 * Retrieve State value of the bolt.
 * @example
 * bolt.getState(function(error, state) {
 *   console.log(`Bolt is ${state ? 'on' : 'off'}`);
 * });
 * @param {BooleanGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getState = function (done) {
  debug(`getting state`);
  return this._readStateValue((error) => {
    debug(`got state ${this.state.state}`);
    done(error, this.state.state);
  });
};

/**
 * Set State value of the bolt.
 * @example
 * bolt.setState(true, function(error) {
 *   console.log(`Bolt is now on !`);
 * });
 * @param {boolean} state - State value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setState = function (state, done) {
  debug(`setting state with ${state}`);
  this.state.state = state;
  return this._writeStateValue(done);
};


/**
 * Retrieve Gradual Mode value of the bolt. Indicates whether transition between states is progressive or immediate.
 * @see http://www.yeelight.com/download/yeelight_blue_message_interface_v1.0.pdf
 * @param {BooleanGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getGradualMode = function (done) {
  assertFunction(done);
  debug(`getting gradual mode from state, got ${this.state.gradualMode}`);
  done(undefined, this.state.gradualMode);
  return this;
};

/**
 * Set Gradual Mode value of the bolt.
 * @param {boolean} gradualMode - Gradual Mode value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setGradualMode = function (gradualMode, done) {
  debug(`setting gradual mode with ${gradualMode}`);
  this.state.gradualMode = gradualMode;
  this.setEffectSetting(gradualMode ? GRADUAL_MODE : NON_GRADUAL_MODE, done);
  return this;
};

Bolt.prototype.readEffectSetting = function (done) {
  debug('read effectSetting');
  this._read(EFFECT_UUID, (error, buffer) => {
      if (error || !buffer) {
        return done(error);
      }
      this.state.gradualMode = (buffer.toString() === GRADUAL_MODE);
      done(undefined, buffer.toString());
  }, true);
  return this;
};

Bolt.prototype.setEffectSetting = function (effectSetting, done) {
  debug(`effectSetting -> ${effectSetting}`);
  this._write(EFFECT_UUID, new Buffer(effectSetting), done);
  return this;
};


/**
 * Retrieve Name value of the bolt (as visible by the Bluetooth client).
 * @param {StringGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getName = function (done) {
  assertFunction(done);
  done(undefined, this.name);
  return this;
};


/**
 * Set Name value of the bolt.
 * @param {string} name - Name value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setName = function (name, done) {
  debug(`setting name with ${name}`);
  this._write(NAME_UUID, new Buffer(name), done);
};


/**
 * Clean up disconnected bolts from internal registry
 * Automatically called on disconnect event
 * @private
 */
Bolt.prototype.onDisconnect = function () {
  debug(`disconnected: ${this.id}`);
  Bolt.remove(this.id);
  NobleDevice.prototype.onDisconnect.call(this);
};


/**
 * Read specific characteristic of the bolt
 * @param {string} characteristic - UUID of characteristic to read
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._read = function (characteristic, done, isStringResponse) {
  assertFunction(done);
  debug(`getting characteristic ${characteristic} of service ${SERVICE_UUID}`);
  this.readDataCharacteristic(SERVICE_UUID, characteristic, (error, buffer) => {
    if (buffer === undefined) {
      error = new Error("couldn't read buffer value for characteristic ${characteristic} of service ${SERVICE_UUID}");
    }
    debug(`got buffer "${buffer}"`);

    if (buffer && isStringResponse) done(error, buffer.toString());
    else done(error, buffer);
  });

  return this;
};

/**
 * Writes value to the bolt
 * @param {string} characteristic - UUID of characteristic to write
 * @param {Buffer} characteristic - Buffer value to write
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._write = function (characteristic, buffer, done) {
  debug(`setting characteristic ${characteristic} of service ${SERVICE_UUID} with buffer ${buffer}`);
  if (done) {
    assertFunction(done);
    this.writeDataCharacteristic(SERVICE_UUID, characteristic, buffer, done);
  } else {
    // writeDataCharacteristic callback has 1 param error
    this.writeDataCharacteristic(SERVICE_UUID, characteristic, buffer, (error) => {});
  }
  return this;
};


/**
 * Read current value of the bolt and update internal state
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._readStateValue = function (done) {
  debug(`reading state value`);
  this._read(CONTROL_UUID, (error, buffer) => {
    if (error) {
      return done(error);
    }
    this.state.buffer = buffer;
    done(undefined, this.state.value);
  });

  return this;
};

/**
 * Write current internal state value on the bolt.
 * Real write is defered, callback is immediately invoked.
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._writeStateValue = function (done) {
  if (typeof done === "function") {
    //done();
  } else {
    debug('tried to call _writeStateValue with non function callback:', typeof done);
    return this._delayedWrite();
  }
  return this._delayedWrite(done);
};


/**
 * Delays writing to the bolt until DELAYED_WRITE_MS has elapsed.
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._delayedWrite = function (done) {
  clearTimeout(this.writeTimer);
  this.writeTimer = setTimeout(() => {
    debug(`writing state value with value ${this.state.value}`);
    this._write(CONTROL_UUID, this.state.buffer, () => {
      if (this.shouldPersist) {
        this._delayedPersist(done);
       } else {
        if (done) done();
       }
    });
  }, DELAYED_WRITE_MS);
  return this;
};


/**
 * Delays saving default value set to the bolt until DELAYED_PERSIST_MS has elapsed.
 * This essentially allows remembering the last value set if the bolt if physically turned off / unplugged.
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._delayedPersist = function (done) {
  clearTimeout(this.persistTimer);
  this.persistTimer = setTimeout(() => {
    this.setEffectSetting(PERSIST_DEFAULT_COLOR, done);
    // debug(`setting characteristic ${EFFECT_UUID} of service ${SERVICE_UUID} with data ${PERSIST_DEFAULT_COLOR}`);
    // this.writeDataCharacteristic(SERVICE_UUID, EFFECT_UUID, new Buffer(PERSIST_DEFAULT_COLOR));
    // if (done) done();
  }, DELAYED_PERSIST_MS);
  return this;
};

/**
 * Read FW version
 * @param {SimpleCallback} done - completion callback
 * @returns {string}
 * @public
 */
Bolt.prototype.readFwVer = function (done) {
  // debug('reading readFwVer');
  this._read(FW_VER_UUID, (error, buffer) => {
    if (error) {
      return done(error);
    }
    let fwVer = buffer.toString(undefined, 0, buffer.length-1);
    done(undefined, fwVer);
  });

  return this;
};

Bolt.prototype.readColorFlow = function (done) {
  this._read(COLOR_FLOW_CHARID, done);
  return this;
};

Bolt.prototype.readName = function (done) {
  debug(`readName`);
  this.notifyName( (error) => {
    if (!error) {
      this._readNameCallback = done;
      this._write(NAME_UUID, new Buffer(NAME_QUERY), (error) => {
        if (error) {
          done(error);
          return;
        }
        this._readTimeout = setTimeout(() => {
          this._readNameCallback(new Error('Timeout while readName'));
        }, 2000);
      });
    } else done(error);
  });
};

Bolt.prototype.notifyName = function(callback) {
  // debug('notifyName');
  this.onNameNotifyBinded = this.onNameNotify.bind(this);
  // notifyCharacteristic has 1 param error
  this.notifyCharacteristic(SERVICE_UUID, NAME_NOTIFY_CHARID, true, this.onNameNotifyBinded, callback);
};

Bolt.prototype.unnotifyName = function(callback) {
  debug('unnotifyName');
  this.notifyCharacteristic(SERVICE_UUID, NAME_NOTIFY_CHARID, false, this.onNameNotifyBinded, callback);
};

Bolt.prototype.onNameNotify = function(data) {
    if (!data) return;
    let dataStr = data.toString();
    debug('onNameNotify: data='+dataStr);
    clearTimeout(this._readTimeout);

    if (dataStr.startsWith(NAME_END)) {
      debug('_readNameCallback "' + this.name + '"');
      this._readNameCallback(undefined, this.name);
    } else {
      this._readTimeout = setTimeout(() => {
        debug('readName: timeout');
        this._readNameCallback(new Error('readName: timeout'), this.name);
      }, 2000);

      let strArray = dataStr.split(',');
      if (!strArray || strArray.length < 2) {
        this._readNameCallback(new Error('readName: parsing error'), this.name);
        return;
      }
      if (dataStr.startsWith(NAME_START)) {
        this.name = strArray[1];
      } else {
        this.name += strArray[1];
      }
    }
};

/**
 * Used by Noble Device to detect bolt from other BLE devices.
 * @private
 */
Bolt.SCAN_UUIDS = [SERVICE_UUID];

/**
 * Internal registry to keep track of currently discovered and connected bolts.
 * @private
 */
Bolt.bolts = [];

/**
 * Counter for discover loop. Useful for debugging purposes mostly.
 * @private
 */
Bolt.loopCount = 0;


/**
 * Starts the discovery loop.
 * Loop consist in stopping and starting the Bolt discovery process every DISCOVERY_LOOP_MS.
 * This is to paliate a potential issue with Noble device that becomes stale after a few hours
 * and loose connection with connected bolt / stop detecting previously disconnected bolts.
 * @static
 * @example
 * Bolt.init(function(error, rgba) {
 *   console.log('Current RGBA values are: ', rgba);
 * });
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
 * @static
 * @example
 * let bolt = Bolt.get('2312AC5C08E348699B0199458AC644BD');
 * bolt.setState(true, function() {
 *   ...
 * });
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
 * @static
 * @example
 * let bolt = Bolt.remove('2312AC5C08E348699B0199458AC644BD');
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
 * @private
 */
Bolt.is = function(peripheral) {
  return peripheral.advertisement.localName === ADVERTISEMENT_NAME;
};


/**
 * Callback used by discoverAll / stopDiscoverAll Noble device helpers.
 * Initialize the internal state representation of the bolt.
 * Keep track of newly discovered bolts in internal registry.
 * @private
 */
Bolt._setup = function (bolt) {
  debug(`discovered: ${bolt.id}`);
  bolt.connectAndSetup(() => {
    bolt.getRGBA((error) => {
      if (error) {
        debug(`error getting initial RGBA: ${error}`);
        Bolt.init();
      } else {
        debug(`ready: ${bolt.id}`);
        Bolt.bolts.push(bolt);
      }
    });
  });
};


/**
 * Simple completion callback
 * @callback SimpleCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 */

/**
 * Numbers getter completion callback
 * @callback NumbersGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Array<Number>} Value retrieved
 */

/**
 * Number getter completion callback
 * @callback NumberGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Number} Value retrieved
 */

/**
 * Boolean getter completion callback
 * @callback BooleanGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Boolean} Value retrieved
 */

/**
 * String getter completion callback
 * @callback StringGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?String} Value retrieved
 */


module.exports = Bolt;

Bolt = require('.');
async = require('async');

function setColorInInterval(bolt) {
    var i = 0,
        colors = [[228,41,15,10],
                  [216,62,36,10],
                  [205,55,56,10],
                  [211,27,76,10],
                  [166,18,97,10]];
    // Change color every 500 ms
    setInterval(function(){
      var color = colors[i++ % colors.length];
      bolt.setRGBA(color, function(){
        console.log("- setRGBA " + bolt.id + ' ' + bolt.address);
        // set complete
      });
    }, 500);
}

function done(error, value) {
    console.log('value = '+value);
}

function onConnect(bolt) {
    console.log("- onConnect: " + bolt.id + ' ' + bolt.address + ' rssi=' + bolt._peripheral.rssi);

    async.series([
      (done) => { bolt.getRGBA(done); },
      // (done) => {
      //   console.log('HSB='+bolt.state.hsb);
      //   bolt.readName(done); },
    //   (done) => { bolt.readFwVer(done); },
      // (done) => { bolt.readEffectSetting(done); },
      // (done) => { bolt.readColorFlow(done); },
      (done) => { bolt.setDelayOnOff(5, false, done); },
      (done) => {
        bolt.state.red = (bolt.state.red + 10) % 192;
        bolt.state.green = (bolt.state.green + 50) % 100;
        bolt.state.blue = (bolt.state.blue + 50) % 100;
        bolt.setBrightness((bolt.state.brightness + 10) % 31, done);
      },
    ], (error, values) => {
      if (error && !error.code) {
        console.log(error);
      } else {
        console.log(values);
        console.log('HSB='+bolt.state.hsb);
        console.log('state='+bolt.state.state);
        console.log('name='+bolt.name);
        bolt.disconnect(done);
      }
    });
}

var connectedCount = 0;
// Discover every nearby Bolt
console.log("Discovering ...");
Bolt.discoverAll(function(bolt) {
  console.log("- discovered " + bolt.id + ' ' + bolt.address);

  bolt.on('disconnect', function() {
      connectedCount--;
      console.log('len='+connectedCount);
      if (connectedCount == 0) {
        process.exit(0);
      }
  });

  // Each time a bolt is discovered, connect to it
  bolt.connectAndSetUp(function(error) {
    connectedCount++;
    onConnect(bolt);
  });
});

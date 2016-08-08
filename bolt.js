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

function done2(key, value) {
    console.log(key+' = '+value);
}
function done(error, value) {
    console.log('value = '+value);
}

function onConnect(bolt) {
    console.log("- onConnect: " + bolt.id + ' ' + bolt.address + ' rssi=' + bolt._peripheral.rssi);

    async.series([
      (done) => { bolt.getRGBA(done); },
    //   (done) => { bolt.getHSB(done); },
      (done) => { bolt.readName(done); },
    //   (done) => { bolt.readFwVer(done); },
      (done) => { bolt.readEffectSetting(done); },
      (done) => { bolt.readColorFlow(done); },
      (done) => {
        bolt.state.red = (bolt.state.red + 10) % 256;
        bolt.state.green = (bolt.state.green + 50) % 256;
        bolt.state.blue = (bolt.state.blue + 50) % 256;
        bolt.setState(true, done);
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

// Discover every nearby Bolt
console.log("Discovering ...");
Bolt.discover(function(bolt) {
  console.log("- discovered " + bolt.id + ' ' + bolt.address);

  bolt.on('disconnect', function() {
      process.exit(0);
  });

  // Each time a bolt is discovered, connect to it
  bolt.connectAndSetUp(function(error) {
    onConnect(bolt);
  });
});

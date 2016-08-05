Bolt = require('.');
async = require('async'),


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
    console.log("- onConnect: " + bolt.id + ' ' + bolt.address);

    async.series([
      (done) => { bolt.getRGBA(done); },
    //   (done) => { bolt.getHSB(done); },
      (done) => { bolt.notifyName(done); },
      (done) => { bolt.getName(done); },
      (done) => { bolt.getGradualMode(done); },
      (done) => { bolt.readFwVer(done); },
      (done) => { bolt.readPersistColor(done); },
      (done) => { bolt.readColorFlow(done); },
      (done) => { bolt.setState(!bolt.state.state, done); },
    ], (error, values) => {
      if (error) {
        console.log(error);
      } else {
        console.log(values);
        console.log(bolt.state.state);
        console.log(bolt.state.rgba);
        console.log(bolt.state.hsb);
        //bolt.disconnect(done);
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

  bolt.on('nameChange', function(data) {
      console.log("update nameChange: " + data);
  });


  // Each time a bolt is discovered, connect to it
  bolt.connectAndSetUp(function(error) {
    onConnect(bolt);
  });
});

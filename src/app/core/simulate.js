sys = require("sys");
jQuery = require("jQuery");

require("./class.js");
require("../gen-js/core_types.js");
require("./types.js");
//require("../third_party/thrift/js/thrift.js");
require("./init.js");

initializeGame();
var game = games["game1"];
game.firstDown();
game.offensivePlay = offensivePlays["OffensivePlay2"];
game.lineUp();
game.playState = thrift.PlayState.PLAY;

console.log(game);

/*
while (true) {
    game.tick();
}
*/

sys = require("sys");
jQuery = require("jQuery");

require("./class.js");
require("../gen-js/core_types.js");
require("./types.js");
require("../third_party/thrift/js/thrift.js");

var pt = FieldPoint.spawn({x:1, y:1}, {});
var transport = {
    buffer:"",
    write: function(s) {
        console.log("WRITING:");
        console.log(s);
        this.buffer += s;
    },
    flush: function() {
        console.log("FLUSHING");
        console.log(this.buffer);
    },
    readAll: function() {
        return this.buffer;
    },
};
var protocol = new Thrift.Protocol(transport);
protocol.writeMessageBegin("Header", Thrift.MessageType.CALL, 0);
pt.write(protocol);
protocol.writeMessageEnd();

console.log(pt);

var newPt = FieldPoint.spawn({},{});
protocol.readMessageBegin("Header", Thrift.MessageType.CALL, 0);
newPt.read(protocol);
protocol.readMessageEnd();

console.log(newPt);

// Deep copy
DeepCopy = function(oldObject) {
    return jQuery.extend(true, {}, oldObject);
}

Object.defineProperty(Object.prototype, "spawn", {value: function (props, args) {
    var defs = {}, key;
    for (key in props) {
        if (props.hasOwnProperty(key)) {
            defs[key] = {value: props[key], enumerable: true};
        }
    }
    var o = {}
    jQuery.extend(true, o, this, props);
    o.parent = this;
    if (o.init) {
        o.init(args);
    }
    return o;
}});

/* Example usage
var sys = require("sys");

var Animal = {
  eyes: 2,
  legs: 4,
  name: "Animal",
  toString: function () {
    return this.name + " with " + this.eyes + " eyes and " + this.legs + " legs."
  }
}
var Dog = Animal.spawn({
  name: "Dog"
});
var Insect = Animal.spawn({
  name: "Insect",
  legs: 6
});
var fred = Dog.spawn({});
var pete = Insect.spawn({});
console.log(fred.toString());
sys.puts(pete);
console.log(fred.name);
*/

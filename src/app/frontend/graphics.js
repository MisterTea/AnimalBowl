console.log("IN GRAPHICS");
FieldPoint.nodeToScreen = function() {
    //console.log("CONVERTING POINT");
    //console.log(this);
    return cc.p(
        this.x * .25,
        (this.z/2.0 + this.y)*.25
        );
}


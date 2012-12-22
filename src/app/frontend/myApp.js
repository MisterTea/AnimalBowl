/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

 var CircleSprite = cc.Sprite.extend({
    _radians:0,
    ctor:function () {
        this._super();
    },
    draw:function () {
        cc.renderContext.fillStyle = "rgba(255,255,255,1)";
        cc.renderContext.strokeStyle = "rgba(255,255,255,1)";

        if (this._radians < 0)
            this._radians = 360;
        cc.drawingUtil.drawCircle(cc.PointZero(), 30, cc.DEGREES_TO_RADIANS(this._radians), 60, true);
    },
    myUpdate:function (dt) {
        this._radians -= 6;
        //this._addDirtyRegionToDirector(this.getBoundingBoxToWorld());
    }
});

var FieldSpriteUpdater = function(dt) {
    //console.log(this.fieldPoint);
    this.setPosition(this.fieldPoint.nodeToScreen());
    //console.log(this.getPosition());
}

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        this.schedule(this.myUpdater, 1/100);

        initializeGame();
        this.game = games["game1"];
        this.game.firstDown();
        console.log(formations);
        console.log("OFFENSIVE PLAYS");
        this.game.offensivePlay = offensivePlays["OffensivePlay2"];

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            this,
            function () {
                history.go(-1);
            });
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, 0));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);

        this.fieldLayer = new cc.Layer();
        this.addChild(this.fieldLayer);

        // Create sprites for all players
        for(var playerId in players) {
            var player = players[playerId];
            var playerSprite = null;
            if (player.teamId == "team1") {
                playerSprite = cc.Sprite.create("../res/Player1.png");
            } else {
                playerSprite = cc.Sprite.create("../res/Player2.png");
            }
            playerSprite.player = player;
            console.log("PLAYER LOC");
            console.log(player.location);
            playerSprite.fieldPoint = player.location;
            playerSprite.positionUpdater = FieldSpriteUpdater;
            playerSprite.schedule(playerSprite.positionUpdater, 1/100);
            //playerSprite.setPosition(cc.p(size.width / 2, size.height / 2));
            playerSprite.setScale(0.5);
            //playerSprite.setRotation(180);
            
            this.fieldLayer.addChild(playerSprite, 2);

            //var rotateToA = cc.RotateTo.create(2, 0);
            //var scaleToA = cc.ScaleTo.create(2, 1, 1);

            //playerSprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        }


        this.circle = new CircleSprite();
        this.circle.setPosition(cc.p(40, size.height - 60));
        this.addChild(this.circle, 2);
        this.circle.schedule(this.circle.myUpdate, 1 / 60);

        this.helloLabel.runAction(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)));

        this.setTouchEnabled(true);
        this.adjustSizeForWindow();
        lazyLayer.adjustSizeForCanvas();
        window.addEventListener("resize", function (event) {
            selfPointer.adjustSizeForWindow();
        });

        // Initialize camera
        console.log(cc.renderContext);
        //cc.renderContext.translate(0, 0.0);
        //cc.renderContext.scale(1.0,1.0);

        return true;
    },

    adjustSizeForWindow:function () {
        var margin = document.documentElement.clientWidth - document.body.clientWidth;
        if (document.documentElement.clientWidth < cc.originalCanvasSize.width) {
            cc.canvas.width = cc.originalCanvasSize.width;
        } else {
            cc.canvas.width = document.documentElement.clientWidth - margin;
        }
        if (document.documentElement.clientHeight < cc.originalCanvasSize.height) {
            cc.canvas.height = cc.originalCanvasSize.height;
        } else {
            cc.canvas.height = document.documentElement.clientHeight - margin;
        }

        var xScale = cc.canvas.width / cc.originalCanvasSize.width;
        var yScale = cc.canvas.height / cc.originalCanvasSize.height;
        if (xScale > yScale) {
            xScale = yScale;
        }
        cc.canvas.width = cc.originalCanvasSize.width * xScale;
        cc.canvas.height = cc.originalCanvasSize.height * xScale;
        var parentDiv = document.getElementById("Cocos2dGameContainer");
        if (parentDiv) {
            parentDiv.style.width = cc.canvas.width + "px";
            parentDiv.style.height = cc.canvas.height + "px";
        }
        cc.renderContext.translate(0, cc.canvas.height);
        cc.renderContext.scale(xScale, xScale);
        cc.Director.getInstance().setContentScaleFactor(xScale);
    },
    myUpdater:function (dt) {
        //console.log(this);
        //console.log(cc.p(50,0));
        this.fieldLayer.setPosition(cc.p(-800,200));
        //this.fieldLayer.setScale(20.0);
        //console.log(this.getPosition());
        if (this.game.playState != thrift.PlayState.PREP) {
            this.game.tick();
        }
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        console.log(touches);
        console.log(event);
        this.isMouseDown = true;
        this.pressLocation = {x:touches[0].getLocation().x,
                              y:touches[0].getLocation().y};
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
        console.log("CLICKED");
        if (this.game.playState == thrift.PlayState.PREP) {
            this.game.lineUp();
            this.game.playState = thrift.PlayState.PLAY;
        }
        this.releaseLocation = {x:touches[0].getLocation().x,
                                y:touches[0].getLocation().y};
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});


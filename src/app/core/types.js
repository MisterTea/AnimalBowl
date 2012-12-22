FieldPoint = {
    init: function(args) {
    },
    toString: function () {
    },
    copyFrom: function(otherPoint) {
        this.x = otherPoint.x;
        this.y = otherPoint.y;
        this.z = otherPoint.z;
    },
    distanceSquared: function(otherPoint) {
        console.log("DISTANCE SQUARED");
        console.log(this);
        console.log(otherPoint);
        var d = (this.x - otherPoint.x)*(this.x - otherPoint.x) +
        (this.y - otherPoint.y)*(this.y - otherPoint.y) +
        (this.z - otherPoint.z)*(this.z - otherPoint.z);
        console.log("DISTANCE IS");
        console.log(d);
        return d;
    },
    translateCopy: function(x,y,z) {
        return FieldPoint.spawn({
            x:this.x+x,
            y:this.y+y,
            z:this.z+z,
        });
    },
};
jQuery.extend(FieldPoint, new thrift.FieldPoint());

Formation = {
    init: function(args) {
	formations[this.id] = this;
    }
};
jQuery.extend(Formation, new thrift.Formation());
formations = {}

RouteNode = {
};
jQuery.extend(RouteNode, new thrift.RouteNode());

PlayerRoute = {
    init: function(args) {
	playerRoutes[this.id] = this;
    }
};
jQuery.extend(PlayerRoute, new thrift.PlayerRoute());
playerRoutes = {}

OffensivePlay = {
    init: function(args) {
	offensivePlays[this.id] = this;
    }
};
jQuery.extend(OffensivePlay, new thrift.OffensivePlay());
offensivePlays = {}

Player = {
    init: function(args) {
	players[this.id] = this;
        this.location = FieldPoint.spawn();
    },
    lineUp: function() {
        this.routeNodeIndex = 0;
    },
    tick: function() {
        if (this.routeId == null) {
            // TODO: Do something you don't have a route
            return;
        }
        var route = playerRoutes[this.routeId];
        var nextNode = null;
        var team = teams[this.teamId];
        var game = games["game1"];
        if (route.nodes.length > this.routeNodeIndex) {
            nextNode = route.nodes[this.routeNodeIndex];
        }
        if (nextNode == null) {
            if(route.keepRunning) {
                // Run to the end zone
                this.location.x += 10 * (team.offenseGoesRight?1:-1);
            }
        } else {
            console.log(nextNode);
            var shiftedNextNodeLocation = nextNode.location==null?
                null:
                nextNode.location.translateCopy(game.scrimmageLine*100,0,0);
            console.log(shiftedNextNodeLocation);

            if (nextNode.location == null || 
                shiftedNextNodeLocation.distanceSquared(this.location) < 100) {
                console.log("REACHED TARGET");
                // Complete this node if possible
                if (nextNode.pitch != null) {
                    if (this.hasBall == false) {
                        throw "OOPS";
                    }
                    // TODO: implement pitch
                    this.hasBall = false;
                    var target = team.getPlayerByRole(nextNode.pitch, 0);
                    target.hasBall = true;
                } else if (nextNode.handoff != null) {
                    if (this.hasBall == false) {
                        throw "OOPS";
                    }
                    // TODO: implement handoff (wait for target to show up)
                    this.hasBall = false;
                    var target = team.getPlayerByRole(nextNode.pitch, 0);
                    target.hasBall = true;
                }

                if (nextNode.waitForBall == false || this.hasBall == true) {
                    this.routeNodeIndex++;
                }
            } else { // Haven't reached target yet
                console.log("SOURCE -> TARGET");
                console.log(this.location);
                console.log(shiftedNextNodeLocation);
                var loc = shiftedNextNodeLocation.distanceSquared(this.location);
                console.log("DISTANCE");
                console.log(loc);
                var dx = shiftedNextNodeLocation.x - this.location.x;
                var dz = shiftedNextNodeLocation.z - this.location.z;
                console.log({x:dx,z:dz});
                if (Math.abs(dx)==0) { // don't need to move horizontally
                    if (Math.abs(dz)<10) { // Close enough to target
                        this.location.z = shiftedNextNodeLocation.z;
                    } else { // En route to target
                        this.location.z += Math.abs(dz)>0?10:-10;
                    }
                } else if (Math.abs(dz)==0) { // Don't need to move vertically
                    if (Math.abs(dx)<10) { // Close enough to target
                        this.location.x = shiftedNextNodeLocation.x;
                    } else { // En route to target
                        this.location.x += Math.abs(dx)>0?10:-10;
                    }
                } else {
                    if (Math.abs(dx)<7) { // Close enough to target
                        this.location.x = shiftedNextNodeLocation.x;
                    } else { // En route to target
                        this.location.x += Math.abs(dx)>0?7:-7;
                    }
                    if (Math.abs(dz)<7) { // Close enough to target
                        this.location.z = shiftedNextNodeLocation.z;
                    } else { // En route to target
                        this.location.z += Math.abs(dz)>0?7:-7;
                    }
                }
            }
        }
    },
};
jQuery.extend(Player, new thrift.Player());
players = {}

Team = {
    init: function(args) {
	teams[this.id] = this;
    },
    getPlayerByRole: function(role, index) {
        var count=0;
        for(var i in this.playerIds) {
            var playerId = this.playerIds[i];
            var player = players[playerId];
            if (player.role != role) continue;
            if (count==index) return player;
            count++;
        }
        throw "OOPS";
    },
    tick: function() {
        for(var i in this.playerIds) {
            var playerId = this.playerIds[i];
            var player = players[playerId];
            player.tick();
        }
    },
    lineUp: function(play, scrimmageLine) {
        var f = formations[play.formationId];
        for(var role in f.locations) {
            for(var i in f.locations[role]) {
                var location = f.locations[role][i];
                var player = this.getPlayerByRole(role, i);
                if (role in play.routes) {
                    var route = play.routes[role][i];
                    player.routeId = route.id;
                } else {
                    player.routeId = null;
                }
                console.log("SETTING LOCAITON FOR PLAYER");
                console.log(role);
                console.log(location);
                player.location.copyFrom(location);
                console.log(player.location);
                if (this.offenseGoesRight==false) {
                    player.location.x *= -1;
                }
                console.log(player.location);
                player.location.x += (scrimmageLine*100);
                console.log(player.location);
                console.log(player);
                player.lineUp();
            }
        }
    },
};
jQuery.extend(Team, new thrift.Team());
teams = {}

Game = {
    init: function(args) {
	games[this.id] = this;
        this.quarter = 1;
        this.startQuarter();
    },
    startQuarter: function() {
        this.ticksLeftInQuarter = 15 * 60 * 100;
        this.playState = thrift.PlayState.PREP;
    },
    getTeamByIndex: function(i) {
        return teams[this.teams[i]];
    },
    getOffense: function() {
        for (var a=0;a<this.teams.length;a++) {
            var team = this.getTeamByIndex(a);
            if (team.onOffense) {
                return team;
            }
        }
        throw "OOPS";
    },
    firstDown: function() {
        var teamInPossession = this.getOffense();
        this.firstDownLine = this.scrimmageLine + (teamInPossession.offenseGoesRight?10:-10);
        this.firstDownLine = Math.min(100, Math.max(0, this.firstDownLine));
    },
    lineUp: function() {
        this.getOffense().lineUp(
            this.offensivePlay,
            this.scrimmageLine);
    },
    tick: function() {
        if(this.playState == thrift.PlayState.POSTPLAY) {
        } else {
            this.getOffense().tick();
        }
    },
};
jQuery.extend(Game, new thrift.Game());
games = {}

Ball = {
    init: function(args) {
    },
};
jQuery.extend(Game, new thrift.Ball());


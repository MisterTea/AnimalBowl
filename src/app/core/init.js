initializeGame = function() {
    nextId = 1;

    // Create a formation with a QB in the middle, HB and FB behind, and
    // two WR's on the sides.
    var offensiveFormation = Formation.spawn({
        id:"Formation" + nextId++,
        init: function(args) {
            this.parent.init.call(this, args);
            this.locations[thrift.PlayerRole.QUARTERBACK] = [
                FieldPoint.spawn({x:-500})];
            this.locations[thrift.PlayerRole.HALFBACK] = [
                FieldPoint.spawn({x:-1000,z:500})];
            this.locations[thrift.PlayerRole.FULLBACK] = [
                FieldPoint.spawn({x:-1000,z:-500})];
            this.locations[thrift.PlayerRole.RECEIVER] = [
                FieldPoint.spawn({x:0,z:1000}),
                FieldPoint.spawn({x:0,z:-1000})];
        },
    });

    // Create a running play where the QB hands the ball to the HB
    // and the HB runs to the endzone.
    var runningPlay = OffensivePlay.spawn({
        id:"OffensivePlay" + nextId++,
        formationId:offensiveFormation.id,
        init: function(args) {
            this.parent.init.call(this, args);
            this.routes[thrift.PlayerRole.QUARTERBACK] = [
                PlayerRoute.spawn({
                    id:"PlayerRoute"+nextId++,
                    keepRunning:false,
                    nodes:[
                        RouteNode.spawn({
                            location:FieldPoint.spawn({x:-500,z:500}),
                            pitch:thrift.PlayerRole.HALFBACK
                        }),
                    ],
                })];
            this.routes[thrift.PlayerRole.HALFBACK] = [
                PlayerRoute.spawn({
                    id:"PlayerRoute"+nextId++,
                    nodes:[
                        RouteNode.spawn({
                            location:FieldPoint.spawn({x:-500,z:500}),
                            waitForBall:true
                        }),
                    ],
                })];
        },
    });

    // Create a QB, HB, FB, and two WRs
    var createRoster = function(team) {
        var qb = Player.spawn({
            id:team.id + "_Player" + nextId++,
            role:thrift.PlayerRole.QUARTERBACK,
            teamId: team.id,
        });
        team.playerIds.push(qb.id);

        var runner1 = Player.spawn({
            id:team.id + "_Player" + nextId++,
            role:thrift.PlayerRole.HALFBACK,
            teamId: team.id,
        });
        team.playerIds.push(runner1.id);

        var runner2 = Player.spawn({
            id:team.id + "_Player" + nextId++,
            role:thrift.PlayerRole.FULLBACK,
            teamId: team.id,
        });
        team.playerIds.push(runner2.id);

        var receiver1 = Player.spawn({
            id:team.id + "_Player" + nextId++,
            role:thrift.PlayerRole.RECEIVER,
            teamId: team.id,
        });
        team.playerIds.push(receiver1.id);

        var receiver2 = Player.spawn({
            id:team.id + "_Player" + nextId++,
            role:thrift.PlayerRole.RECEIVER,
            teamId: team.id,
        });
        team.playerIds.push(receiver2.id);
    };

    var team1 = Team.spawn({
        id:"team1",
        score:0,
        offenseGoesRight:true,
        onOffense:true,
    });
    createRoster(team1);

    var team2 = Team.spawn({
        id:"team2",
        score:0,
        offenseGoesRight:false,
        onOffense:false,
    });
    createRoster(team2);

    var ball1 = Ball.spawn({
        location: FieldPoint.spawn({x:5000,y:0,z:0}),
        ownedPlayerId:null,
        passTarget:null,
        ticksToTarget:null,
        ticksInFlight:null,
    });

    var game = Game.spawn({
        id:"game1",
        teams:[team1.id,team2.id],
        ball:ball1,
        scrimmageLine:50,
        playState:thrift.PlayState.PREP,
    });
}


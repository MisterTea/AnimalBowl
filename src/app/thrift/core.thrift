namespace java com.football.thrift
namespace js thrift

// Field Point, in units of 1/100th of a yard.
struct FieldPoint {
  1:i32 x = 0, // X-Axis is moving down the length of the field
  2:i32 y = 0, // Y-Axis is the height.  Most objects are at y=0
  3:i32 z = 0, // Z-Axis is moving across the field. +z is moving to the top of the field.
}

// Generic struct for holding a dynamic value like stats
struct DynamicValue {
  1:i32 current,
  2:i32 maximum,
  3:i32 multiplier = 1,
  4:i32 modifier = 0,
}

// State of the play.
enum PlayState {
  PREP, // Pre-hike
  PLAY, // Ball is active
  POSTPLAY, // After play has ended but before prep for the next play
}

enum PlayerRole {
  QUARTERBACK, // The guy who hikes and throws the ball
  HALFBACK, // Runs to the quarterback and takes the ball for a running play
  FULLBACK, // Runs to the quarterback and takes the ball for a running play
  RECEIVER, // Runs a route and can catch the ball for a passing play
  OFFENSIVE_TACKLE, // Protects the player with the ball
  DEFENSIVE_TACKLE, // Tries to tackle the player with the ball
}

// This holds the locations of all players when the ball is snapped.  Several plays can have
// the same formation. (Examples: Pro Formation, I-Formation).
struct Formation {
  // A unique id for this formation
  1:string id,

  // For each role, a list of locations for where the player with that role will start.
  // If the list is greater than 1, this means there are 2 or more of that role on the field
  // for this formation (e.g. multiple offensive tackles).
  16:map<PlayerRole, list<FieldPoint>> locations = {},
}

// A node in a route, like a turn in a receiving route or a handoff/pitch
// in a running play.
struct RouteNode {
  // The player will run to this location before moving to the next node.
  1:FieldPoint location,

  // If the player has the ball, he will give the ball to the player with role "handoff"
  // after reaching this node.
  2:PlayerRole handoff,

  // If the player has the ball, he will toss the ball to the player with role "pitch"
  // BEFORE reaching this node.
  3:PlayerRole pitch,

  // If true, will not leave this node until the player has the ball.
  4:bool waitForBall = false,
}

// If the player is a runner or QB, the route will dictate when to give/take the ball, and what to do
// after receiving the ball.

// If the player is a receiver, the route will only dictate what to do before the ball is thrown.
struct PlayerRoute {
  1:string id,

  16:list<RouteNode> nodes = [],
  17:bool keepRunning = true, // If true, run to endzone after route
}

// A play is made of an initial formation and a set of routes.
// 
struct OffensivePlay {
  1:string id,

  16:string formationId,
  17:map<PlayerRole,list<PlayerRoute> > routes = {},
}

// User actions that influence the play.
enum PlayerAbility {
  THROW, // Swipe in the direction of the pass
  DODGE, // Swipe away from the end zone to pause temporarily
  DIVE,  // Swipe to gain a few yards but end the play
  TACKLE,// Swipe at the ball carrier and tackle if the angle is right.
}

struct Player {
  1:string id,

  16:FieldPoint location,
  17:bool hasBall,
  18:string teamId,
  19:i32 passTargetIndex = -1,
  20:PlayerRole role,
  21:FieldPoint tackleTarget,
  22:set<PlayerAbility> abilitiesUsed = {},
  23:string wrestleTargetId,
  24:string routeId,
  25:i32 routeNodeIndex,
}

struct Ball {
  1:FieldPoint location,
  2:string ownedPlayerId,
  3:FieldPoint passSource,
  4:FieldPoint passTarget,
  5:i32 ticksToTarget,
  6:i32 ticksInFlight,
}

struct Team {
  1:string id,

  16:list<string> playerIds = [],
  17:i32 score,
  18:bool offenseGoesRight,
  19:bool onOffense,
}

struct Game {
  1:string id,

  16:list<string> teams = [],
  17:Ball ball,
  18:i32 scrimmageLine,
  19:i32 firstDownLine,
  20:i32 down,
  21:OffensivePlay offensivePlay,
  22:PlayState playState,
  23:i32 ticksLeftInQuarter,
  24:i32 quarter,
}

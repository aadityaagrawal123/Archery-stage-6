const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerBase, playerArcher, board1, board2;
var i, index;
var playerArrows = [];
var numberOfArrows = 10;
var trajectoryImg;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
  trajectoryImg = loadImage("./assets/cannonball.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);

  var options = {
    isStatic: true
  }

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 60, 200, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    338,
    playerBase.position.y - 105,
    120,
    120
  )

  board1 = new Board(width-300, 300, 50, 200);
  board2 = new Board(width-550, height-300, 50, 200);
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );
     
      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided){
        console.log("collided");
        playerArrows[i].remove(i);
        
        Matter.World.remove(world, playerArrows[i].body);
        delete playerArrows[i];
      }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(25);
  text("Remaining Arrows : ", width / 7, 125);

  fill("#FFFF");
      textAlign("center");
      textSize(25);
      text(numberOfArrows, width / 4.5, 125);

}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0){
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle;

    var arrow = new PlayerArrow(posX, posY, 100, 10, angle);
    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);
    numberOfArrows -= 1;
  }
 }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }

}
 

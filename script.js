const substeps = 12;
const gravity = 0.2;
const bounce = 0;
let boundaryRadius;
let newBall = false;
let newBallRadius = 0;

let objs = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  boundaryRadius = min(innerWidth, innerHeight)*3/8;
}

function draw() {
  background(40);
  stroke(225);
  fill(225);

  textSize(25);
  strokeWeight(1);
  textAlign(CENTER);
  text('Press and hold to create a RECball.', width/2, 20);
  
  textSize(20);
  text('Press enter to restart.', width/2, height - 20);

  strokeWeight(4);
  
  drawBall();
  drawConstraints();
  drawObjects();
  applyVerlet();
  applyConstraints();
}

function keyPressed() {
  if (keyCode === ENTER) {
    objs = [];
  }
}

function drawBall() {
  if (mouseIsPressed) {
    if (!newBall) {
      newBallRadius = 20;
      newBall = true;
    } else {
      newBallRadius += 2;
      if (newBallRadius > boundaryRadius*2/3) {
        newBallRadius = boundaryRadius*2/3;
      }
    }

    noFill();
    rect(mouseX, mouseY, newBallRadius)
  } else if (newBall == true) {
    newBall = false;
    objs.push({x: mouseX, y: mouseY, oldX: mouseX, oldY: mouseY, radius: newBallRadius});
  }
}

function drawObjects() {
  objs.forEach((object) => {
    rect(object.x, object.y, object.radius);
  });
}

function applyVerlet() {
  objs.forEach((obj) => {
    oldX = obj.oldX;
    oldY = obj.oldY;
    obj.oldX = obj.x;
    obj.oldY = obj.y;
    obj.x += (obj.x - oldX)*0.99;
    obj.y += (obj.y - oldY + gravity)*0.99;
  })
}

function drawConstraints() {
  noFill();
  circle(width/2, height/2, boundaryRadius*2);
}

function constrainObject(obj, index) {
  var centerVec = p5.Vector.sub(createVector(obj.x, obj.y), createVector(width/2, height/2));
  if (centerVec.mag() > boundaryRadius - obj.radius/2) {
    centerVec.setMag(boundaryRadius - obj.radius/2);
    corrected = createVector(width/2, height/2).add(centerVec);
    obj.x = corrected.x;
    obj.y = corrected.y;
  }
  
  objs.forEach((test, testIndex) => {
    if (testIndex == index) {
      return;
    }
    
    var distance = p5.Vector.sub(createVector(test.x, test.y), createVector(obj.x, obj.y));
    if (distance.mag() < obj.radius/2 + test.radius/2) {
      distance.setMag(obj.radius/2 + test.radius/2 + bounce);
      var adjustedObject = p5.Vector.sub(createVector(test.x, test.y), distance);
      var adjustedTest = p5.Vector.sub(createVector(obj.x, obj.y), distance.mult(-1));
      obj.x = adjustedObject.x;
      obj.y = adjustedObject.y;
      test.x = adjustedTest.x;
      test.y = adjustedTest.y;
    }
  })
}

function applyConstraints() {
  for (var i = 0; i < substeps; i++) {
    objs.forEach(constrainObject);
  }
}
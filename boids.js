var style = getComputedStyle(document.body);
let boidColor = style.getPropertyValue("--boid-color");

let debug = false;
let boids = [];
let boidDrawSize = 4;
let boidProtectedRange = 8 * 3;
let boidVisualRange = 40 * 3;
let boidAvoidFactor = 0.05;
let boidVelocityMatchingFactor = 0.05;
let boidCohesionFactor = 0.0005;
let boidMinSpeed = 3;
let boidMaxSpeed = 6;
let boidWallAvoidSpeed = 0.2 * 3;
let mapWidth = window.innerWidth;
let mapHeight = window.innerHeight;

let mouse = { x: 0, y: 0 };
let mouseRadius = 25;
let mousePressed = false;

function updateMouse(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function mouseDown(event) {
  mousePressed = true;
  mouseRadius = 80;
}

function mouseUp(event) {
  mousePressed = false;
  mouseRadius = 25;
}

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", updateMouse);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeVector(vector) {
  const magnitude = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
  if (magnitude === 0) {
    return vector;
  }
  return vector.map((val) => val / magnitude);
}

function avoidColliding(x, y) {
  // function to check if position will collide with walls or the mouse, if so, return velocity to avoid collision
  // avoid the left and right walls
  var velocity = [0, 0];
  if (x <= 0) {
    velocity[0] = 1;
  } else if (x > mapWidth) {
    velocity[0] = -1;
  }

  // avoid the top and bottom walls
  if (y <= 0) {
    velocity[1] = 1;
  } else if (y > mapHeight) {
    velocity[1] = -1;
  }

  // avoid the mouse

  let mod = 1;
  if (mousePressed) {
    mod = -0.3;
  }
  // modifier to make boids go toward mouse if mouse is held

  if (
    x >= mouse.x - mouseRadius &&
    x <= mouse.x + mouseRadius &&
    y >= mouse.y - mouseRadius &&
    y <= mouse.y + mouseRadius
  ) {
    if (x >= mouse.x) {
      velocity[0] = 4 * mod;
    } else {
      velocity[0] = -4 * mod;
    }
    if (y >= mouse.y) {
      velocity[1] = 4 * mod;
    } else {
      velocity[1] = -4 * mod;
    }
  }
  velocity[0] *= boidWallAvoidSpeed;
  velocity[1] *= boidWallAvoidSpeed;
  return velocity;
}

class Boid {
  constructor() {
    this.x = getRandomInt(0, mapWidth);
    this.y = getRandomInt(0, mapHeight);
    this.velocity = [Math.random() * 18 - 9, Math.random() * 18 - 9];
  }
}

function drawCircle(ctx, x, y, radius, fill, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function drawRect(ctx, x, y, width, height, color) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
}

function getBoidsInRange(x, y, range) {
  var result = [];
  for (const boid of boids) {
    var distance = Math.sqrt(Math.pow(boid.x - x, 2) + Math.pow(boid.y - y, 2));
    if (distance <= range) {
      result.push(boid);
    }
  }
  return result;
}

function createBoids(amount) {
  for (let i = 0; i < amount; i++) {
    var boid = new Boid();
    boids.push(boid);
  }
}

function createBoidsInClouds(amount, clouds = 3) {
  // creates boids in small seperate clouds
  var cloudWidth = Math.sqrt(amount / clouds);
  for (let c = 0; c < clouds; c++) {
    let x = getRandomInt(0, mapWidth);
    let y = getRandomInt(0, mapHeight);
    let centerX = x + cloudWidth * 10;
    let centerY = y + cloudWidth * 10;

    for (let i = 0; i < amount / clouds; i++) {
      var boid = new Boid();
      boid.x = boidProtectedRange * (i % cloudWidth) + x;
      boid.y = boidProtectedRange * (i / cloudWidth) + y;
      boid.velocity = normalizeVector([centerX - boid.x, centerY - boid.y]);
      boid.velocity[0] *= boidMinSpeed;
      boid.velocity[1] *= boidMinSpeed;
      boids.push(boid);
    }
  }
}

function moveBoids() {
  for (const boid of boids) {
    // rule 1 - seperation
    var boidsWithinProtectedRange = getBoidsInRange(
      boid.x,
      boid.y,
      boidProtectedRange,
    ).filter((b) => b !== boid);
    if (boidsWithinProtectedRange.length > 0) {
      var moveTarget = [0, 0];
      for (const boidWithinProtectedRange of boidsWithinProtectedRange) {
        moveTarget[0] += boid.x - boidWithinProtectedRange.x;
        moveTarget[1] += boid.y - boidWithinProtectedRange.y;
      }
      moveTarget = normalizeVector(moveTarget);
      moveTarget = [
        moveTarget[0] * boidAvoidFactor,
        moveTarget[1] * boidAvoidFactor,
      ];
      boid.velocity[0] += moveTarget[0];
      boid.velocity[1] += moveTarget[1];
    }

    // rule 2 - alignment
    var boidsWithinVisualRange = getBoidsInRange(
      boid.x,
      boid.y,
      boidVisualRange,
    );
    var avgVelocity = [0, 0];
    for (const boidWithinVisualRange of boidsWithinVisualRange) {
      avgVelocity[0] += boidWithinVisualRange.velocity[0];
      avgVelocity[1] += boidWithinVisualRange.velocity[1];
    }
    avgVelocity[0] /= boidsWithinVisualRange.length;
    avgVelocity[1] /= boidsWithinVisualRange.length;

    var velocityDifference = [
      avgVelocity[0] - boid.velocity[0],
      avgVelocity[1] - boid.velocity[1],
    ];
    boid.velocity[0] += velocityDifference[0] * boidVelocityMatchingFactor;
    boid.velocity[1] += velocityDifference[1] * boidVelocityMatchingFactor;

    // rule 3 - cohesion
    var avgX = 0;
    var avgY = 0;
    for (const boidWithinVisualRange of boidsWithinVisualRange) {
      avgX += boidWithinVisualRange.x;
      avgY += boidWithinVisualRange.y;
    }
    avgX /= boidsWithinVisualRange.length;
    avgY /= boidsWithinVisualRange.length;

    var differenceX = avgX - boid.x;
    var differenceY = avgY - boid.y;

    boid.velocity[0] += differenceX * boidCohesionFactor;
    boid.velocity[1] += differenceY * boidCohesionFactor;

    // turn away from wall if boid will soon collide with it
    var avoidCollisionVelocity = avoidColliding(
      boid.x + boid.velocity[0] * 1,
      boid.y + boid.velocity[1] * 1,
    );
    boid.velocity[0] += avoidCollisionVelocity[0];
    boid.velocity[1] += avoidCollisionVelocity[1];

    // force min and max speed
    var velocityMagnitude = Math.sqrt(
      Math.pow(boid.velocity[0], 2) + Math.pow(boid.velocity[1], 2),
    );
    if (velocityMagnitude < boidMinSpeed) {
      boid.velocity[0] = (boid.velocity[0] / velocityMagnitude) * boidMinSpeed;
      boid.velocity[1] = (boid.velocity[1] / velocityMagnitude) * boidMinSpeed;
    } else if (velocityMagnitude > boidMaxSpeed) {
      boid.velocity[0] = (boid.velocity[0] / velocityMagnitude) * boidMaxSpeed;
      boid.velocity[1] = (boid.velocity[1] / velocityMagnitude) * boidMaxSpeed;
    }

    boid.x += boid.velocity[0];
    boid.y += boid.velocity[1];
  }
}
function drawBoids(ctx) {
  boidColor = style.getPropertyValue("--boid-color");
  for (const boid of boids) {
    drawCircle(ctx, boid.x, boid.y, boidDrawSize, boidColor);
    if (debug) {
      drawCircle(ctx, boid.x, boid.y, boidProtectedRange, undefined, "#ff0000");
      drawCircle(ctx, boid.x, boid.y, boidVisualRange, undefined, "#ff5500");
      var nearby_boids = getBoidsInRange(
        boid.x,
        boid.y,
        boidProtectedRange,
      ).filter((b) => b !== boid);

      for (const near_boid of nearby_boids) {
        drawCircle(
          ctx,
          near_boid.x,
          near_boid.y,
          boidDrawSize + 5,
          undefined,
          "#00ff00",
        );
      }
    }
  }
}

let gridSize = 100;
let gridPixelSize = 2;
let backgroundColor = style.getPropertyValue("--background-color");
let gridColor = style.getPropertyValue("--grid-color");
let boidColor = style.getPropertyValue("--boid-color");

function update() {
  backgroundColor = style.getPropertyValue("--background-color");
  gridColor = style.getPropertyValue("--grid-color");
  boidColor = style.getPropertyValue("--boid-color");

  drawRect(0, 0, canvas.width, canvas.height, backgroundColor);
  // draw grid
  for (let x = 0; x < mapWidth / gridSize; x += 1) {
    for (let y = 0; y < mapHeight / gridSize; y += 1) {
      drawRect(
        x * gridSize,
        y * gridSize,
        gridPixelSize,
        gridPixelSize,
        gridColor,
      );
    }
  }
  updateBoids();
  requestAnimationFrame(update);
}

update();

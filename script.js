let gridSize = 100;
let gridPixelSize = 2;

function update() {
  drawRect(
    0,
    0,
    canvas.width,
    canvas.height,
    style.getPropertyValue("--background-color"),
  );
  // draw grid
  for (let x = 0; x < mapWidth / gridSize; x += 1) {
    for (let y = 0; y < mapHeight / gridSize; y += 1) {
      drawRect(
        x * gridSize,
        y * gridSize,
        gridPixelSize,
        gridPixelSize,
        style.getPropertyValue("--grid-color"),
      );
    }
  }
  updateBoids();
  requestAnimationFrame(update);
}

update();

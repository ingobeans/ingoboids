let gridSize = 100;
let gridPixelSize = 2;
let backgroundColor = style.getPropertyValue("--background-color");
let gridColor = style.getPropertyValue("--grid-color");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

boidProtectedRange = 20;
boidDrawSize = boidProtectedRange;

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mapWidth = canvas.width;
  mapHeight = canvas.height;
}
resizeCanvas();

const themes = {
  light: {
    "--background-color": " #f2f2f2",
    "--boid-color": " #e08aff",
    "--grid-color": " #0d091c",
    "--text-color": " #000",
  },
  dark: {
    "--background-color": "#000000",
    "--boid-color": "#e08aff",
    "--grid-color": "#7264a4",
    "--text-color": "#ffffff",
  },
};

function switchTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) {
    console.log("no such theme as ", themeName);
    return;
  }
  for (const variable in theme) {
    if (theme.hasOwnProperty(variable)) {
      document.documentElement.style.setProperty(variable, theme[variable]);
    }
  }
}

function updateThemeToSystem() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    switchTheme("dark");
  } else {
    switchTheme("light");
  }
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    updateThemeToSystem();
  });

updateThemeToSystem();

function update() {
  backgroundColor = style.getPropertyValue("--background-color");
  gridColor = style.getPropertyValue("--grid-color");
  boidColor = style.getPropertyValue("--boid-color");

  drawRect(ctx, 0, 0, canvas.width, canvas.height, backgroundColor);
  // draw grid
  for (let x = 0; x < mapWidth / gridSize; x += 1) {
    for (let y = 0; y < mapHeight / gridSize; y += 1) {
      drawRect(
        ctx,
        x * gridSize,
        y * gridSize,
        gridPixelSize,
        gridPixelSize,
        gridColor,
      );
    }
  }
  moveBoids();
  drawBoids(ctx);
  requestAnimationFrame(update);
}

createBoidsInClouds(
  (mapWidth * mapHeight) / 15408,
  parseInt((mapWidth * mapHeight) / 339723),
);
// create a suitable amount of boids and clouds for the screen size

update();

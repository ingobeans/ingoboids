let gridSize = 100;
let gridPixelSize = 2;
let backgroundColor = style.getPropertyValue("--background-color");
let gridColor = style.getPropertyValue("--grid-color");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let boidsActive = true;
let backgroundAnimationsIcon = document.getElementById(
  "background-animations-icon",
);
let themeIcon = document.getElementById("theme-icon");
let themeLabel = document.getElementById("theme-label");
let currentTheme = 0;
// 0 auto
// 1 dark
// 2 light

boidProtectedRange = 20;
boidDrawSize = boidProtectedRange;
boidMinSpeed = 2;
boidMaxSpeed = 4;

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mapWidth = canvas.width;
  mapHeight = canvas.height;
}
resizeCanvas();

let themes = {
  light: {
    "--background-color": "#f2f2f2",
    "--boid-color": "#e08aff",
    "--grid-color": "#0d091c",
    "--text-color": "#000",
    "--info-color": "#8a8cff",
  },
  dark: {
    "--background-color": "#000000",
    "--boid-color": "#e08aff",
    "--grid-color": "#7264a4",
    "--text-color": "#ffffff",
    "--info-color": "#8a8cff",
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
    if (currentTheme == 0) {
      updateThemeToSystem();
    }
  });

updateThemeToSystem();

function backgroundAnimationsButtonClick() {
  boidsActive = !boidsActive;
  if (boidsActive) {
    backgroundAnimationsIcon.classList = ["fa-solid fa-toggle-on"];
  } else {
    backgroundAnimationsIcon.classList = ["fa-solid fa-toggle-off"];
  }
}

function themeButtonClick() {
  currentTheme += 1;
  if (currentTheme > 2) {
    currentTheme = 0;
  }
  if (currentTheme == 1) {
    switchTheme("dark");
    themeIcon.classList = ["fa-solid fa-moon"];
    themeLabel.innerText = "theme dark";
  } else if (currentTheme == 2) {
    switchTheme("light");
    themeIcon.classList = ["fa-solid fa-sun"];
    themeLabel.innerText = "theme light";
  } else {
    updateThemeToSystem();
    themeIcon.classList = ["fa-solid fa-user"];
    themeLabel.innerText = "theme auto";
  }
}

function spawnSuitableAmountBoids() {
  createBoidsInClouds(
    (mapWidth * mapHeight) / 15408,
    Math.max(parseInt((mapWidth * mapHeight) / 339723), 1),
  );
}

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
  if (boidsActive) {
    moveBoids();
    drawBoids(ctx);
  }
  requestAnimationFrame(update);
}

spawnSuitableAmountBoids();

update();

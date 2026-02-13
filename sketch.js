/*
Week 5 — Example 5: Side-Scroller Platformer with JSON Levels + Modular Camera

Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
Date: Feb. 12, 2026

Move: WASD/Arrows | Jump: Space

Learning goals:
- Build a side-scrolling platformer using modular game systems
- Load complete level definitions from external JSON (LevelLoader + levels.json)
- Separate responsibilities across classes (Player, Platform, Camera, World)
- Implement gravity, jumping, and collision with platforms
- Use a dedicated Camera2D class for smooth horizontal tracking
- Support multiple levels and easy tuning through data files
- Explore scalable project architecture for larger games
*/

const VIEW_W = 800;
const VIEW_H = 480;

let allLevelsData;
let levelIndex = 0;

let level;
let player;
let cam;

function preload() {
  allLevelsData = loadJSON("levels.json"); // levels.json beside index.html [web:122]
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  cam = new Camera2D(width, height);
  loadLevel(levelIndex);
}

function loadLevel() {
  level = new WorldLevel();

  player = new BlobPlayer();
  player.spawnFromLevel(level);

  cam.x = 0;
  cam.y = level.h - height;
  cam.clampToWorld(level.w, level.h);
}

function draw() {
  player.update(level);

  // Falling death
  if (player.y - player.r > level.deathY) {
    loadLevel();
    return;
  }

  // Touch cloud = restart with new platforms
  if (
    player.x + player.r > level.cloud.x &&
    player.x - player.r < level.cloud.x + level.cloud.w &&
    player.y + player.r > level.cloud.y &&
    player.y - player.r < level.cloud.y + level.cloud.h
  ) {
    loadLevel();
    return;
  }

  // Vertical camera follow
  cam.followVertical(player.y, level.camLerp);
  cam.clampToWorld(level.w, level.h);

  cam.begin();
  level.drawWorld();
  player.draw(level.theme.blob);
  cam.end();

  // Simple HUD
  fill(0);
  textSize(16);
  text("Climb To The Clouds ☁", 10, 20);
  textSize(12);
  text("Click R to Reset", 10, 40); // Reset instruction
  text("A/D or ←/→ move", 10, 60); // controls
  text("Space/W/↑ jump", 10, 80); // controls
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.tryJump();
  }
  if (key === "r" || key === "R") loadLevel(levelIndex);
}

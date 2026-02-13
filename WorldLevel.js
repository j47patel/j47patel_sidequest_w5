class WorldLevel {
  constructor() {
    this.name = "Vertical Climb";

    this.theme = {
      bg: "#81c0e5ff",
      platform: "#096685ff",
      blob: "#ffffffff",
    };

    this.gravity = 0.65;
    this.jumpV = -13.5;
    this.camLerp = 0.12;

    this.w = 800;
    this.h = 4000;
    this.deathY = this.h + 200;

    this.platforms = [];

    this.generatePlatforms();

    this.start = {
      x: this.w / 2,
      y: this.h - 80,
      r: 20,
    };
  }

  generatePlatforms() {
    this.platforms = [];

    // 1️⃣ Full-width starting platform
    this.platforms.push(new Platform(0, this.h - 40, this.w, 40));

    // 2️⃣ Fixed route platforms (guaranteed)
    const spacing = 95; // vertical distance between platforms
    let currentY = this.h - 140; // first platform above bottom
    const platformWidth = 120;

    // Spread out more horizontally across the width
    const positionsX = [
      this.w / 4 - 40, // left
      this.w / 2 + 20, // center-right
      this.w / 4 - 30, // left
      this.w / 2 + 10, // center-right
      this.w / 3 - 40, // left-center
      this.w / 2 + 40, // center-right
      this.w / 4, // left
      this.w / 2 + 5, // center-right
      this.w / 3 - 10, // left-center
      this.w / 2 + 20, // center-right
      this.w / 4 - 5, // left
      this.w / 2, // center
    ];

    for (let i = 0; i < positionsX.length; i++) {
      // Add guaranteed platform
      this.platforms.push(
        new Platform(positionsX[i], currentY, platformWidth, 14),
      );

      // 3️⃣ Random extra platforms for variety
      const extraCount = floor(random(0, 3)); // 0–2 extra platforms per row
      for (let j = 0; j < extraCount; j++) {
        const extraW = random(80, 130);
        const extraX = random(0, this.w - extraW);
        this.platforms.push(new Platform(extraX, currentY, extraW, 14));
      }

      currentY -= spacing;
    }

    // -----------------------------
    // 4️⃣ Cloud platform at top
    // -----------------------------
    this.cloud = {
      x: this.w / 2 - 80,
      y: currentY - 60, // slightly above last platform
      w: 160,
      h: 40,
    };
  }

  drawWorld() {
    background(this.theme.bg);

    rectMode(CORNER);
    noStroke();
    fill(this.theme.platform);

    for (const p of this.platforms) {
      rect(p.x, p.y, p.w, p.h);
    }

    // draw cloud
    fill(255);
    ellipse(this.cloud.x + 40, this.cloud.y + 20, 60, 50);
    ellipse(this.cloud.x + 80, this.cloud.y + 10, 70, 60);
    ellipse(this.cloud.x + 120, this.cloud.y + 20, 60, 50);
  }
}

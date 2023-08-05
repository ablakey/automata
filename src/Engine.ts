import { Renderer } from "./Renderer";

const RATE = 100;

const cells = {
  Empty: 0xffe8c9b2,
  Sand: 0xff267fee,
};

export class Engine {
  renderer: Renderer;
  lastTime = 0;
  accumulatedTime = 0;

  constructor() {
    this.renderer = new Renderer();

    // Add a little data.
    for (let x = 0; x < this.renderer.width * this.renderer.height; x++) {
      this.renderer.buffer[x] = Math.random() < 0.9 ? cells.Empty : cells.Sand;
    }

    requestAnimationFrame(this.renderFrame.bind(this));
  }

  renderFrame(elapsed: number) {
    const delta = elapsed - this.lastTime;
    this.lastTime = elapsed;
    this.accumulatedTime += delta;

    if (this.accumulatedTime > RATE) {
      this.accumulatedTime -= RATE;
      this.tick();
    }

    requestAnimationFrame(this.renderFrame.bind(this));
  }

  tick() {
    console.log("tick");
    for (let x = 0; x < this.renderer.width; x++) {
      for (let y = 0; y < this.renderer.height; y++) {
        const c = this.renderer.get(x, y);
        if (c.cell === cells.Sand && c.down === cells.Empty) {
          this.renderer.set(x, y, cells.Empty);
          this.renderer.set(x, y + 1, cells.Sand);
        }
      }
    }

    this.renderer.draw();

    // TODO: Combine Renderer and Engine together.
    // Make Engine and Hourglass. Hourglass would have all the logic.
  }
}

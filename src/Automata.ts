import { MAJOR_AXIS_LENGTH, TICK_LENGTH } from "./config";

export class Automata {
  lastStamp = 0;
  accumulatedTime = 0;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cells: number[];
  dirtyFlags: number;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const wide = w > h;

    canvas.width = wide ? MAJOR_AXIS_LENGTH : MAJOR_AXIS_LENGTH / (h / w);
    canvas.height = wide ? MAJOR_AXIS_LENGTH / (w / h) : MAJOR_AXIS_LENGTH;
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;

    this.cells = new Array(this.width * this.height).fill(0);

    this.forEach((x, y) => {
      if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
        this.set(x, y, -1);
      }
    }, false);
  }

  get(x: number, y: number) {
    return this.cells[y * this.width + x];
  }

  set(x: number, y: number, value: number) {
    this.cells[y * this.width + x] = value;
  }

  forEach(fn: (x: number, y: number) => void, skipEdges = true) {
    const t0 = performance.now();
    const init = skipEdges ? 1 : 0;
    const maxX = skipEdges ? this.width - 1 : this.width;
    const maxY = skipEdges ? this.height - 1 : this.height;
    for (let x = init; x < maxX; x++) {
      for (let y = init; y < maxY; y++) {
        // TODO: neighbours.
        fn(x, y);
      }
    }
    // console.log(performance.now() - t0);
  }

  draw() {
    this.forEach((x, y) => {
      this.ctx.fillStyle = this.get(x, y) === -1 ? "rgba(0,0,0,1)" : "rgba(0,100,0,1)";
      this.ctx.fillRect(x, y, 1, 1);
    }, false);
  }

  tick() {
    this.draw();
  }

  loop() {
    // Do not count the first loop. It might be a lot of time.
    const now = performance.now();
    if (this.lastStamp) {
      this.accumulatedTime += now - this.lastStamp;
    }
    this.lastStamp = now;

    // If we accumulated a ton of time, drain it. This is probably because we tabbed away for a while.
    if (this.accumulatedTime > TICK_LENGTH * 2) {
      this.accumulatedTime %= TICK_LENGTH;
    }

    if (this.accumulatedTime > TICK_LENGTH) {
      this.tick();
      this.accumulatedTime -= TICK_LENGTH;
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

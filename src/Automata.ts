const WALL_CELL = 999;

export abstract class Cell {
  color: string;
  abstract readonly name: string;
  state: any;
  run: (engine: Automata<typeof Cell>) => void;
}

export class Automata<T extends typeof Cell> {
  tickLength;
  lastStamp = 0;
  accumulatedTime = 0;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cells: InstanceType<T>[];
  dirtyFlags: number;

  constructor(options?: { tickLength?: number; majorAxisSize?: number }) {
    // this.cellTypes[WALL_CELL] = { color: "black", run: () => {} };
    this.tickLength = options?.tickLength ?? 100;
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const s = options?.majorAxisSize ?? 200;

    const wide = w > h;

    canvas.width = wide ? s : s / (h / w);
    canvas.height = wide ? s / (w / h) : s;
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;

    this.cells = new Array(this.width * this.height).fill(0);

    // Add wall around edge.
    this.forEach((x, y) => {
      if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
        this.get(x, y).;
      }
    }, false);
  }

  get(x: number, y: number) {
    return this.cells[y * this.width + x];
  }

  forEach(fn: (x: number, y: number, cell: InstanceType<T>) => void, skipEdges = true) {
    const init = skipEdges ? 1 : 0;
    const maxX = skipEdges ? this.width - 1 : this.width;
    const maxY = skipEdges ? this.height - 1 : this.height;
    for (let x = init; x < maxX; x++) {
      for (let y = init; y < maxY; y++) {
        // TODO: neighbours.
        fn(x, y, this.get(x, y));
      }
    }
  }

  tick() {
    this.forEach((x, y, cell) => {
      // Update state.

      // Draw.
      // this.ctx.fillStyle = cellType.color;
      this.ctx.fillRect(x, y, 1, 1);
    }, false);
  }

  loop() {
    // Do not count the first loop. It might be a lot of time.
    const now = performance.now();
    if (this.lastStamp) {
      this.accumulatedTime += now - this.lastStamp;
    }
    this.lastStamp = now;

    // If we accumulated a ton of time, drain it. This is probably because we tabbed away for a while.
    if (this.accumulatedTime > this.tickLength * 2) {
      this.accumulatedTime %= this.tickLength;
    }

    if (this.accumulatedTime > this.tickLength) {
      this.tick();
      this.accumulatedTime -= this.tickLength;
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

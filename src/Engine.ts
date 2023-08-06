const FPS = 60;

const PIXEL_SCALE = 4;

export type Position = [number, number];

type Cell = {
  pos: Position;
  value: number;
};

class Kernel {
  private engine: Engine;
  private readonly x: number;
  private readonly y: number;

  constructor(pos: Position, engine: Engine) {
    this.x = pos[0];
    this.y = pos[1];
    this.engine = engine;
  }

  get cell() {
    return this.engine.get([this.x, this.y]);
  }

  get top() {
    return this.engine.get([this.x, this.y - 1]);
  }

  get bot() {
    return this.engine.get([this.x, this.y + 1]);
  }

  get left() {
    return this.engine.get([this.x - 1, this.y]);
  }

  get right() {
    return this.engine.get([this.x + 1, this.y]);
  }

  get topleft() {
    return this.engine.get([this.x - 1, this.y - 1]);
  }

  get topright() {
    return this.engine.get([this.x + 1, this.y - 1]);
  }

  get botleft() {
    return this.engine.get([this.x - 1, this.y + 1]);
  }

  get botright() {
    return this.engine.get([this.x + 1, this.y + 1]);
  }
}

export class Engine {
  // Image and data.
  public readonly width: number;
  public readonly height: number;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private values: Uint32Array;
  private touched: Uint8Array;

  // Simulation loop.
  private lastTime = 0;
  private accumulatedTime = 0;
  private tickCallback: VoidFunction;

  constructor(config: {
    tickCallback: () => void;
    onClick: (pos: Position) => void;
    wallValue: number;
    emptyValue: number;
  }) {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    this.width = Math.floor(canvas.offsetWidth / PIXEL_SCALE);
    this.height = Math.floor(canvas.offsetHeight / PIXEL_SCALE);
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.values = new Uint32Array(this.imageData.data.buffer);
    this.touched = new Uint8Array(this.width * this.height);

    canvas.addEventListener("mousemove", (e) => {
      if (e.buttons) {
        config.onClick([Math.floor(e.clientX / PIXEL_SCALE), Math.floor(e.clientY / PIXEL_SCALE)]);
      }
    });

    // Add walls around the area.
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let value = config.emptyValue;
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
          value = config.wallValue;
        }
        this.values[y * this.width + x] = value;
      }
    }

    // Initialize and begin loop.
    this.tickCallback = config.tickCallback;
    requestAnimationFrame(this.renderFrame.bind(this));

    console.log(`Initiated. Width: ${this.width}, Height: ${this.height}`);
  }

  renderFrame(elapsed: number) {
    const delta = elapsed - this.lastTime;
    this.lastTime = elapsed;
    this.accumulatedTime += delta;

    if (this.accumulatedTime > 1000 / FPS) {
      // Clear the flags each tick.
      this.touched = new Uint8Array(this.width * this.height);
      this.accumulatedTime -= Math.max(1000 / FPS, 0);
      this.tickCallback();
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    requestAnimationFrame(this.renderFrame.bind(this));
  }

  /**
   * This is an incredibly hot function. Called for every cell.  Amazingly, some basic cases affect performance
   * significantly:
   *
   * - `idx` vs. doing the basic math twice saves about 10%.
   * - leaving `touched` as an integer rather than a boolean saves about 15%.
   * - Eliminating `touched` altogether is about 50%.
   */
  get(pos: Position): Cell {
    const idx = this.width * pos[1] + pos[0];
    return {
      pos,
      value: this.values[idx],
    };
  }

  forEach(callback: (kernel: Kernel) => void) {
    // We don't iterate over the wals.
    for (let x = 1; x < this.width - 1; x++) {
      for (let y = 1; y < this.height - 1; y++) {
        if (!this.touched[y * this.width + x]) {
          const k = new Kernel([x, y], this);
          callback(k);
        }
      }
    }
  }

  set(pos: Position, value: number) {
    // Cannot set on wall or out of bounds.
    if (pos[0] === 0 || pos[1] === 0 || pos[0] === this.width || pos[1] === this.height) {
      return;
    }

    const idx = this.width * pos[1] + pos[0];
    this.values[idx] = value;
    this.touched[idx] = 1;
  }

  fillRect(pos: Position, width: number, height: number, value: number) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], value);
      }
    }
  }
}

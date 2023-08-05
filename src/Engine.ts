const FPS = 1;

const PIXEL_SCALE = 4;

type Position = [number, number];

type Cell = {
  pos: Position;
  value: number;
  touched: boolean;
};

type Kernel = {
  cell: Cell;
  up: Cell;
  down: Cell;
  left: Cell;
  right: Cell;
};

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

  constructor(tickCallback: () => void) {
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

    // Initialize and begin loop.
    this.tickCallback = tickCallback;
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

  private getCell(pos: Position): Cell {
    return {
      pos,
      value: this.values[this.width * pos[1] + pos[0]],
      touched: this.touched[this.width * pos[1] + pos[0]] === 1,
    };
  }

  get(pos: Position): Kernel {
    const [x, y] = pos;

    return {
      cell: this.getCell(pos)!,
      up: this.getCell([x, y - 1]),
      down: this.getCell([x, y + 1]),
      left: this.getCell([x - 1, y]),
      right: this.getCell([x + 1, y]),
    };
  }

  set(pos: Position, value: number) {
    const idx = this.width * pos[1] + pos[0];
    this.values[idx] = value;
    this.touched[idx] = 1;
  }
}

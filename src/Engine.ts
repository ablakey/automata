const FPS = 60;

const PIXEL_SCALE = 4;

export type Position = [number, number];

type Cell = {
  pos: Position;
  value: number;
  touched: boolean;
};

type Kernel = {
  cell: Cell;
  top: Cell;
  bot: Cell;
  left: Cell;
  right: Cell;
  topleft: Cell;
  topright: Cell;
  botleft: Cell;
  botright: Cell;
};

export class Engine {
  public Wall = 0xff000000;
  public Empty = 0xffe8c9b2;

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

  constructor(tickCallback: () => void, onClick: (pos: Position) => void) {
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
        onClick([Math.floor(e.clientX / PIXEL_SCALE), Math.floor(e.clientY / PIXEL_SCALE)]);
      }
    });

    // Add walls around the area.
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let value = this.Empty;
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
          value = this.Wall;
        }
        this.values[y * this.width + x] = value;
      }
    }

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
      top: this.getCell([x, y - 1]),
      bot: this.getCell([x, y + 1]),
      left: this.getCell([x - 1, y]),
      right: this.getCell([x + 1, y]),
      topleft: this.getCell([x - 1, y - 1]),
      topright: this.getCell([x + 1, y - 1]),
      botleft: this.getCell([x - 1, y + 1]),
      botright: this.getCell([x + 1, y + 1]),
    };
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

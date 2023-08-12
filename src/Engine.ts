import { Kernel } from "./Kernel";
import { CellName, cellDescriptions, cellValueMap } from "./cells";
import { SIM_SIZE, FPS } from "./config";

export type Position = [number, number];

type Cell = { pos: Position; type: CellName };

export class Engine {
  // Image and data.
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private buffer: Uint32Array;
  private cells: Cell[];

  // Simulation loop.
  private lastTime = 0;
  private accumulatedTime = 0;

  constructor() {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    canvas.width = SIM_SIZE;
    canvas.height = SIM_SIZE;
    this.ctx = canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(SIM_SIZE, SIM_SIZE);

    this.cells = [];

    this.resizeCanvas();

    // Initialize the area with walls and empty.
    for (let x = 0; x < SIM_SIZE; x++) {
      for (let y = 0; y < SIM_SIZE; y++) {
        const isWall = x === 0 || y === 0 || x === SIM_SIZE - 1 || y === SIM_SIZE - 1;
        this.set([x, y], isWall ? "Wall" : "Empty");
      }
    }

    // Initialize and begin loop.
    requestAnimationFrame(this.frameRequestCallback.bind(this));
  }

  /**
   * Set up canvas dimensions. This is kinda janky but the CSS is driving me mad. The canvas needs to always be a
   * square and fill as much space as posible without overflowing other elements.
   *
   * We allow flexbox to fill whatever space is leftover with #viewport, and then find the smallest dimension: width
   * or height, and set the canvas to those. We then remove `flex-grow: 1` in order to give back any remaining space
   * to the UI elements below.
   */
  private resizeCanvas() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    const frame = document.querySelector<HTMLDivElement>("#viewport")!;
    const canvasSize = Math.min(frame.offsetWidth, frame.offsetHeight);
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    frame.style.flexGrow = "unset";
  }

  private frameRequestCallback(elapsed: number) {
    const delta = elapsed - this.lastTime;
    this.lastTime = elapsed;
    this.accumulatedTime += delta;

    if (this.accumulatedTime > 1000 / FPS) {
      this.tick();
      this.accumulatedTime -= Math.max(1000 / FPS, 0);
    }

    requestAnimationFrame(this.frameRequestCallback.bind(this));
  }

  private tick() {
    this.forEach((kernel) => {
      cellDescriptions[kernel.cell.type].rule(kernel, this);
    });

    // this.ctx.putImageData(this.doubleBuffer.imageData, 0, 0);
  }

  forEach(callback: (kernel: Kernel) => void) {
    for (let x = 1; x < SIM_SIZE - 1; x++) {
      for (let y = 1; y < SIM_SIZE - 1; y++) {
        const kernel = new Kernel([x, y], this);
        callback(kernel);
      }
    }
  }

  get(pos: Position): Cell {
    return this.cells[SIM_SIZE * pos[1] + pos[0]];
  }

  set(pos: Position | Cell, type: CellName) {
    if (!Array.isArray(pos)) {
      pos = pos.pos;
    }

    // Cannot set on wall or out of bounds.
    if (pos[0] < 1 || pos[1] < 1 || pos[0] >= SIM_SIZE - 1 || pos[1] >= SIM_SIZE - 1) {
      return;
    }

    const idx = SIM_SIZE * pos[1] + pos[0];
    const value = cellDescriptions[type].value;
    // TODO: If `Cell` becomes more complicated, we'll have to do more work than this.
    this.cells[idx].type = type;

    this.buffer[idx] = value;
  }

  fillRect(pos: Position, width: number, height: number, type: CellName) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], type);
      }
    }
  }
}

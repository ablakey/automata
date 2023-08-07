import { CellType, cellDescriptions, cellValueMap } from "./cells";
import { SIM_SIZE, FPS } from "./config";

export type Position = [number, number];

type Cell = { pos: Position; type: CellType };

export class Engine {
  // Image and data.
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private values: Uint32Array;
  private touched: Uint8Array;

  // Simulation loop.
  private lastTime = 0;
  private accumulatedTime = 0;
  // private tickCallback: VoidFunction;

  constructor() {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    this.ctx = canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(SIM_SIZE, SIM_SIZE);
    this.values = new Uint32Array(this.imageData.data.buffer);
    this.touched = new Uint8Array(SIM_SIZE * SIM_SIZE);

    this.resizeCanvas();

    // canvas.addEventListener("mousemove", (e) => {
    //   if (e.buttons) {
    //     config.onClick([Math.floor(e.clientX / PIXEL_SCALE), Math.floor(e.clientY / PIXEL_SCALE)]);
    //   }
    // });

    // Initialize the area with walls and empty.
    for (let x = 0; x < SIM_SIZE; x++) {
      for (let y = 0; y < SIM_SIZE; y++) {
        let value = cellDescriptions.Empty.value;
        if (x === 0 || y === 0 || x === SIM_SIZE - 1 || y === SIM_SIZE - 1) {
          value = cellDescriptions.Wall.value;
        }
        this.values[y * SIM_SIZE + x] = value;
      }
    }

    // Initialize and begin loop.
    requestAnimationFrame(this.renderFrame.bind(this));
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

  private renderFrame(elapsed: number) {
    const delta = elapsed - this.lastTime;
    this.lastTime = elapsed;
    this.accumulatedTime += delta;

    if (this.accumulatedTime > 1000 / FPS) {
      // Clear the flags each tick.
      this.touched = new Uint8Array(SIM_SIZE * SIM_SIZE);

      for (let x = 1; x < SIM_SIZE - 1; x++) {
        for (let y = 1; y < SIM_SIZE - 1; y++) {
          if (!this.touched[y * SIM_SIZE + x]) {
            const value = this.values[y * SIM_SIZE + x];
            const kernel = new Kernel([x, y], this);
            const name = cellValueMap[value];
            cellDescriptions[name].rule(kernel, this);
          }
        }
      }

      this.accumulatedTime -= Math.max(1000 / FPS, 0);
      this.ctx.putImageData(this.imageData, 0, 0);
    }

    requestAnimationFrame(this.renderFrame.bind(this));
  }

  private isOutOfBounds(pos: Position) {
    return pos[0] < 1 || pos[1] < 1 || pos[0] >= SIM_SIZE - 1 || pos[1] >= SIM_SIZE - 1;
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
    const idx = SIM_SIZE * pos[1] + pos[0];
    return {
      pos,
      type: cellValueMap[this.values[idx]] as CellType,
    };
  }

  set(pos: Position, type: CellType) {
    // Cannot set on wall or out of bounds.
    if (this.isOutOfBounds(pos)) {
      return;
    }

    const idx = SIM_SIZE * pos[1] + pos[0];
    const value = cellDescriptions[type].value;
    this.values[idx] = value;
    this.touched[idx] = 1;
  }

  fillRect(pos: Position, width: number, height: number, type: CellType) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], type);
      }
    }
  }
}

/**
 * Read-only accessor for a cell and its surrounding cells.
 * Getters are lazy for optimization. No point doing lookups for data we don't use.
 */
export class Kernel {
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

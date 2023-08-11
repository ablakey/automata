import { Kernel } from "./Kernel";
import { CellName, cellDescriptions, cellValueMap } from "./cells";
import { SIM_SIZE, FPS } from "./config";

export type Position = [number, number];

type Cell = { pos: Position; type: CellName };

class DoubleBuffer {
  private imageA: ImageData;
  private bufferA: Uint32Array;

  private imageB: ImageData;
  private bufferB: Uint32Array;

  private useA = true;

  constructor(w: number, h: number) {
    this.imageA = new ImageData(w, h);
    this.bufferA = new Uint32Array(this.imageA.data.buffer);

    this.imageB = new ImageData(w, h);
    this.bufferB = new Uint32Array(this.imageB.data.buffer);
  }

  get current() {
    return this.useA ? this.bufferA : this.bufferB;
  }

  get other() {
    return this.useA ? this.bufferB : this.bufferA;
  }

  get imageData() {
    return this.useA ? this.imageA : this.imageB;
  }

  swap() {
    this.current.set(this.other);
    this.useA = !this.useA;
  }
}

export class Engine {
  // Image and data.
  private ctx: CanvasRenderingContext2D;
  private doubleBuffer: DoubleBuffer;

  // Simulation loop.
  private lastTime = 0;
  private accumulatedTime = 0;

  constructor() {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    canvas.width = SIM_SIZE;
    canvas.height = SIM_SIZE;
    this.ctx = canvas.getContext("2d")!;

    this.doubleBuffer = new DoubleBuffer(SIM_SIZE, SIM_SIZE);

    this.resizeCanvas();

    // Initialize the area with walls and empty.
    for (let x = 0; x < SIM_SIZE; x++) {
      for (let y = 0; y < SIM_SIZE; y++) {
        let value = cellDescriptions.Empty.value;
        if (x === 0 || y === 0 || x === SIM_SIZE - 1 || y === SIM_SIZE - 1) {
          value = cellDescriptions.Wall.value;
        }
        this.doubleBuffer.current[y * SIM_SIZE + x] = value;
        this.doubleBuffer.other[y * SIM_SIZE + x] = value;
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

    this.doubleBuffer.swap();
    this.ctx.putImageData(this.doubleBuffer.imageData, 0, 0);
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
    const idx = SIM_SIZE * pos[1] + pos[0];
    return {
      pos,
      type: cellValueMap[this.doubleBuffer.current[idx]] as CellName,
    };
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
    this.doubleBuffer.other[idx] = value;
  }

  fillRect(pos: Position, width: number, height: number, type: CellName) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], type);
      }
    }
  }
}

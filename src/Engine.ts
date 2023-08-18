import { Cell } from "./Cell";
import { CellType, cellDict } from "./cells";
import { SIM_SIZE, FPS, ITERATION_METHOD } from "./config";

export type Position = [number, number];

export class Engine {
  // Image and data.
  public generation = 0;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private buffer: Uint32Array;
  private cells: Cell[] = [];

  // Simulation loop.
  private lastTime = 0;
  private accumulatedTime = 0;

  // UI.
  private selectedType: CellType = "Sand";

  constructor() {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    canvas.width = SIM_SIZE;
    canvas.height = SIM_SIZE;
    this.ctx = canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(SIM_SIZE, SIM_SIZE);
    this.buffer = new Uint32Array(this.imageData.data.buffer);

    this.resizeCanvas();

    // Initialize the area with walls and empty.
    for (let x = 0; x < SIM_SIZE; x++) {
      for (let y = 0; y < SIM_SIZE; y++) {
        const isWall = x === 0 || y === 0 || x === SIM_SIZE - 1 || y === SIM_SIZE - 1;
        const type = isWall ? "Wall" : "Empty";
        const idx = y * SIM_SIZE + x;
        this.cells[idx] = new Cell([x, y], type, this);
        this.buffer[idx] = cellDict[type].value;
      }
    }

    // Build the type selection UI.
    const controlsEl = document.querySelector<HTMLDivElement>("#controls")!;

    Object.entries(cellDict).forEach(([name, cellDef]) => {
      if (cellDef.ui !== undefined) {
        const el = document.createElement("div");
        el.onclick = this.onTypeClick.bind(this, name);
        el.innerText = cellDef.ui!.icon;
        el.id = name;
        el.className = this.selectedType === name ? "selected" : "";
        controlsEl.appendChild(el);
      }
    });

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
    this.generation++;
    this.forEach((cell) => {
      cellDict[cell.type].rule(cell, this);
    });

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private forEachRandom(callback: (cell: Cell) => void) {
    const arr = Array.from(Array(SIM_SIZE * SIM_SIZE).keys());

    let j: number, x: number, index: number;
    for (index = arr.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = arr[index];
      arr[index] = arr[j];
      arr[j] = x;
    }
    arr.forEach((c) => callback(this.cells[c]));
  }

  private forEachTopDown(callback: (cell: Cell) => void) {
    for (let x = 1; x < SIM_SIZE - 1; x++) {
      for (let y = 1; y < SIM_SIZE - 1; y++) {
        const cell = this.get([x, y]);
        if (!cell.touched) {
          callback(this.get([x, y]));
        }
      }
    }
  }

  private forEachBottomUp(callback: (cell: Cell) => void) {
    for (let x = 1; x < SIM_SIZE - 1; x++) {
      for (let y = SIM_SIZE - 1; y > 0; y--) {
        const cell = this.get([x, y]);
        if (!cell.touched) {
          callback(this.get([x, y]));
        }
      }
    }
  }

  forEach(callback: (cell: Cell) => void) {
    if (ITERATION_METHOD === "TopDown") {
      this.forEachTopDown(callback);
    } else if (ITERATION_METHOD === "BottomUp") {
      this.forEachBottomUp(callback);
    } else {
      this.forEachRandom(callback);
    }
  }

  get(pos: Position): Cell {
    return this.cells[SIM_SIZE * pos[1] + pos[0]];
  }

  set(pos: Position | Cell, type: CellType) {
    if (!Array.isArray(pos)) {
      pos = pos.pos;
    }

    // Cannot set on wall or out of bounds.
    if (pos[0] < 1 || pos[1] < 1 || pos[0] >= SIM_SIZE - 1 || pos[1] >= SIM_SIZE - 1) {
      return;
    }

    const idx = SIM_SIZE * pos[1] + pos[0];

    const cell = this.cells[idx];

    // Update the cell state.
    cell.type = type;
    cell.lastTouched = this.generation;

    // Update the graphics buffer.
    const value = cellDict[type].value;
    this.buffer[idx] = value;
  }

  fillRect(pos: Position, width: number, height: number, type: CellType) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], type);
      }
    }
  }

  onTypeClick(type: CellType) {
    document.querySelector(`#${this.selectedType}`)!.className = "";
    document.querySelector(`#${type}`)!.className = "selected";
    this.selectedType = type;
  }
}

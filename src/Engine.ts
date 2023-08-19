import { Cell } from "./Cell";
import { CellType, cellDict } from "./cells";
import { SIM_SIZE, FPS, ITERATION_METHOD } from "./config";

export type Position = [number, number];

export class Engine {
  // Image and data
  public generation = 0;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private buffer: Uint32Array;
  private cells: Cell[] = [];

  // Simulation loop
  private lastTime = 0;
  private accumulatedTime = 0;

  // UI
  private selectedType: CellType = "Sand";

  constructor() {
    // Initialize image and data.
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
    canvas.width = SIM_SIZE;
    canvas.height = SIM_SIZE;
    this.ctx = canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(SIM_SIZE, SIM_SIZE);
    this.buffer = new Uint32Array(this.imageData.data.buffer);

    // Initialize the cells, adding a wall.
    for (let x = 0; x < SIM_SIZE; x++) {
      for (let y = 0; y < SIM_SIZE; y++) {
        const isWall = x === 0 || y === 0 || x === SIM_SIZE - 1 || y === SIM_SIZE - 1;
        const type = isWall ? "Wall" : "Empty";
        const idx = y * SIM_SIZE + x;
        this.cells[idx] = new Cell([x, y], type, this);
        this.buffer[idx] = cellDict[type].colour as number; // Wall and Empty  ever have diferent colours.
      }
    }

    // Set up mouse interaction with canvas.
    (["mousedown", "mousemove"] as const).forEach((type) => {
      canvas.addEventListener(type, (e) => {
        if (!e.buttons) {
          return;
        }
        const x = Math.floor((e.offsetX / canvas.offsetWidth) * SIM_SIZE);
        const y = Math.floor((e.offsetY / canvas.offsetHeight) * SIM_SIZE);
        this.onScreenClick([x, y]);
      });
    });

    // Set up touch interaction with canvas.
    (["touchmove", "touchstart"] as const).forEach((type) => {
      canvas.addEventListener(type, (e) => {
        const t0 = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(((t0.clientX - rect.left) / canvas.offsetWidth) * SIM_SIZE);
        const y = Math.floor(((t0.clientY - rect.top) / canvas.offsetHeight) * SIM_SIZE);
        this.onScreenClick([x, y]);
      });
    });

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

    requestAnimationFrame(this.frameRequestCallback.bind(this));
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

  set(pos: Position | Cell, type: CellType, value?: number) {
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
    cell.value = value ?? cell.type === type ? cell.value++ : 1;
    cell.type = type;
    cell.lastTouched = this.generation;

    // Update the graphics buffer.

    const colour = cellDict[type].colour;
    this.buffer[idx] = Array.isArray(colour) ? colour[cell.value] : colour;
  }

  fillRect(pos: Position, width: number, height: number, type: CellType) {
    for (let x = pos[0]; x < pos[0] + width; x++) {
      for (let y = pos[1]; y < pos[1] + height; y++) {
        this.set([x, y], type);
      }
    }
  }

  onScreenClick(pos: Position) {
    this.set(pos, this.selectedType);
  }

  onTypeClick(type: CellType) {
    document.querySelector(`#${this.selectedType}`)!.className = "";
    document.querySelector(`#${type}`)!.className = "selected";
    this.selectedType = type;
  }
}

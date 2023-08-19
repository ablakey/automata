import { Engine, Position } from "./Engine";
import { CellType, cellDict } from "./cells";
import { assert } from "ts-essentials";

/**
 * Read-only accessor for a cell and its surrounding cells.
 * Getters are lazy for optimization. No point doing lookups for data we don't use. But still need to avoid repeating
 * the lookups.
 */
export class Cell {
  private engine: Engine;
  lastChanged = -1; // Generation that this cell was last updated.
  type: CellType;
  pos: Position;
  value = 0;

  constructor(pos: Position, type: CellType, engine: Engine) {
    this.pos = pos;
    this.engine = engine;
    this.type = type;
  }

  is(...types: CellType[]) {
    return types.includes(this.type);
  }

  feed(target: Cell, max?: number) {
    const emptied = target.empty(Math.min(target.value, max ? Math.round(max) : Number.POSITIVE_INFINITY));
    const filled = this.fill(emptied);
    target.fill(emptied - filled);
  }

  fill(amount: number): number {
    const capacity = (this.def.max ?? 1) - this.value;
    const filled = Math.min(amount, capacity);
    this.value += filled;

    assert(this.value >= 0);
    assert(this.value <= (this.def.max ?? 1));

    this.draw();

    return filled;
  }

  empty(amount: number): number {
    const emptied = Math.min(amount, this.value);
    this.value -= emptied;

    assert(this.value >= 0);
    assert(this.value <= (this.def.max ?? 1));

    this.draw();

    return emptied;
  }

  get def() {
    return cellDict[this.type];
  }

  get changed() {
    return this.lastChanged === this.engine.generation;
  }

  get top() {
    return this.engine.get([this.pos[0], this.pos[1] - 1]);
  }

  get bot() {
    return this.engine.get([this.pos[0], this.pos[1] + 1]);
  }

  get left() {
    return this.engine.get([this.pos[0] - 1, this.pos[1]]);
  }

  get right() {
    return this.engine.get([this.pos[0] + 1, this.pos[1]]);
  }

  get topleft() {
    return this.engine.get([this.pos[0] - 1, this.pos[1] - 1]);
  }

  get topright() {
    return this.engine.get([this.pos[0] + 1, this.pos[1] - 1]);
  }

  get botleft() {
    return this.engine.get([this.pos[0] - 1, this.pos[1] + 1]);
  }

  get botright() {
    return this.engine.get([this.pos[0] + 1, this.pos[1] + 1]);
  }

  *[Symbol.iterator]() {
    yield this.topleft;
    yield this.top;
    yield this.topright;
    yield this.right;
    yield this.botright;
    yield this.bot;
    yield this.botleft;
  }

  getCount(name: CellType) {
    let count = 0;
    for (const n of this) {
      if (n.type === name) {
        count++;
      }
    }
    return count;
  }

  set(type: CellType, amount?: number) {
    // Cannot be changed if it's already that type.
    if (this.type === type) {
      return;
    }

    // Cannot change a cell if it's already been changed this generation, unless it's empty.
    if (this.lastChanged == this.engine.generation && this.type !== "Empty") {
      return;
    }

    // Change it to the new value.
    this.type = type;
    this.lastChanged = this.engine.generation;
    this.value = 0;
    this.fill(amount ?? 0);

    this.draw();
  }

  private draw() {
    const c = this.def.colour;
    const colour = Array.isArray(c) ? c[Math.max(this.value - 1, 0)] : c;
    this.engine.draw(this.pos, colour);
  }
}

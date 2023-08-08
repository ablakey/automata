import { Engine, Position } from "./Engine";
import { CellName, cellNames } from "./cells";

/**
 * Read-only accessor for a cell and its surrounding cells.
 * Getters are lazy for optimization. No point doing lookups for data we don't use. But still need to avoid repeating
 * the lookups.
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

  *[Symbol.iterator]() {
    yield this.topleft;
    yield this.top;
    yield this.topright;
    yield this.right;
    yield this.botright;
    yield this.bot;
    yield this.botleft;
  }

  getCount(name: CellName) {
    let count = 0;
    for (const n of this) {
      if (n.type === name) {
        count++;
      }
    }
    return count;
  }
}

import { Engine, Position } from "./Engine";
import { CellType } from "./cells";

/**
 * Read-only accessor for a cell and its surrounding cells.
 * Getters are lazy for optimization. No point doing lookups for data we don't use. But still need to avoid repeating
 * the lookups.
 */
export class Cell {
  private engine: Engine;
  type: CellType;
  pos: Position;

  constructor(pos: Position, engine: Engine) {
    this.pos = pos;
    this.engine = engine;
  }

  get cell() {
    return this.engine.get([this.pos[0], this.pos[1]]);
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
}

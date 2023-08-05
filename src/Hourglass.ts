import { Engine, Position } from "./Engine";

const Empty = 0xffe8c9b2;
const Sand = 0xff267fee;
const Wall = 0xff000000;
const Generator = 0xffff0000;

export class Hourglass {
  engine: Engine;

  constructor() {
    this.engine = new Engine(this.tick.bind(this), this.onClick.bind(this));

    // this.engine.fillRect([100, 30], 1, 100, Sand);

    this.engine.set([143, 10], Generator);
    this.engine.set([118, 30], Generator);
    this.engine.set([78, 50], Generator);
    this.engine.set([30, 40], Generator);
    this.engine.set([180, 40], Generator);
    this.engine.set([160, 40], Generator);
    this.engine.set([10, 40], Generator);
    this.engine.set([40, 40], Generator);
    this.engine.set([60, 40], Generator);

    this.engine.fillRect([20, 90], 30, 10, Wall);
    this.engine.fillRect([120, 90], 60, 6, Wall);
    this.engine.fillRect([100, 155], 5, 40, Wall);
  }

  onClick(pos: Position) {
    this.engine.fillRect(pos, 3, 3, Sand);
  }

  tick() {
    // Need to use these classic loops.  A `forEach` abstraction is about 10x slower.
    // We don't iterate over the wals.
    for (let x = 1; x < this.engine.width - 1; x++) {
      for (let y = 1; y < this.engine.height - 1; y++) {
        const kernel = this.engine.get([x, y]);
        const { cell, left, right, bot, top, botleft, botright } = kernel;

        // Ignore cells that have already been processed.
        if (cell.touched && cell.value !== Empty) {
          continue;
        }

        // Generator?
        if (cell.value === Generator && bot.value === Empty && Math.random() > 0.1) {
          this.engine.set(bot.pos, Sand);
        }

        // Not sand?
        if (cell.value !== Sand) {
          continue;
        }

        // Move down?
        if (bot.value === Empty) {
          this.engine.set(cell.pos, Empty);
          this.engine.set(kernel.bot.pos, Sand);
          continue;
        }

        const canFallLeft = botleft.value === Empty && bot.value !== Empty;
        const canFallRight = botright.value === Empty && bot.value !== Empty;

        if (canFallLeft && canFallRight) {
          this.engine.set(cell.pos, Empty);
          this.engine.set(Math.random() > 0.5 ? kernel.botleft.pos : kernel.botright.pos, Sand);
          continue;
        }

        // Fall left?
        if (canFallLeft) {
          this.engine.set(cell.pos, Empty);
          this.engine.set(kernel.botleft.pos, Sand);
          continue;
        }

        // Fall right?
        if (canFallRight) {
          this.engine.set(cell.pos, Empty);
          this.engine.set(kernel.botright.pos, Sand);
          continue;
        }
      }
    }
  }
}

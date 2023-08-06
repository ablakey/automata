import { Engine, Position } from "./Engine";

const values = {
  Empty: 0xffe8c9b2,
  Sand: 0xff267fee,
  Wall: 0xff000000,
  Generator: 0xffff0000,
};

export class Hourglass {
  engine: Engine;

  constructor() {
    this.engine = new Engine({
      tickCallback: this.tick.bind(this),
      onClick: this.onClick.bind(this),
      wallValue: values.Wall,
      emptyValue: values.Empty,
    });

    // this.engine.fillRect([100, 30], 1, 100, Sand);

    this.engine.set([143, 10], values.Generator);
    this.engine.set([118, 30], values.Generator);
    this.engine.set([78, 50], values.Generator);
    this.engine.set([30, 40], values.Generator);
    this.engine.set([180, 40], values.Generator);
    this.engine.set([160, 40], values.Generator);
    this.engine.set([10, 40], values.Generator);
    this.engine.set([40, 40], values.Generator);
    this.engine.set([60, 40], values.Generator);

    this.engine.fillRect([20, 90], 30, 10, values.Wall);
    this.engine.fillRect([120, 90], 60, 6, values.Wall);
    this.engine.fillRect([100, 155], 5, 40, values.Wall);
  }

  onClick(pos: Position) {
    this.engine.fillRect(pos, 3, 3, values.Sand);
  }

  tick() {
    // Need to use these classic loops.  A `forEach` abstraction is about 10x slower.
    // We don't iterate over the wals.
    this.engine.forEach((kernel) => {
      const { cell, left, right, bot, top, botleft, botright } = kernel;

      // Ignore cells that have already been processed.
      // if (cell.touched && cell.value !== values.Empty) {
      //   return;
      // }

      // Generator?
      if (cell.value === values.Generator && bot.value === values.Empty && Math.random() > 0.9) {
        this.engine.set(bot.pos, values.Sand);
      }

      // Not sand?
      if (cell.value !== values.Sand) {
        return;
      }

      // Move down?
      if (bot.value === values.Empty) {
        this.engine.set(cell.pos, values.Empty);
        this.engine.set(kernel.bot.pos, values.Sand);
        return;
      }

      const canFallLeft = botleft.value === values.Empty && bot.value !== values.Empty;
      const canFallRight = botright.value === values.Empty && bot.value !== values.Empty;

      if (canFallLeft && canFallRight) {
        this.engine.set(cell.pos, values.Empty);
        this.engine.set(Math.random() > 0.5 ? kernel.botleft.pos : kernel.botright.pos, values.Sand);
        return;
      }

      // Fall left?
      if (canFallLeft) {
        this.engine.set(cell.pos, values.Empty);
        this.engine.set(kernel.botleft.pos, values.Sand);
        return;
      }

      // Fall right?
      if (canFallRight) {
        this.engine.set(cell.pos, values.Empty);
        this.engine.set(kernel.botright.pos, values.Sand);
        return;
      }
    });
  }
}

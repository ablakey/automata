import { Engine } from "./Engine";

const cells = {
  Empty: 0xffe8c9b2,
  Sand: 0xff267fee,
  Wall: 0xff000000,
};

export class Hourglass {
  engine: Engine;

  constructor() {
    this.engine = new Engine(this.tick.bind(this));

    for (let x = 0; x < this.engine.width; x++) {
      for (let y = 0; y < this.engine.height; y++) {
        // Left and Right walls.
        if (x === 0 || x === this.engine.width - 1) {
          this.engine.set([x, y], cells.Wall);
          continue;
        }

        // Top and bottom walls.
        if (y === 0 || y === this.engine.height - 1) {
          this.engine.set([x, y], cells.Wall);
          continue;
        }

        this.engine.set([x, y], Math.random() < 0.9 ? cells.Empty : cells.Sand);
      }
    }
  }

  tick() {
    return;
    // Need to use these classic loops.  A `forEach` abstraction is about 10x slower.
    // We don't iterate over the wals.
    for (let x = 1; x < this.engine.width - 1; x++) {
      for (let y = 1; y < this.engine.height - 1; y++) {
        const kernel = this.engine.get([x, y]);

        // Ignore cells that have already been processed.
        if (kernel.cell.touched) {
          continue;
        }

        // Move down.
        if (kernel.cell.value === cells.Sand && kernel.down?.value === cells.Empty) {
          this.engine.set(kernel.cell.pos, cells.Empty);
          this.engine.set(kernel.down!.pos, cells.Sand);
          continue;
        }

        // Move to side.
        if (kernel.cell.value === cells.Sand && kernel.up?.value === cells.Empty && kernel.down?.value === cells.Sand) {
          // Clear self. It's being moved.
          this.engine.set(kernel.cell.pos, cells.Empty);

          if (kernel.left?.value === cells.Empty && kernel.right?.value === cells.Empty) {
            // random direction.
            this.engine.set(Math.random() > 0.5 ? kernel.left!.pos : kernel.right!.pos, cells.Sand);
          } else if (kernel.left?.value === cells.Empty && kernel.right) {
            // Go right.
            this.engine.set(kernel.right!.pos, cells.Sand);
          } else if (kernel.right?.value === cells.Empty && kernel.left) {
            // Go left.
            this.engine.set(kernel.left!.pos, cells.Sand);
          }
        }
      }
    }
  }
}

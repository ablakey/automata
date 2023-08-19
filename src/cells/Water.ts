import { CellDef } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {
  // The cell below gets as much as possible.
  if (cell.bot.is("Water")) {
    cell.empty(cell.bot.fill(cell.value));
  } else if (cell.bot.is("Empty")) {
    engine.set(cell.bot, "Water");
    cell.empty(cell.bot.fill(cell.value));
  }

  if (cell.value === 0) {
    engine.set(cell, "Empty");
  }
}

export const Water: CellDef = {
  colour: 0xffff0000,
  rule,
  max: 5,
  ui: { icon: "💧", amount: 1 },
};

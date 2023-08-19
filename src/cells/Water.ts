import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  // The cell below gets as much as possible.
  if (cell.bot.is("Water")) {
    cell.empty(cell.bot.fill(cell.value));
  } else if (cell.bot.is("Empty")) {
    cell.bot.set("Water");
    cell.empty(cell.bot.fill(cell.value));
  }

  // Botleft and botright get half.
  if (cell.botleft.is("Water", "Empty")) {
    // cell.set("Water");
    // cell.botleft.fill();
  }

  // TODO: make this a general concept that if its value is 0, its empty at the end of the gen?
  if (cell.value === 0) {
    cell.set("Empty");
  }
}

export const Water: CellDef = {
  colour: 0xffff0000,
  rule,
  max: 5,
  ui: { icon: "💧", amount: 1 },
};

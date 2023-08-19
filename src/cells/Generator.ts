import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  if (cell.bot.type === "Empty") {
    cell.bot.set("Water", 1);
  }
}

export const Generator: CellDef = {
  colour: 0xffff0000,
  rule,
  ui: { icon: "✨", amount: 5 },
};

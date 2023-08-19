import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  if (cell.bot.type === "Empty") {
    cell.bot.set("Water", 1);
  }
}

export const Generator: CellDef = {
  colour: "#00ff00",
  rule,
  ui: { icon: "✨" },
};

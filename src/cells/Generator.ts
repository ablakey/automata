import { CellDescription } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {
  if (cell.bot.type === "Empty") {
    engine.set(cell.bot.pos, "Sand");
  }
}

export const Generator: CellDescription = {
  value: 0xffff0000,
  rule,
};

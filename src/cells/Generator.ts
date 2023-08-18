import { CellDef } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {
  if (cell.bot.type === "Empty") {
    engine.set(cell.bot.pos, "Sand");
  }
}

export const Generator: CellDef = {
  value: 0xffff0000,
  rule,
  ui: { icon: "✨" },
};

import { CellDef } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {
  if (cell.bot.type === "Empty") {
    engine.set(cell.pos, "Empty");
    engine.set(cell.bot.pos, "Water");
    return;
  }

  const canFallLeft = cell.botleft.type === "Empty";
  const canFallRight = cell.botright.type === "Empty";

  if (canFallLeft && canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(Math.random() > 0.5 ? cell.botleft.pos : cell.botright.pos, "Water");
    return;
  }

  // Fall left?
  if (canFallLeft) {
    engine.set(cell.pos, "Empty");
    engine.set(cell.botleft.pos, "Water");
    return;
  }

  // Fall right?
  if (canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(cell.botright.pos, "Water");
    return;
  }
}

export const Water: CellDef = {
  colour: 0xffff0000,
  rule,
  ui: { icon: "💧" },
};

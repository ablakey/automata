import { CellDef } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {
  if (cell.bot.type === "Empty") {
    engine.set(cell.pos, "Empty");
    engine.set(cell.bot.pos, "Sand");
    return;
  }

  const canFallLeft = cell.botleft.type === "Empty";
  const canFallRight = cell.botright.type === "Empty";

  if (canFallLeft && canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(Math.random() > 0.5 ? cell.botleft.pos : cell.botright.pos, "Sand");
    return;
  }

  // Fall left?
  if (canFallLeft) {
    engine.set(cell.pos, "Empty");
    engine.set(cell.botleft.pos, "Sand");
    return;
  }

  // Fall right?
  if (canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(cell.botright.pos, "Sand");
    return;
  }
}

export const Sand: CellDef = {
  colour: 0xff267fee,
  rule,
  ui: { icon: "🪨" },
};

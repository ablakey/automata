import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  if (cell.bot.type === "Empty") {
    cell.set("Empty");
    cell.bot.set("Sand");
    return;
  }

  const canFallLeft = cell.botleft.type === "Empty";
  const canFallRight = cell.botright.type === "Empty";

  if (canFallLeft && canFallRight) {
    cell.set("Empty");
    if (Math.random() > 0.5) {
      cell.botleft.set("Sand");
    } else {
      cell.botright.set("Sand");
    }
    return;
  }

  // Fall left?
  if (canFallLeft) {
    cell.set("Empty");
    cell.botleft.set("Sand");
    return;
  }

  // Fall right?
  if (canFallRight) {
    cell.set("Empty");
    cell.botright.set("Sand");
    return;
  }
}

export const Sand: CellDef = {
  colour: "#ee7f26",
  rule,
  ui: { icon: "🪨" },
};

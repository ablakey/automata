import { CellDescription } from ".";
import { Engine } from "../Engine";
import { Kernel } from "../Kernel";

function rule(kernel: Kernel, engine: Engine) {
  const { cell, bot, botleft, botright } = kernel;

  if (bot.type === "Empty") {
    engine.set(cell.pos, "Empty");
    engine.set(kernel.bot.pos, "Sand");
    return;
  }

  const canFallLeft = botleft.type === "Empty";
  const canFallRight = botright.type === "Empty";

  if (canFallLeft && canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(Math.random() > 0.5 ? kernel.botleft.pos : kernel.botright.pos, "Sand");
    return;
  }

  // Fall left?
  if (canFallLeft) {
    engine.set(cell.pos, "Empty");
    engine.set(kernel.botleft.pos, "Sand");
    return;
  }

  // Fall right?
  if (canFallRight) {
    engine.set(cell.pos, "Empty");
    engine.set(kernel.botright.pos, "Sand");
    return;
  }
}

export const Sand: CellDescription = {
  value: 0xff267fee,
  rule,
};

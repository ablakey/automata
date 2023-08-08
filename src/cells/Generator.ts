import { CellDescription } from ".";
import { Engine } from "../Engine";
import { Kernel } from "../Kernel";

function rule(kernel: Kernel, engine: Engine) {
  if (kernel.bot.type === "Empty") {
    engine.set(kernel.bot.pos, "Sand");
  }
}

export const Generator: CellDescription = {
  value: 0xffff0000,
  rule,
};

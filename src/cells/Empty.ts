import { CellDescription } from ".";
import { Engine, Kernel } from "../Engine";

function rule(kernel: Kernel, engine: Engine) {}

export const Empty: CellDescription = {
  value: 0xffe8c9b2,
  rule,
};

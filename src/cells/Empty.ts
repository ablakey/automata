import { CellDescription } from ".";
import { Engine } from "../Engine";
import { Kernel } from "../Kernel";

function rule(kernel: Kernel, engine: Engine) {}

export const Empty: CellDescription = {
  value: 0xffe8c9b2,
  rule,
};

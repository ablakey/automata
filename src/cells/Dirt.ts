import { CellDescription } from ".";
import { Engine } from "../Engine";
import { Kernel } from "../Kernel";

function rule(kernel: Kernel, engine: Engine) {}

export const Dirt: CellDescription = {
  value: 0xff004080,
  rule,
};

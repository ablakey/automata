import { CellDef } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {}

export const Dirt: CellDef = {
  value: 0xff004080,
  rule,
};

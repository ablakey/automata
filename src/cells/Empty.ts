import { CellDescription } from ".";
import { Cell } from "../Cell";
import { Engine } from "../Engine";

function rule(cell: Cell, engine: Engine) {}

export const Empty: CellDescription = {
  value: 0xffe8c9b2,
  rule,
};

import { CellDef } from ".";

function rule() {}

export const Wall: CellDef = {
  value: 0xff000000,
  rule,
};

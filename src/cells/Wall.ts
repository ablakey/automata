import { CellDescription } from ".";

function rule() {}

export const Wall: CellDescription = {
  value: 0xff000000,
  rule,
};

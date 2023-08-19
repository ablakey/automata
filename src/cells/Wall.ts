import { CellDef } from ".";

function rule() {}

export const Wall: CellDef = {
  colour: "#000000",
  max: 1,
  rule,
};

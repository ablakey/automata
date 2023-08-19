import { Cell } from "../Cell";
import { Engine } from "../Engine";
import { Dirt } from "./Dirt";
import { Empty } from "./Empty";
import { Generator } from "./Generator";
import { Sand } from "./Sand";
import { Wall } from "./Wall";
import { Water } from "./Water";

export type CellDef = {
  colour: number | number[];
  min?: number;
  max?: number;
  rule: (cell: Cell, engine: Engine) => void;
  ui?: { icon: string; amount: number };
};

export const cellDict = {
  Generator,
  Empty,
  Wall,
  Sand,
  Dirt,
  Water,
};

export type CellType = keyof typeof cellDict;

import { Cell } from "../Cell";
import { Engine } from "../Engine";
import { Dirt } from "./Dirt";
import { Empty } from "./Empty";
import { Generator } from "./Generator";
import { Sand } from "./Sand";
import { Wall } from "./Wall";

export type CellDef = { value: number; rule: (cell: Cell, engine: Engine) => void; ui?: { icon: string } };

export const cellDict = {
  Generator,
  Empty,
  Wall,
  Sand,
  Dirt,
};

export type CellType = keyof typeof cellDict;

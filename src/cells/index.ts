import { Cell } from "../Cell";
import { Engine } from "../Engine";
import { Dirt } from "./Dirt";
import { Empty } from "./Empty";
import { Generator } from "./Generator";
import { Sand } from "./Sand";
import { Wall } from "./Wall";

export type CellDescription = { value: number; rule: (cell: Cell, engine: Engine) => void };

export const cellDescriptions = {
  Generator,
  Empty,
  Wall,
  Sand,
  Dirt,
};

export type CellType = keyof typeof cellDescriptions;

export const cellNames = Object.keys(cellDescriptions) as CellType[];

// For lookup when you have the value and want the name.
export const cellValueMap = Object.fromEntries(
  Object.entries(cellDescriptions).map(([name, desc]) => [desc.value, name])
);

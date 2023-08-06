import { Engine, Kernel } from "../Engine";
import { Empty } from "./Empty";
import { Generator } from "./Generator";
import { Sand } from "./Sand";
import { Wall } from "./Wall";

export type CellDescription = { value: number; rule: (kernel: Kernel, engine: Engine) => void };

export const cellDescriptions = {
  Generator,
  Empty,
  Wall,
  Sand,
};

// For lookup when you have the value and want the name.
export const cellValueMap = Object.fromEntries(
  Object.entries(cellDescriptions).map(([name, desc]) => [desc.value, name])
);

export type CellType = keyof typeof cellDescriptions;

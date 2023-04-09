import { Automata, Cell } from "./Automata";

class Ground extends Cell {
  readonly name: "ground";
}

class Air extends Cell {
  readonly name: "air";
}

type Union = typeof Air | typeof Ground;

// type AType = CellType & {
//   color: "red";
//   name: "hello";
//   extra: boolean[];
//   run: (a: Automata<UnionType>) => void;
// };

// type BType = {
//   color: string;
//   name: "goodbye";
//   run: (a: Automata<UnionType>) => void;
// };

// type UnionType = AType | BType;

// const b: BType = {
//   color: "red",
//   name: "goodbye",
//   run: (a) =>
//     a.cellTypes.map((t) => {
//       if (t.name === "goodbye") {
//         t.
//       }
//     }),
// };

// const auto = new Automata<AType | BType>([]);

window.onload = () => {
  window.automata = new Automata<Union>({ tickLength: 100, majorAxisSize: 200 });
  window.automata.loop();
};

declare global {
  const automata: Automata<typeof Cell>;
  interface Window {
    automata: Automata<typeof Cell>;
  }
}

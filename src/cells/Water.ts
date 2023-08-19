import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  // The cell below gets as much as possible.
  if (cell.bot.is("Water", "Empty")) {
    cell.bot.set("Water");
    cell.bot.feed(cell);
    // cell.empty(cell.bot.fill(cell.value));
  }

  const intialValue = cell.value;

  // Botleft gets half.
  if (cell.value && cell.botleft.is("Water", "Empty")) {
    cell.botleft.set("Water");
    cell.botleft.feed(cell, intialValue);
  }

  // Botright gets all that's left if we alreadt drained botleft, otherwise half.
  if (cell.value && cell.botright.is("Water", "Empty")) {
    cell.botright.set("Water");
    cell.botright.feed(cell, intialValue);
  }

  function feedLeft() {
    if (cell.value && cell.left.is("Water", "Empty") && cell.value > cell.left.value) {
      cell.left.set("Water");
      cell.left.feed(cell, 3);
    }
  }

  function feedRight() {
    if (cell.value && cell.right.is("Water", "Empty") && cell.value > cell.right.value) {
      cell.right.set("Water");
      cell.right.feed(cell, 3);
    }
  }

  if (cell.left.value > cell.right.value) {
    feedLeft();
    feedRight();
  } else {
    feedRight();
    feedLeft();
  }

  if (cell.value === 0) {
    cell.set("Empty");
  }
}

export const Water: CellDef = {
  colour: ["#74ccf4", "#5abcd8", "#1ca3ec", "#2389da", "#0f5e9c"],
  rule,
  max: 5,
  ui: { icon: "💧", amount: 1 },
};

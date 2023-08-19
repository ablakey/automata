import { CellDef } from ".";
import { Cell } from "../Cell";

function rule(cell: Cell) {
  // The cell below gets as much as possible.
  if (cell.bot.is("Water", "Empty")) {
    cell.bot.set("Water");
    cell.bot.feed(cell);
    // cell.empty(cell.bot.fill(cell.value));
  }

  let drainedBotLeft = false;

  // Botleft gets half.
  if (cell.value && cell.botleft.is("Water", "Empty")) {
    cell.botleft.set("Water");
    cell.botleft.feed(cell, cell.value / 2);
    drainedBotLeft = true;
  }

  // Botright gets all that's left if we alreadt drained botleft, otherwise half.
  if (cell.value && cell.botright.is("Water", "Empty")) {
    cell.botright.set("Water");
    cell.botright.feed(cell, drainedBotLeft ? cell.value : cell.value / 2);
  }

  function feedLeft() {
    if (cell.value && cell.left.is("Water", "Empty") && cell.value > cell.left.value) {
      cell.left.set("Water");
      cell.left.feed(cell, 1);
    }
  }

  function feedRight() {
    if (cell.value && cell.right.is("Water", "Empty") && cell.value > cell.right.value) {
      cell.right.set("Water");
      cell.right.feed(cell, 1);
    }
  }

  if (Math.random() > 0.5) {
    feedLeft();
    feedRight();
  } else {
    feedRight();
    feedLeft();
  }

  // Left gets a third.
  // if (cell.value && cell.left.is("Water", "Empty")) {
  //   cell.left.set("Water");
  //   cell.left.feed(cell, cell.value / 3);
  // }

  // // Right gets a third.
  // if (cell.value && cell.right.is("Water", "Empty")) {
  //   cell.right.set("Water");
  //   cell.right.feed(cell, cell.value / 3);
  // }

  // Water wants to feed to the cell that's most empty. Round robin, perhaps?

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

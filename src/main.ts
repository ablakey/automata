import { Engine } from "./Engine";

function main() {
  const engine = new Engine();
  // engine.fillRect([1, 98], 90, 1, "Water", 5);

  // engine.fillRect([10, 10], 80, 1, "Generator");
  // engine.set([10, 10], "Generator");

  engine.forEach((cell) => {
    if (cell.pos[1] < 48) {
      return;
    }

    if (cell.pos[1] < 50) {
      cell.set("Dirt");
    } else if (Math.random() > 0.6) {
      cell.set("Dirt");
    }
  });

  // Build caves.
  for (let x = 0; x < 10; x++) {
    engine.forEach((cell) => {
      if (cell.pos[1] < 50) {
        return;
      }

      const emptyCount = cell.getCount("Empty");

      const isEmpty = (cell.type === "Empty" && emptyCount >= 4) || emptyCount >= 6;
      cell.set(isEmpty ? "Empty" : "Dirt");
    });
  }
}

window.onload = main;

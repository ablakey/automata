import { Engine } from "./Engine";

function main() {
  const engine = new Engine();

  engine.fillRect([10, 10], 180, 1, "Generator");

  // engine.forEach((k) => {
  //   if (Math.random() > 0.6) {
  //     engine.set(k.cell, "Dirt");
  //   }
  // });

  // for (let x = 0; x < 100; x++) {
  //   engine.forEach((k) => {
  //     const dirtCount = k.getCount("Dirt");

  //     if (k.cell.type === "Empty" && dirtCount >= 4) {
  //       engine.set(k.cell, "Dirt");
  //     } else if (k.cell.type === "Dirt" && dirtCount < 2) {
  //       engine.set(k.cell, "Empty");
  //     }
  //   });
  // }
}

window.onload = main;

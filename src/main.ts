import { Engine } from "./Engine";

function main() {
  const engine = new Engine();
  engine.fillRect([2, 2], 100, 1, "Generator");
}

window.onload = main;

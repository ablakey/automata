import { Sandbox } from "./sandbox";

function main() {
  const sandbox = new Sandbox();

  function tick(stamp: number) {
    for (let x = 0; x < sandbox.width * sandbox.height; x++) {
      sandbox.buffer[x] = Math.random() * 0xffffffff;
    }

    sandbox.draw();
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

window.onload = main;

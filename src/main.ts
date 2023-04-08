import { Automata } from "./Automata";

window.onload = () => {
  window.automata = new Automata();
  window.automata.loop();
};

declare global {
  const automata: Automata;
  interface Window {
    automata: Automata;
  }
}

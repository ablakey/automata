export class Sandbox {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private imageData: ImageData;
  public buffer: Uint32Array;

  public readonly width: number;
  public readonly height: number;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    this.width = Math.floor(this.canvas.offsetWidth / 4);
    this.height = Math.floor(this.canvas.offsetHeight / 4);

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.buffer = new Uint32Array(this.imageData.data.buffer);
  }

  draw() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

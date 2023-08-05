const PIXEL_SCALE = 4;

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private imageData: ImageData;
  public buffer: Uint32Array;

  public readonly width: number;
  public readonly height: number;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    this.width = Math.floor(this.canvas.offsetWidth / PIXEL_SCALE);
    this.height = Math.floor(this.canvas.offsetHeight / PIXEL_SCALE);

    console.log(this.width, this.height);

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext("2d")!;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.buffer = new Uint32Array(this.imageData.data.buffer);
  }

  private getCell(x: number, y: number): number | undefined {
    return this.buffer[this.width * y + x];
  }

  get(x: number, y: number) {
    return {
      cell: this.getCell(x, y)!,
      up: this.getCell(x, y - 1),
      down: this.getCell(x, y + 1),
      left: this.getCell(x - 1, y),
      right: this.getCell(x + 1, y),
    };
  }

  set(x: number, y: number, value: number) {
    this.buffer[this.width * y + x] = value;
  }

  draw() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

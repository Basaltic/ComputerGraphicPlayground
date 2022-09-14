export class Bitmap {
  w: number;
  h: number;
  buffer: Uint32Array;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;

    this.buffer = new Uint32Array(w * h);
  }

  clear() {
    this.buffer = new Uint32Array(this.w * this.h);
  }

  set(x: number, y: number, v: number) {
    this.buffer[x + y * this.w] = v;
  }
}

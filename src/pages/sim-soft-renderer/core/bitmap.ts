export class Bitmap {
  w: number;
  h: number;
  buffer: Uint32Array;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;

    this.buffer = new Uint32Array(w * h);
  }

  set(x: number, y: number, v: number) {
    this.buffer[x + y * this.w] = v;
  }

  /**
   * 把位图转换为图片数据
   * Convert Bitmap to Image Data
   *
   * @param scale
   * @returns
   */
  toImageData(scale: number = 1) {
    const imageData = new ImageData(this.w * scale, this.h * scale);

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const bitmapPixel = this.buffer[x + y * this.w];

        const r = (bitmapPixel >> 16) & 0xff;
        const g = (bitmapPixel >> 8) & 0xff;
        const b = bitmapPixel & 0xff;

        if (scale == 1) {
          const ptr = (x * scale + y * scale * imageData.width) * 4;

          imageData.data[ptr] = r;
          imageData.data[ptr + 1] = g;
          imageData.data[ptr + 2] = b;
          imageData.data[ptr + 3] = 255;
          continue;
        }

        for (let ys = 0; ys < scale; ys++) {
          for (let xs = 0; xs < scale; xs++) {
            const ptr = (x * scale + xs + (y * scale + ys) * imageData.width) * 4;

            imageData.data[ptr] = r;
            imageData.data[ptr + 1] = g;
            imageData.data[ptr + 2] = b;
            imageData.data[ptr + 3] = 255;
          }
        }
      }
    }

    return imageData;
  }
}

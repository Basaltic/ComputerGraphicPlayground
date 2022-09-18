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

  get(x: number, y: number) {
    return this.buffer[x + y * this.w];
  }

  /**
   * 把位图转换为图片数据
   * Convert Bitmap to Image Data
   *
   * @param scale
   * @returns
   */
  toImageData(scale: number = 1): ImageData {
    const buf = this.buffer;
    const w = this.w;
    const h = this.h;
    const imageData = new ImageData(w * scale, h * scale);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bitmapPixel = buf[x + y * w];

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

  static fromImage(imageElement: HTMLImageElement): Bitmap {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');

    if (!context) return new Bitmap(0, 0);

    const width = imageElement.naturalWidth || imageElement.offsetWidth || imageElement.width;
    const height = imageElement.naturalHeight || imageElement.offsetHeight || imageElement.height;

    const bitmap = new Bitmap(width, height);

    context.drawImage(imageElement, 0, 0);

    const imageData = context.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const r = imageData.data[(x + y * width) * 4];
        const g = imageData.data[(x + y * width) * 4 + 1];
        const b = imageData.data[(x + y * width) * 4 + 2];

        const color = (r << 16) | (g << 8) | b;
        bitmap.set(x, y, color);
      }
    }

    return bitmap;
  }
}

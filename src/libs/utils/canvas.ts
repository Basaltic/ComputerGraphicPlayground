import { Bitmap } from './bitmap';

export type CanvasConfigs = {
  width: number;
  height: number;
};

/**
 * 画布，只能画单个像素，模拟屏幕显示器
 */
export class Canvas {
  private ele: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  constructor(ele: HTMLCanvasElement) {
    const context = ele?.getContext('2d') as CanvasRenderingContext2D;

    this.ele = ele;
    this.context = context;

    this.context.save();

    this.context.fillStyle = `rgb(255, 255, 255)`;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.restore();
  }

  get width() {
    return this.ele.width;
  }

  get height() {
    return this.ele.height;
  }

  /**
   * 画单个像素
   *
   * @param context
   * @param x
   * @param y
   * @param color
   */
  drawPixel = (x: number, y: number, color: number[], pixelSize: number = 1) => {
    const [r, g, b, a] = color;

    this.context.save();

    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a ?? 1})`;
    this.context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    this.context.restore();
  };

  setBackground = (color: string = '#000000') => {
    this.context.save();

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.restore();
  };

  clear = () => {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  };

  /**
   * 画整个图像
   * Draw entire bitmap to screen
   */
  drawImage(image: ImageData) {
    this.context.putImageData(image, 0, 0);
  }

  /**
   * 把uint32array转换为图像数据并绘制到画布中
   *
   * @param buf
   * @param w
   * @param h
   * @param scale
   */
  drawImageFromArray(buf: Uint32Array, w: number, h: number, scale: number = 1) {
    const imageData = this.toImageData(buf, w, h, scale);
    this.drawImage(imageData);
  }

  /**
   * 绘制bitmap到画布中
   *
   * @param bitmap
   */
  drawImageFromBitmap(bitmap: Bitmap) {
    this.drawImageFromArray(bitmap.buffer, bitmap.w, bitmap.h);
  }

  /**
   * 把位图转换为图片数据
   * Convert Bitmap to Image Data
   *
   * @param scale
   * @returns
   */
  toImageData(buf: Uint32Array, w: number, h: number, scale: number = 1) {
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
}

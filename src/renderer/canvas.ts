/**
 * 画布，只能画单个像素，模拟屏幕显示器
 */
export class Canvas {
  public context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;

    this.context.save();

    this.context.fillStyle = `rgb(255, 255, 255)`;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.restore();
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

  setBackground = () => {
    this.context.save();

    this.context.fillStyle = `#000000`;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.restore();
  };

  clear = () => {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  };
}

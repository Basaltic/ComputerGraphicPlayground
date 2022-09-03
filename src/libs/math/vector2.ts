/**
 * 向量（2维）
 */
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * 向量的长度
   */
  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 单位向量
   */
  normalized() {
    const n = this.getMagnitude();
    return new Vector2(this.x / n, this.y / n);
  }

  divide(v: number) {
    return new Vector2(this.x / v, this.y / v);
  }

  multiply(v: number) {
    return new Vector2(this.x * v, this.y * v);
  }

  subtract(v: Vector2) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  dot(v: Vector2) {
    return new Vector2(this.x * v.x, this.y * v.y);
  }

  cross(v: Vector2) {
    return this.y * v.x - this.x * v.y;
  }

  equals(v: Vector2) {
    return this.x === v.x && this.y === v.y;
  }
}

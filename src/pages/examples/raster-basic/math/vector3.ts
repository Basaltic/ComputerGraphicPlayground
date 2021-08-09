/**
 * 3维度向量
 */
export class Vector3 {
  coord: number[];

  get x() {
    return this.coord[0];
  }

  get y() {
    return this.coord[1];
  }

  get z() {
    return this.coord[2];
  }

  constructor(x: number, y: number, z: number) {
    this.coord = [x, y, z];
  }

  public static createByArray(v: number[]) {
    return new Vector3(v[0], v[1], v[2]);
  }

  public toHomoVec4Array() {
    return [this.x, this.y, this.z, 1];
  }

  /**
   * 点乘
   *
   * @param b
   * @returns
   */
  public dot(b: Vector3) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }

  /**
   * 叉乘
   *
   * @param b
   */
  public cross(b: Vector3) {
    return new Vector3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
  }

  /**
   * 获取该向量的单位向量
   */
  public normalized() {
    const n = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return new Vector3(this.x / n, this.y / n, this.z / n);
  }

  /**
   * 除一个数
   */
  public divide(v: number) {
    return new Vector3(this.x / v, this.y / v, this.z / v);
  }

  /**
   * 乘一个数
   */
  public multiply(v: number) {
    return new Vector3(this.x * v, this.y * v, this.z * v);
  }

  /**
   * a - b
   * @param a
   * @param b
   */
  public static subtract(a: Vector3, b: Vector3) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * 相加
   *
   * @param v
   * @returns
   */
  public static add(a: Vector3, b: Vector3) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * 两个向量点乘
   *
   * @param a
   * @param b
   * @returns {number}
   */
  public static dotProduct(a: Vector3, b: Vector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * 两个向量叉乘
   *
   * @param a
   * @param b
   * @returns {Vector3}
   */
  public static crossProduct(a: Vector3, b: Vector3) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }
}

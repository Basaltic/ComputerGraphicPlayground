import { Vector3 } from './vector3';

/**
 * 矩阵 3阶
 */
export class Matrix3 {
  m00: number;
  m01: number;
  m02: number;
  m10: number;
  m11: number;
  m12: number;
  m20: number;
  m21: number;
  m22: number;

  constructor(
    m00: number = 1,
    m01: number = 0,
    m02: number = 0,
    m10: number = 0,
    m11: number = 1,
    m12: number = 0,
    m20: number = 0,
    m21: number = 0,
    m22: number = 1
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
  }

  /**
   * 单位矩阵
   */
  static identity() {
    return new Matrix3();
  }

  static from2dArray(a: number[][]) {
    return new Matrix3(a[0][0], a[0][1], a[0][2], a[1][0], a[1][1], a[1][2], a[2][0], a[2][1], a[2][2]);
  }

  toArray() {
    return [this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22];
  }

  /**
   * 矩阵乘法
   *
   * left(当前矩阵) * right
   */
  multiply(right: Matrix3) {
    let res = new Matrix3();

    res.m00 = this.m00 * right.m00 + this.m01 * right.m10 + this.m02 * right.m20;
    res.m01 = this.m00 * right.m01 + this.m01 * right.m11 + this.m02 * right.m21;
    res.m02 = this.m00 * right.m02 + this.m01 * right.m12 + this.m02 * right.m22;

    res.m10 = this.m10 * right.m00 + this.m11 * right.m10 + this.m12 * right.m20;
    res.m11 = this.m10 * right.m01 + this.m11 * right.m11 + this.m12 * right.m21;
    res.m12 = this.m10 * right.m02 + this.m11 * right.m12 + this.m12 * right.m22;

    res.m20 = this.m20 * right.m00 + this.m21 * right.m10 + this.m22 * right.m20;
    res.m21 = this.m20 * right.m01 + this.m21 * right.m11 + this.m22 * right.m21;
    res.m22 = this.m20 * right.m02 + this.m21 * right.m12 + this.m22 * right.m22;

    return res;
  }

  /**
   * 矩阵乘以向量
   *
   * left(matrix) * right(vector)
   */
  multiplyVector(right: Vector3) {
    let res = new Vector3(0, 0, 0);

    res.x = this.m00 * right.x + this.m01 * right.y + this.m02 * right.z;
    res.y = this.m10 * right.x + this.m11 * right.y + this.m12 * right.z;
    res.z = this.m20 * right.x + this.m21 * right.y + this.m22 * right.z;

    return res;
  }

  scale(x: number, y: number, z: number) {
    if (y == undefined && z == undefined) {
      y = x;
      z = x;
    }

    let scale = new Matrix3();
    scale.m00 = x;
    scale.m11 = y;
    scale.m22 = z;

    return this.multiply(scale);
  }

  rotate(x: number, y: number, z: number) {
    const sinX = Math.sin(x);
    const cosX = Math.cos(x);
    const sinY = Math.sin(y);
    const cosY = Math.cos(y);
    const sinZ = Math.sin(z);
    const cosZ = Math.cos(z);

    let res = new Matrix3();

    res.m00 = cosY * cosZ;
    res.m01 = -cosY * sinZ;
    res.m02 = sinY;
    res.m10 = sinX * sinY * cosZ + cosX * sinZ;
    res.m11 = -sinX * sinY * sinZ + cosX * cosZ;
    res.m12 = -sinX * cosY;
    res.m20 = -cosX * sinY * cosZ + sinX * sinZ;
    res.m21 = cosX * sinY * sinZ + sinX * cosZ;
    res.m22 = cosX * cosY;

    return this.multiply(res);
  }
}

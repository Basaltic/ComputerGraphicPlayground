import { Vector3 } from './vector3';
import { Vector4 } from './vector4';

/**
 * 矩阵 4阶
 */

export class Matrix4 {
  m00: number;
  m01: number;
  m02: number;
  m03: number;
  m10: number;
  m11: number;
  m12: number;
  m13: number;
  m20: number;
  m21: number;
  m22: number;
  m23: number;
  m30: number;
  m31: number;
  m32: number;
  m33: number;

  constructor(
    m00: number = 1,
    m01: number = 0,
    m02: number = 0,
    m03: number = 0,
    m10: number = 0,
    m11: number = 1,
    m12: number = 0,
    m13: number = 0,
    m20: number = 0,
    m21: number = 0,
    m22: number = 1,
    m23: number = 0,
    m30: number = 0,
    m31: number = 0,
    m32: number = 0,
    m33: number = 1
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m30 = m30;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
  }

  static identity() {
    return new Matrix4();
  }

  static from2DArray(a: number[][]) {
    return new Matrix4(
      a[0][0],
      a[0][1],
      a[0][2],
      a[0][3],
      a[1][0],
      a[1][1],
      a[1][2],
      a[1][3],
      a[2][0],
      a[2][1],
      a[2][2],
      a[2][3],
      a[3][0],
      a[3][1],
      a[3][2],
      a[3][3]
    );
  }

  toArray() {
    return [
      this.m00,
      this.m01,
      this.m02,
      this.m03,
      this.m10,
      this.m11,
      this.m12,
      this.m13,
      this.m20,
      this.m21,
      this.m22,
      this.m23,
      this.m30,
      this.m31,
      this.m32,
      this.m33
    ];
  }

  /**
   * 乘法
   *
   * left(当前矩阵) * right
   */
  multiply(right: Matrix4) {
    let res = new Matrix4();

    res.m00 = this.m00 * right.m00 + this.m01 * right.m10 + this.m02 * right.m20 + this.m03 * right.m30;
    res.m01 = this.m00 * right.m01 + this.m01 * right.m11 + this.m02 * right.m21 + this.m03 * right.m31;
    res.m02 = this.m00 * right.m02 + this.m01 * right.m12 + this.m02 * right.m22 + this.m03 * right.m32;
    res.m03 = this.m00 * right.m03 + this.m01 * right.m13 + this.m02 * right.m23 + this.m03 * right.m33;

    res.m10 = this.m10 * right.m00 + this.m11 * right.m10 + this.m12 * right.m20 + this.m13 * right.m30;
    res.m11 = this.m10 * right.m01 + this.m11 * right.m11 + this.m12 * right.m21 + this.m13 * right.m31;
    res.m12 = this.m10 * right.m02 + this.m11 * right.m12 + this.m12 * right.m22 + this.m13 * right.m32;
    res.m13 = this.m10 * right.m03 + this.m11 * right.m13 + this.m12 * right.m23 + this.m13 * right.m33;

    res.m20 = this.m20 * right.m00 + this.m21 * right.m10 + this.m22 * right.m20 + this.m23 * right.m30;
    res.m21 = this.m20 * right.m01 + this.m21 * right.m11 + this.m22 * right.m21 + this.m23 * right.m31;
    res.m22 = this.m20 * right.m02 + this.m21 * right.m12 + this.m22 * right.m22 + this.m23 * right.m32;
    res.m23 = this.m20 * right.m03 + this.m21 * right.m13 + this.m22 * right.m23 + this.m23 * right.m33;

    res.m30 = this.m30 * right.m00 + this.m31 * right.m10 + this.m32 * right.m20 + this.m33 * right.m30;
    res.m31 = this.m30 * right.m01 + this.m31 * right.m11 + this.m32 * right.m21 + this.m33 * right.m31;
    res.m32 = this.m30 * right.m02 + this.m31 * right.m12 + this.m32 * right.m22 + this.m33 * right.m32;
    res.m33 = this.m30 * right.m03 + this.m31 * right.m13 + this.m32 * right.m23 + this.m33 * right.m33;

    return res;
  }

  /**
   * 矩阵乘以向量
   * left(matrix) * right(vector)
   */
  multiplyVector(right: Vector4) {
    let res = new Vector4(0, 0, 0, 1);

    res.x = this.m00 * right.x + this.m01 * right.y + this.m02 * right.z + this.m03 * right.w;
    res.y = this.m10 * right.x + this.m11 * right.y + this.m12 * right.z + this.m13 * right.w;
    res.z = this.m20 * right.x + this.m21 * right.y + this.m22 * right.z + this.m23 * right.w;
    res.w = this.m30 * right.x + this.m31 * right.y + this.m32 * right.z + this.m33 * right.w;

    return res;
  }

  scale(x: number, y: number, z: number) {
    if (y == undefined && z == undefined) {
      y = x;
      z = x;
    }

    let scale = new Matrix4();
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

    let res = new Matrix4();

    res.m00 = cosY * cosZ;
    res.m01 = -cosY * sinZ;
    res.m02 = sinY;
    res.m03 = 0;
    res.m10 = sinX * sinY * cosZ + cosX * sinZ;
    res.m11 = -sinX * sinY * sinZ + cosX * cosZ;
    res.m12 = -sinX * cosY;
    res.m13 = 0;
    res.m20 = -cosX * sinY * cosZ + sinX * sinZ;
    res.m21 = cosX * sinY * sinZ + sinX * cosZ;
    res.m22 = cosX * cosY;
    res.m23 = 0;
    res.m30 = 0;
    res.m31 = 0;
    res.m32 = 0;
    res.m33 = 1;

    return this.multiply(res);
  }

  translate(x: number, y: number, z: number) {
    let res = new Matrix4();

    res.m03 = x;
    res.m13 = y;
    res.m23 = z;

    return this.multiply(res);
  }
}

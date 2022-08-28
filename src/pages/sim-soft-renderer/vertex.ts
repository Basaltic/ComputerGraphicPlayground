import { Vector3 } from '../../libs/math/vector3';

/**
 * 顶点
 */
export class Vertex {
  /**
   * 顶点位置
   */
  pos: Vector3;
  /**
   * 顶点颜色
   */
  color: Vector3;

  constructor(pos: Vector3, color: Vector3) {
    this.pos = pos;
    this.color = color;
  }
}

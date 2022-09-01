import { Vector2 } from '../../../libs/math/vector2';
import { Vector3 } from '../../../libs/math/vector3';
import { Color } from '../core/color';

/**
 * 顶点
 */
export class Vertex {
  /**
   * 位置
   */
  pos: Vector3;
  /**
   * RGB color
   * x = r, y = z
   */
  color: Vector3;

  /**
   * 纹理坐标，范围 [0,1]
   */
  uv?: Vector2;

  /**
   * 法线
   */
  normal?: Vector3;

  constructor(p: Vector3, c: Vector3, uv?: Vector2, normal?: Vector3) {
    this.pos = p;
    this.color = c;
    this.uv = uv;
    this.normal = normal;
  }
}

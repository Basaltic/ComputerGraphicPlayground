import { Vector2 } from '../../../libs/math/vector2';
import { Vector3 } from '../../../libs/math/vector3';
import { Color } from './color';

/**
 * 顶点
 */
export class Vertex {
  position: Vector3;
  /**
   * RGB color
   * x = r, y = z
   */
  color: Color;

  /**
   * 纹理坐标，范围 [0,1]
   */
  uv: Vector2;

  constructor(p: Vector3, c: Color, uv: Vector2) {
    this.position = p;
    this.color = c;
    this.uv = uv;
  }
}

import { Vector2 } from '../../../libs/math/vector2';
import { Vector3 } from '../../../libs/math/vector3';
import { Color } from './color';

/**
 * 顶点
 */
export class Vertex {
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

  constructor(p: Vector3, c: Vector3, uv?: Vector2) {
    this.pos = p;
    this.color = c;
    this.uv = uv;
  }
}

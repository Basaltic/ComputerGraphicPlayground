import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector2 } from '../../../libs/math/vector2';
import { Vector3 } from '../../../libs/math/vector3';
import { RGBColor } from '../../../libs/utils/color';

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
  color: RGBColor;

  /**
   * 纹理坐标，范围 [0,1]
   */
  uv?: Vector2;

  /**
   * 法线
   */
  normal?: Vector3;

  constructor(p: Vector3, color: RGBColor, uv?: Vector2, normal?: Vector3) {
    this.pos = p;
    this.color = color;
    this.uv = uv;
    this.normal = normal;
  }

  clone() {
    return new Vertex(this.pos.clone(), this.color.clone(), this.uv?.clone(), this?.normal?.clone());
  }
}

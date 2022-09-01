import { Vector3 } from '../../../libs/math/vector3';
import Mesh from '../../../libs/obj-loader/mesh';
import { Renderer } from '../core/renderer';
import { IMesh } from './mesh';
import { Triangle } from './triangle';
import { Vertex } from './vertex';

/**
 * 模型
 */
export class Model {
  pos: Vector3;
  meshes: IMesh[];

  constructor(pos: Vector3, meshes: IMesh[]) {
    this.pos = pos;
    this.meshes = meshes;
  }

  render() {
    for (const mesh of this.meshes) {
      mesh.render();
    }
  }

  static load(obj: string, renderer: Renderer) {
    // 使用三方库解析obj文件
    const mesh = new Mesh(obj);

    // 转换为我们自己的模型结构
    const imeshes: IMesh[] = [];
    const vertices = mesh.vertices;
    for (let i = 0; i < mesh.vertices.length; i += 9) {
      const v1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2] - 3);
      const v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5] - 3);
      const v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8] - 3);

      console.log(v1.x, v1.y, v1.z);
      console.log(v2.x, v2.y, v2.z);
      console.log(v3.x, v3.y, v3.z);

      const c1 = Vector3.fromArray([235, 64, 52]);
      const c2 = Vector3.fromArray([66, 135, 245]);
      const c3 = Vector3.fromArray([245, 221, 66]);

      const vx1 = new Vertex(v1, c1);
      const vx2 = new Vertex(v2, c2);
      const vx3 = new Vertex(v3, c3);

      const triangle = new Triangle([vx1, vx2, vx3], renderer);
      imeshes.push(triangle);
    }
    // console.log(imeshes);

    return new Model(imeshes);
  }
}

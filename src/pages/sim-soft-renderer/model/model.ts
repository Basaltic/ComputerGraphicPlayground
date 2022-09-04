import { Vector3 } from '../../../libs/math/vector3';
import Mesh from '../../../libs/obj-loader/mesh';
import { randomRgba } from '../core/color';
import { Renderer } from '../core/renderer';
import { IMesh } from './mesh';
import { Triangle } from './triangle';
import { Vertex } from './vertex';

/**
 * 模型
 */
export class Model {
  pos: Vector3;
  meshes: Triangle[];

  constructor(pos: Vector3, meshes: Triangle[]) {
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
    const imeshes: Triangle[] = [];
    const vertices = mesh.vertices;

    for (let i = 0; i < mesh.indices.length; i += 3) {
      const base = mesh.indices[i] * 3;

      const v1 = new Vector3(vertices[base], vertices[base + 1], vertices[base + 2]);
      const v2 = new Vector3(vertices[base + 3], vertices[base + 4], vertices[base + 5]);
      const v3 = new Vector3(vertices[base + 6], vertices[base + 7], vertices[base + 8]);

      // const c1 = new Vector3(255, 255, 255);
      const c1 = randomRgba();
      // const c2 = randomRgba();
      // const c3 = randomRgba();

      const vx1 = new Vertex(v1, c1);
      const vx2 = new Vertex(v2, c1);
      const vx3 = new Vertex(v3, c1);

      const triangle = new Triangle([vx1, vx2, vx3], renderer);
      imeshes.push(triangle);
    }

    return new Model(new Vector3(0, 0, -10), imeshes);
  }
}

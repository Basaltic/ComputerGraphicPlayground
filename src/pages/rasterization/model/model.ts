import { Vector2 } from '../../../libs/math/vector2';
import { Vector3 } from '../../../libs/math/vector3';
import Mesh from '../../../libs/obj-loader/mesh';
import { randomRgba } from '../core/color';
import { Renderer } from '../core/renderer';
import { Triangle } from './triangle';
import { Vertex } from './vertex';

/**
 * 模型
 */
export class Model {
  pos: Vector3;
  triangles: Triangle[];

  constructor(pos: Vector3, triangles: Triangle[]) {
    this.pos = pos;
    this.triangles = triangles;
  }

  render() {
    for (const mesh of this.triangles) {
      mesh.render();
    }
  }

  static load(obj: string, renderer: Renderer) {
    // 使用三方库解析obj文件
    const mesh = new Mesh(obj);

    // 转换为我们自己的模型结构
    const imeshes: Triangle[] = [];
    const vertices = mesh.vertices;
    const { vertexNormals, textures } = mesh;

    for (let i = 0; i < mesh.indices.length; i += 3) {
      const base = mesh.indices[i] * 3;
      const uvBase = mesh.indices[i] * 2;

      // 顶点坐标
      const v1 = new Vector3(vertices[base], vertices[base + 1], vertices[base + 2]);
      const v2 = new Vector3(vertices[base + 3], vertices[base + 4], vertices[base + 5]);
      const v3 = new Vector3(vertices[base + 6], vertices[base + 7], vertices[base + 8]);

      // 法线
      const n1 = new Vector3(vertexNormals[base], vertexNormals[base + 1], vertexNormals[base + 2]);
      const n2 = new Vector3(vertexNormals[base + 3], vertexNormals[base + 4], vertexNormals[base + 5]);
      const n3 = new Vector3(vertexNormals[base + 6], vertexNormals[base + 7], vertexNormals[base + 8]);

      // 纹理坐标 - UV
      const uv1 = new Vector2(textures[uvBase], textures[uvBase + 1]);
      const uv2 = new Vector2(textures[uvBase + 2], textures[uvBase + 3]);
      const uv3 = new Vector2(textures[uvBase + 4], textures[uvBase + 5]);

      // const c1 = new Vector3(255, 255, 255);
      const c1 = randomRgba();
      const c2 = randomRgba();
      const c3 = randomRgba();

      const vx1 = new Vertex(v1, c1, uv1, n1);
      const vx2 = new Vertex(v2, c2, uv2, n2);
      const vx3 = new Vertex(v3, c3, uv3, n3);

      const triangle = new Triangle([vx1, vx2, vx3], renderer);
      imeshes.push(triangle);
    }

    return new Model(new Vector3(0, 0, -10), imeshes);
  }
}

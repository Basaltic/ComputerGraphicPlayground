import { Triangle } from './triangle';
import { TransformState } from './types';
import LoaderMesh from '../../../libs/third-party/obj-loader/mesh';
import { Vertex } from './vertex';
import { Vector3 } from '@/libs/math/vector3';
import { RGBColor } from '@/libs/utils/color';
import { Vector2 } from '@/libs/math/vector2';

/**
 * Mesh is a set of faces
 */
export class Mesh {
  transform: TransformState = {
    rotate: { rx: 0, ry: 0, rz: 0 },
    translate: { tx: 0, ty: 0, tz: 0 },
    scale: { sx: 1, sy: 1, sz: 1 }
  };
  triangles: Triangle[];
  constructor(triangles?: Triangle[]) {
    this.triangles = triangles || [];
  }

  add(triangle: Triangle) {
    this.triangles.push(triangle);
    return this;
  }

  static fromLoaderMesh(loaderMesh: LoaderMesh) {
    console.log(loaderMesh);
    const triangles: Triangle[] = [];
    try {
      let vertexs: Vertex[] = [];

      let vertexLength = loaderMesh.vertices.length / 3;

      for (let i = 0; i < vertexLength; i++) {
        const vector = Vector3.fromArray([loaderMesh.vertices[i * 3], loaderMesh.vertices[i * 3 + 1], loaderMesh.vertices[i * 3 + 2]]);
        const vertexNormal = Vector3.fromArray([
          loaderMesh.vertexNormals[i * 3],
          loaderMesh.vertexNormals[i * 3 + 1],
          loaderMesh.vertexNormals[i * 3 + 2]
        ]);

        const uv = new Vector2(loaderMesh.textures[i * 2], loaderMesh.textures[i * 2 + 1]);
        const vertex = new Vertex(vector, RGBColor.randomColor(), uv, vertexNormal);

        vertexs.push(vertex);
      }

      let triangleVertexs = [];
      for (let i = 0; i < loaderMesh.indices.length; i++) {
        const indices = loaderMesh.indices[i];
        const vertex = vertexs[indices];
        triangleVertexs.push(vertex);

        if (triangleVertexs.length === 3) {
          const triangle = new Triangle(triangleVertexs);
          triangles.push(triangle);

          triangleVertexs = [];
        }
      }

      console.log(vertexs.length, vertexs, triangles);
    } catch {}

    return new Mesh(triangles);
  }
}

import { Triangle } from './triangle';
import { TransformState } from './types';

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
}

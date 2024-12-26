import { useRef } from 'react';
import { downloadModels } from '../../libs/third-party/obj-loader/utils';
import LoaderMesh from '../../libs/third-party/obj-loader/mesh';
import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';
import { RGBColor } from '../../libs/utils/color';
import { useRequest } from 'ahooks';
import { useEngine } from './util/use-engine';
import { Mesh } from './core/mesh';
import { Controller } from './components/controller';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const engine = useEngine();

  const { loading } = useRequest(async () => {
    const triangles: Triangle[] = [];
    try {
      const res = await downloadModels([{ obj: '/models/cube/cube.obj', mtl: false, downloadMtlTextures: false }]);

      const mesh: LoaderMesh = res.cube;

      let vertexs: Vertex[] = [];

      let vertices: number[] = [];
      let vertexNormals: number[] = [];

      for (let i = 0; i < mesh.vertices.length; i++) {
        const vertice = mesh.vertices[i];
        const normal = mesh.vertexNormals[i];
        vertices.push(vertice);
        vertexNormals.push(normal);

        if (vertices.length === 3) {
          const vector = Vector3.fromArray(vertices);
          const vertexNormal = Vector3.fromArray(vertexNormals);

          const vertex = new Vertex(vector, RGBColor.random(), undefined, vertexNormal);

          vertexs.push(vertex);

          vertices = [];
        }
      }

      let triangleVertexs = [];
      for (let i = 0; i < mesh.indices.length; i++) {
        const indices = mesh.indices[i];
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

    const mesh = new Mesh(triangles);

    engine.scene.addMesh(mesh);
  });

  return (
    <div style={{ width: 'fit-content', padding: '10px', display: 'flex' }}>
      <div className="positive">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

        {loading ? <p className="absolute top-10 left-10">正在加载，请稍后</p> : null}
      </div>

      <Controller {...engine} />
    </div>
  );
};

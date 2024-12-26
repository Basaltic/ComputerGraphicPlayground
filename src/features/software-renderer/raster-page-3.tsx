import React, { useEffect, useRef } from 'react';
import { downloadModels, MeshMap } from '../../libs/third-party/obj-loader/utils';
import Mesh from '../../libs/third-party/obj-loader/mesh';
import { useScene } from './util/use-engine';
import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';
import { Scene } from './core/scene';
import { Engine } from './core/engine';
import { Canvas } from '../../libs/utils/canvas';
import { RGBColor } from '../../libs/utils/color';
import { useRequest } from 'ahooks';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {}, []);

  const { run: start, loading } = useRequest(
    async () => {
      const triangles: Triangle[] = [];
      try {
        const res = await downloadModels([{ obj: '/models/cube/cube.obj', mtl: false, downloadMtlTextures: false }]);

        const mesh: Mesh = res.cube;

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

      const scene = new Scene({ width: WIDTH, height: HEIGHT });

      scene.add(triangles);

      if (canvasRef.current) {
        const canvas = new Canvas(canvasRef.current);
        const engine = new Engine(canvas);

        engine.load(scene).start();
      }
    },
    { manual: true }
  );

  return (
    <div style={{ width: 'fit-content', padding: '10px', display: 'flex' }}>
      <div className="positive">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

        {loading ? <p className="absolute top-10 left-10">正在加载，请稍后</p> : null}
      </div>

      <div style={{ marginLeft: 50 }}>
        <div>
          <button disabled={loading} onClick={start}>
            开始
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

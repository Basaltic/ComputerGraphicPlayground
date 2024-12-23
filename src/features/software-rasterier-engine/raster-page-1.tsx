import { useEffect, useRef } from 'react';
import { useScene } from './util/hooks';
import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';
import { Scene } from './core/scene';
import { Engine } from './core/engine';
import { Canvas } from '../../libs/utils/canvas';
import { RGBColor } from '../../libs/utils/color';

const WIDTH = 400;
const HEIGHT = 400;

const createTriangles = () => {
  // 构建一个三角形
  const v1 = Vector3.fromArray([-2, 2, -2]);
  const v2 = Vector3.fromArray([2, -2, -2]);
  const v3 = Vector3.fromArray([-2, -2, -2]);

  const c1 = RGBColor.random();
  const c2 = RGBColor.random();
  const c3 = RGBColor.random();

  console.log(c1, c2, c3);

  const vx1 = new Vertex(v1, c1);
  const vx2 = new Vertex(v2, c2);
  const vx3 = new Vertex(v3, c3);

  const t1 = new Triangle([vx1, vx2, vx3]);
  return [t1];
};

/**
 *
 */
export const SimSoftRendererPage1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const start = () => {
    const scene = new Scene({ width: WIDTH, height: HEIGHT });

    const ts = createTriangles();
    scene.add(ts);

    if (canvasRef.current) {
      const canvas = new Canvas(canvasRef.current);
      const engine = new Engine(canvas);

      engine.load(scene).start();
    }
  };

  return (
    <div style={{ width: 'fit-content', padding: '10px', display: 'flex' }}>
      <div>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      </div>

      <div style={{ marginLeft: 50 }}>
        <div>
          <button onClick={start}>开始</button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

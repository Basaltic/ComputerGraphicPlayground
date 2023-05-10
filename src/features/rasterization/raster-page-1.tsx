import { useEffect } from 'react';
import { useScene } from './util/hooks';
import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage1 = () => {
  const { canvasRef, getScene } = useScene(WIDTH, HEIGHT);

  useEffect(() => {
    // 构建一个三角形
    const v1 = Vector3.fromArray([-2, 2, -2]);
    const v2 = Vector3.fromArray([2, -2, -2]);
    const v3 = Vector3.fromArray([-2, -2, -2]);

    const c1 = Vector3.fromArray([235, 64, 52]);
    const c2 = Vector3.fromArray([66, 135, 245]);
    const c3 = Vector3.fromArray([245, 221, 66]);

    const vx1 = new Vertex(v1, c1);
    const vx2 = new Vertex(v2, c2);
    const vx3 = new Vertex(v3, c3);

    const t1 = new Triangle([vx1, vx2, vx3]);

    getScene()?.add(t1);
  }, []);

  const startRender = () => {
    getScene()?.render();
  };

  return (
    <div style={{ width: 'fit-content', padding: '10px', display: 'flex' }}>
      <div>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      </div>

      <div style={{ marginLeft: 50 }}>
        <div>
          <button onClick={startRender}>开始渲染</button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

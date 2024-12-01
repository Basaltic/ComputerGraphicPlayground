import { useEffect, useRef } from 'react';
import { useScene } from './util/hooks';
import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';
import { Scene } from './core/scene';
import { Engine } from './core/engine';
import { Canvas } from '../../libs/utils/canvas';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const start = () => {
    const scene = new Scene({ width: WIDTH, height: HEIGHT });
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

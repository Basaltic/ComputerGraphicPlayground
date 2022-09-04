import React, { useEffect, useRef } from 'react';
import { SoftEngine } from './core/soft-engine';
import { TestScene } from './scenes/test-scene';
import { Canvas } from './util/canvas';

import { TestSceneWithModel1 } from './scenes/scene-with-model-1';
import { downloadModels } from '../../libs/obj-loader/utils';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const context = canvasElement?.getContext('2d');
    if (context) {
      const canvas = new Canvas(context);
      const engine = new SoftEngine({ canvas: canvas });
      // const scene = new TestScene({ width: WIDTH, height: HEIGHT });
      const scene = new TestSceneWithModel1({ width: WIDTH, height: HEIGHT });

      engine.start(scene);
    }
  }, []);

  useEffect(() => {
    console.log('errr');
    downloadModels([{ obj: 'http://127.0.0.1:5173/models/cube/cube.obj', mtl: true }])
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

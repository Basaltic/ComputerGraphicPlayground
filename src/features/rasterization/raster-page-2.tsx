import React, { useEffect, useRef } from 'react';

import { TestSceneWithModel1 } from './scenes/scene-with-model-1';
import { downloadModels } from '../../libs/third-party/obj-loader/utils';
import { Canvas } from '../../libs/utils/canvas';

const WIDTH = 400;
const HEIGHT = 400;

/**
 *
 */
export const SimSoftRendererPage2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const canvas = new Canvas(canvasElement);
    }
  }, []);

  useEffect(() => {
    downloadModels([
      {
        obj: 'http://127.0.0.1:5173/models/cube/cube.obj',
        mtl: true,
        downloadMtlTextures: true,
        mtlTextureRoot: 'http://127.0.0.1:5173/models/cube'
      }
    ])
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div style={{ width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

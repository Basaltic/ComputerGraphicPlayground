import React, { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { RayTracingRenderer } from './core/ray-tracing-renderer';

/**
 * 光线追踪示例
 * - black background
 * -
 */
export const RayTracing9 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const RATIO = 1;

  const WIDTH = 600;

  const HEIGHT = WIDTH / RATIO;

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      new Canvas(canvasElement);
    }
  }, []);

  const render = () => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const renderer = new RayTracingRenderer(canvasElement, { aspectRatio: RATIO });
      renderer.render();
    }
  };

  return (
    <div style={{ width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: WIDTH, height: HEIGHT }} />

      <div>
        <button onClick={render}>开始渲染</button>
      </div>
    </div>
  );
};

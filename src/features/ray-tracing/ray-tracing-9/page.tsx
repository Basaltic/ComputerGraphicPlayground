import React, { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { RayTracingRenderer } from './core/ray-tracing-renderer';
import { useRayTracingController } from '@/components/custom/ray-tracing-controller/controller';

/**
 * 光线追踪示例
 * - black background
 * -
 */
export const RayTracing9 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, controller } = useRayTracingController();

  const RATIO = 16 / 9;

  const WIDTH = 400;

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
      renderer.render(state);
    }
  };

  return (
    <div className="flex gap-8 p-4 w-fit">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: WIDTH, height: HEIGHT }} />

      <div>
        {controller}
        <button onClick={render}>开始渲染</button>
      </div>
    </div>
  );
};

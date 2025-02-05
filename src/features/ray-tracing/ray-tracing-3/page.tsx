import React, { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { RayTracingRenderer } from './core/ray-tracing-renderer';
import { useRayTracingController } from '@/components/custom/ray-tracing-controller/controller';

const WIDTH = 400;
const HEIGHT = 225;

/**
 * 光线追踪示例
 * 1. 相机定位
 * 2. 景深（depth of field）| 散焦模糊 （defocus blur）
 */
export const RayTracing3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { state, controller } = useRayTracingController();

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      new Canvas(canvasElement);
    }
  }, []);

  const render = () => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const renderer = new RayTracingRenderer(canvasElement);
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

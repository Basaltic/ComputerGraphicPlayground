import { Button } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { RayTracingRenderer } from './core/ray-tracing-renderer';

/**
 * 光线追踪示例
 * - 随机小球的场景
 */
export const RayTracing5 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const RATIO = 3 / 2;

  const WIDTH = 300;

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
        <Button onClick={render}>开始渲染</Button>
      </div>
    </div>
  );
};

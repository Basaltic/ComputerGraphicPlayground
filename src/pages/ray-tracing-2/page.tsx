import { Button } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '../../libs/utils/canvas';
import { RayTracingRenderer } from './core/ray-tracing-renderer';

const WIDTH = 400;
const HEIGHT = 225;

/**
 * 光线追踪示例
 */
export const RayTracingTwoPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

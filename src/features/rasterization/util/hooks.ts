import { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { Scene } from '../core/scene';

export function useScene(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const canvas = new Canvas(canvasElement);
      const scene = new Scene(canvas, { width, height });

      sceneRef.current = scene;
    }
  }, []);

  return {
    getScene: () => sceneRef.current,
    canvasRef
  };
}

import { useEffect, useRef } from 'react';
import { Canvas } from '../../../libs/utils/canvas';
import { Engine, EngineOption } from '../core/engine';
import { Mesh } from '../core/mesh';

export const useEngine = (option?: EngineOption) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new Canvas(canvasRef.current);
      const engine = new Engine(canvas, option);

      engineRef.current = engine;
    }
  }, []);

  const run = () => {
    if (engineRef.current) {
      engineRef.current?.run?.();
    }
  };

  const camera = {
    rotate: (x?: number, y?: number, z?: number) => {
      engineRef.current?.scene.camera.rotate(x, y, z);
      run();
    },
    scale: (x?: number, y?: number, z?: number) => {
      engineRef.current?.scene.camera.scale(x, y, z);
      run();
    },
    translate: (x?: number, y?: number, z?: number) => {
      engineRef.current?.scene.camera.translate(x, y, z);
      run();
    }
  };

  const scene = {
    addMesh: (...meshs: Mesh[]) => {
      engineRef.current?.scene.add(...meshs);
      run();
    }
  };

  return { canvasRef, engineRef, scene, camera, run };
};

export type EngineType = ReturnType<typeof useEngine>;

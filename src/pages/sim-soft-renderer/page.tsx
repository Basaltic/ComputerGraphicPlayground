import React, { useEffect, useRef } from 'react'
import { SoftEngine } from './core/soft-engine';
import { TestScene } from './test-scene';
import { Canvas } from './util/canvas';

import obj from '../../models/cube/cube.obj'
import Mesh from '../../libs/obj-loader/mesh';


console.log(new Mesh(obj))

const WIDTH = 400;
const HEIGHT = 400;

/**
 * 
 */
export const SimSoftRendererPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasElement = canvasRef.current
    const context = canvasElement?.getContext('2d')
    if (context) {
      const canvas = new Canvas(context);
      const engine = new SoftEngine({ canvas: canvas })
      const scene = new TestScene({ width: WIDTH, height: HEIGHT });

      engine.loadScene(scene).start();
    }
  }, [])

  
  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  )
}

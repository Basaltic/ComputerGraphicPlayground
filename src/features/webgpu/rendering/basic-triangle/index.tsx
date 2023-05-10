import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import shader from './shader.wgsl';

const WIDTH = 400;
const HEIGHT = 400;

function fail(msg: string) {
  notifications.show({ title: 'Error!', message: msg });
}

export const WebGPUFundemental1DrawBasicTrianlge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const main = async () => {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
      fail('need a browser that supports WebGPU');
      return;
    }

    // Get a WebGPU context and configure it
    const canvas = canvasRef.current;
    const context = canvas?.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context?.configure({
      device,
      format: presentationFormat
    });

    const module = device.createShaderModule({
      label: 'red triangle shaders',
      code: shader
    });

    const pipeline = device.createRenderPipeline({
      label: 'ren triangle pipeline',
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs'
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format: presentationFormat }]
      }
    });

    //  GPURenderPassDescriptor 描述哪些纹理需要绘制以及如何使用他们
    const renderPassDescriptor = {
      label: 'basic canvas renderPass',
      colorAttachments: [
        {
          // 渲染的时候动态填充
          view: context?.getCurrentTexture().createView(),
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };

    const render = () => {
      // make a command encoder to start encoding commands
      const encoder = device.createCommandEncoder({ label: 'encoder' });

      // make a render pass encoder to encode render specific commands
      const pass = encoder.beginRenderPass(renderPassDescriptor as any);
      pass.setPipeline(pipeline);
      pass.draw(3); // 调用 3次 顶点着色器
      pass.end();

      const commandBuffer = encoder.finish();
      device.queue.submit([commandBuffer]);
    };

    render();
  };

  useEffect(() => {
    main();
  }, []);

  return (
    <div style={{ width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: WIDTH, height: HEIGHT }} />
    </div>
  );
};

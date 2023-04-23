import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import shader from './shader.wgsl';

const WIDTH = 400;
const HEIGHT = 400;

function fail(msg: string) {
  notifications.show({ title: 'Error!', message: msg });
}

export const WebGPUFundemental1SimpleComputationInGPU = () => {
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

    const pipeline = device.createComputePipeline({
      label: 'ren triangle pipeline',
      layout: 'auto',
      compute: {
        module,
        entryPoint: 'computeSomething'
      }
    });

    const input = new Float32Array([1, 3, 5]);

    // create a buffer on the GPU to hold our computation input and output
    const workBuffer = device.createBuffer({
      label: 'work buffer',
      size: input.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    // Copy our input data to that buffer
    device.queue.writeBuffer(workBuffer, 0, input);

    // create a buffer on the GPU to get a copy of the results
    const resultBuffer = device.createBuffer({
      label: 'result buffer',
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    // Setup a bindGroup to tell the shader which buffer to use for the computation
    const bindGroup = device.createBindGroup({
      label: 'bindGroup for work buffer',
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: workBuffer } }]
    });

    // Encode commands to do the computation
    const encoder = device.createCommandEncoder({
      label: 'doubling encoder'
    });
    const pass = encoder.beginComputePass({
      label: 'doubling compute pass'
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();

    // Encode a command to copy the results to a mappable buffer.
    encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size);

    // Finish encoding and submit the commands
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    // Read the results
    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(resultBuffer.getMappedRange());

    console.log('input', input);
    console.log('result', result);

    resultBuffer.unmap();
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

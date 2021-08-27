import { useMount } from 'ahooks';
import React, { useRef } from 'react';
import { createShader, createProgram } from '../webglutil';

/**
 * WebGL 随便尝试、玩耍的地方
 */
export default function WebglPlaygroundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useMount(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl');
      if (gl) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (program) {
          // 初始化的时候获取 shader中定义的attribute
          const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

          // 创建buffer，attribute需要从buffer中获取数据
          const positionBuffer = gl.createBuffer() as WebGLBuffer;

          // 绑定buffer
          // 把positionBuffer绑定到 gl.ARRAY_BUFFER这个全局变量
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

          // 通过 gl.ARRAY_BUFFER 这个标识，自动把positions的数据放到buffer中
          const positions = [0, 0, 0, 0.5, 0.7, 0];
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

          // 把 [-1, 1] 的标准立方体坐标映射到画布大小的像素坐标
          // [-1,  1 ]-> [0, canvas.width] & [0, canvas.height]
          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

          // 清除颜色，透明
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          // 告诉gl使用这个程序
          gl.useProgram(program);

          // 表示这个attribute是可用的
          gl.enableVertexAttribArray(positionAttributeLocation);

          // 告诉webgl的 这个attribute如何从 buffer中获取数据。绘制顶点
          const size = 2; // 每次取几个值
          const type = gl.FLOAT; // 取得数据的数据类型
          const normalize = false; // 是否需要归一
          const stride = 0; // 取数据的时候间隔是多少。比如size是2，stride是1，那么取顺序[0,1] -> [3,4]
          let offset = 0; // 从多少偏移位置开始去buffer中的数据
          gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

          // 真正的绘制像素
          // count是3，表示执行vertex shader三次
          // 因为类型是 TRIANGLES， 三角形，每执行三次就会绘制一个三角形
          const primitiveType = gl.TRIANGLES;
          offset = 0;
          const count = 3;
          gl.drawArrays(primitiveType, offset, count);
        }
      }
    }
  });

  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width="800" height="800" />
    </div>
  );
}

const vertexShaderSource = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
  }
`;

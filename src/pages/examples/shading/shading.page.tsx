import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '../../../renderer/canvas';
import { DEG_TO_RAD } from './math/const';
import { Matrix } from './math/matrix';
import { Triangle } from './math/shapes/triangle';
import { Vector3 } from './math/vector3';
import { useHotkeys } from 'react-hotkeys-hook';
import { OBJ } from '../../../libs/obj-loader';

const WIDTH = 800;
const HEIGHT = 800;
const PIXEL_SIZE = 4;

export default function ShadingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [options, setOptions] = useState({ x_rotate_angle: 0, y_rotate_angle: 0, z_rotate_angle: 0 });

  useHotkeys(
    'q',
    () => {
      setOptions({ ...options, x_rotate_angle: options.x_rotate_angle - 10 });
    },
    [options]
  );

  useHotkeys(
    'e',
    () => {
      setOptions({ ...options, x_rotate_angle: options.x_rotate_angle + 10 });
    },
    [options]
  );

  useHotkeys(
    'a',
    () => {
      setOptions({ ...options, y_rotate_angle: options.y_rotate_angle - 10 });
    },
    [options]
  );

  useHotkeys(
    'd',
    () => {
      setOptions({ ...options, y_rotate_angle: options.y_rotate_angle + 10 });
    },
    [options]
  );

  useHotkeys(
    'z',
    () => {
      setOptions({ ...options, z_rotate_angle: options.z_rotate_angle - 10 });
    },
    [options]
  );

  useHotkeys(
    'c',
    () => {
      setOptions({ ...options, z_rotate_angle: options.z_rotate_angle + 10 });
    },
    [options]
  );

  useEffect(() => {
    startDraw();
  }, [options]);

  /**
   * 开始绘制
   */
  const startDraw = () => {
    if (!canvasRef.current) return;

    const context: CanvasRenderingContext2D = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    const canvas = new Canvas(context);

    canvas.clear();

    const width = WIDTH / PIXEL_SIZE;
    const height = HEIGHT / PIXEL_SIZE;

    const mesh = new OBJ.Mesh(obj_file_str);

    const triangleList: Triangle[] = [];

    for (let i = 0; i < mesh.vertices.length; i += 9) {
      const v0 = new Vector3(mesh.vertices[i], mesh.vertices[i + 1], mesh.vertices[i + 2]);
      const v1 = new Vector3(mesh.vertices[i + 3], mesh.vertices[i + 4], mesh.vertices[i + 5]);
      const v2 = new Vector3(mesh.vertices[i + 6], mesh.vertices[i + 7], mesh.vertices[i + 8]);

      const colors = Vector3.createByArray([66, 135, 245]);

      const triangle = new Triangle([v0, v1, v2], [colors, colors, colors]);

      triangleList.push(triangle);
    }

    const eye_fov = 45;
    const eye_pos = new Vector3(0, 0, 5);
    const z_rotate_angle = options.z_rotate_angle;
    const z_near = -1;
    const z_far = -50;
    const aspect_ratio = 1;

    const projection = get_projection_matrix(eye_fov, aspect_ratio, z_near, z_far);
    const view = getViewMatrix(eye_pos);
    const model = getModelMatrix(options.x_rotate_angle, options.y_rotate_angle, options.z_rotate_angle);

    const mvp = projection.multiply(view).multiply(model);

    const f1 = (Math.abs(z_far) - Math.abs(z_near)) / 2;
    const f2 = (Math.abs(z_far) + Math.abs(z_near)) / 2;

    const frameBuffer = [];
    const z_buffer: number[] = [];

    for (let tria of triangleList) {
      // 普通的点转换为齐次坐标的点
      const v0 = [...tria.v0.coord, 1];
      const v1 = [...tria.v1.coord, 1];
      const v2 = [...tria.v2.coord, 1];

      // mvp变换
      const v00 = mvp.multiplyPoint(v0);
      const v11 = mvp.multiplyPoint(v1);
      const v22 = mvp.multiplyPoint(v2);

      const vs = [v00, v11, v22];
      // 齐次坐标归一
      for (let v of vs) {
        const w = v[3];
        v[0] /= w;
        v[1] /= w;
        v[2] /= w;
        v[3] /= w;
      }

      // 视口变换 - 把 [-1, 1] 的标准立方体变换到 指定长宽 [w, h] 的屏幕中
      for (let v of vs) {
        v[0] = 0.5 * width * v[0];
        v[1] = 0.5 * height * v[1];
        v[2] = v[2] * f1 + f2;
      }

      // 组成三角形
      const t0 = Vector3.createByArray(vs[0]);
      const t1 = Vector3.createByArray(vs[1]);
      const t2 = Vector3.createByArray(vs[2]);

      const triangle = new Triangle([t0, t1, t2], tria.colors);

      // 画出三角形1 - 构建包围盒，以包围盒的范围来进行
      const minX = Math.floor(Math.min(t0.x, t1.x, t2.x));
      const maxX = Math.ceil(Math.max(t0.x, t1.x, t2.x));
      const minY = Math.floor(Math.min(t0.y, t1.y, t2.y));
      const maxY = Math.ceil(Math.max(t0.y, t1.y, t2.y));

      for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
          if (triangle.isInside(i, j)) {
            const [alpha, beta, gamma] = computeBarycentric2D(i, j, triangle.v);

            const x = i + width / 2;
            const y = -j + height / 2;

            const w = 1 / (alpha + beta + gamma);
            let z_interpolated = alpha * triangle.v0.z + beta * triangle.v1.z + gamma * triangle.v2.z;
            z_interpolated *= w;

            const ind = x + y * width;

            const oldDepth = z_buffer[ind];

            if (oldDepth === undefined) {
              frameBuffer[ind] = triangle.colors[0].coord;
              z_buffer[ind] = z_interpolated;
            } else if (oldDepth < z_interpolated) {
              frameBuffer[ind] = triangle.colors[0].coord;
              z_buffer[ind] = z_interpolated;
            }
          }
        }
      }
    }

    // 画出整个frame
    for (let i = 0; i < frameBuffer.length; i++) {
      const color = frameBuffer[i];
      const x = i % width;
      const y = Math.floor(i / width);
      if (color) {
        canvas.drawPixel(x, y, color, PIXEL_SIZE);
      }
    }

    console.log('render finished !');
  };

  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

      <div style={{ position: 'absolute', top: 10, left: 1000 }}>
        <div>
          <form></form>
        </div>
        <br />
        <br />
        <div>
          <button onClick={startDraw}>开始绘制</button>
        </div>
        <br />
        <br />
        <div>A键: 左转，D键: 右转</div>
      </div>
    </div>
  );
}

/**
 * 获取模型矩阵 - 也就是变换矩阵
 */
const getModelMatrix = (x_rotation_angle: number, y_rotation_angle: number, z_rotation_angle: number) => {
  const x_rad_angle = x_rotation_angle * DEG_TO_RAD;
  const x_cos_value = Math.cos(x_rad_angle);
  const x_sin_value = Math.sin(x_rad_angle);

  const y_rad_angle = y_rotation_angle * DEG_TO_RAD;
  const y_cos_value = Math.cos(y_rad_angle);
  const y_sin_value = Math.sin(y_rad_angle);

  const z_rad_angle = z_rotation_angle * DEG_TO_RAD;
  const z_cos_value = Math.cos(z_rad_angle);
  const z_sin_value = Math.sin(z_rad_angle);

  const rotateByXMatrix = Matrix.createBy2dArray([
    [1, 0, 0, 0],
    [0, x_cos_value, -x_sin_value, 0],
    [0, x_sin_value, x_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  const rotateByYMatrix = Matrix.createBy2dArray([
    [y_cos_value, 0, y_sin_value, 0],
    [0, 1, 0, 0],
    [-y_sin_value, 0, y_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  const rotateByZMatrix = Matrix.createBy2dArray([
    [z_cos_value, -z_sin_value, 0, 0],
    [z_sin_value, z_cos_value, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);

  return rotateByXMatrix.multiply(rotateByYMatrix).multiply(rotateByZMatrix);
};

/**
 * 根据摄像机（观察）所在的位置，生成一个平移矩阵，移动到（0，0，0）的位置
 * @param eyePos
 */
const getViewMatrix = (eyePos: Vector3) => {
  const viewTranslateMatrix = Matrix.createBy2dArray([
    [1, 0, 0, -eyePos.x],
    [0, 1, 0, -eyePos.y],
    [0, 0, 1, -eyePos.z],
    [0, 0, 0, 1]
  ]);
  return viewTranslateMatrix;
};

/**
 * 获取投影矩阵
 *
 * @param eye_fov 摄像机的视野角度
 * @param aspect_ratio 宽长比
 * @param zNear 近平面距离（）
 * @param zFar 远平面距离
 */
const get_projection_matrix = (eye_fov: number, aspect_ratio: number, zNear: number, zFar: number) => {
  const radian_fov = eye_fov * DEG_TO_RAD;
  const tan_fov = Math.tan(radian_fov / 2);

  const top = tan_fov * Math.abs(zNear);
  const right = aspect_ratio * top;

  const right_to_left = right * 2;
  const top_to_bottom = top * 2;
  const near_to_far = zNear - zFar;

  // 这里默认 摄像机 在z轴上，那么不需要 x & y 轴的平移了
  // 正交矩阵
  const o1 = Matrix.createBy2dArray([
    [2 / right_to_left, 0, 0, 0],
    [0, 2 / top_to_bottom, 0, 0],
    [0, 0, 2 / near_to_far, 0],
    [0, 0, 0, 1]
  ]);
  const o2 = Matrix.createBy2dArray([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, -(zNear + zFar) / 2],
    [0, 0, 0, 1]
  ]);
  const ortho = o1.multiply(o2);

  // const ortho = Matrix.createBy2dArray([
  //   [2 / right_to_left, 0, 0, 0],
  //   [0, 2 / top_to_bottom, 0, 0],
  //   [0, 0, 2 / near_to_far, -(zNear + zFar) / near_to_far], // 这里是为什么？
  //   [0, 0, 0, 1]
  // ]);

  // 透视转为正交的矩阵
  const persp_to_ortho = Matrix.createBy2dArray([
    [zNear, 0, 0, 0],
    [0, zNear, 0, 0],
    [0, 0, zNear + zFar, -zNear * zFar],
    [0, 0, 1, 0]
  ]);

  const proj = ortho.multiply(persp_to_ortho);
  return proj;
};

/**
 * 计算重心坐标的三个参数
 *
 * @param x
 * @param y
 * @param v
 * @returns
 */
const computeBarycentric2D = (x: number, y: number, v: Vector3[]) => {
  const c1 =
    (x * (v[1].y - v[2].y) + (v[2].x - v[1].x) * y + v[1].x * v[2].y - v[2].x * v[1].y) /
    (v[0].x * (v[1].y - v[2].y) + (v[2].x - v[1].x) * v[0].y + v[1].x * v[2].y - v[2].x * v[1].y);
  const c2 =
    (x * (v[2].y - v[0].y) + (v[0].x - v[2].x) * y + v[2].x * v[0].y - v[0].x * v[2].y) /
    (v[1].x * (v[2].y - v[0].y) + (v[0].x - v[2].x) * v[1].y + v[2].x * v[0].y - v[0].x * v[2].y);
  const c3 =
    (x * (v[0].y - v[1].y) + (v[1].x - v[0].x) * y + v[0].x * v[1].y - v[1].x * v[0].y) /
    (v[2].x * (v[0].y - v[1].y) + (v[1].x - v[0].x) * v[2].y + v[0].x * v[1].y - v[1].x * v[0].y);
  return [c1, c2, c3];
};

const obj_file_str = `
####
#
#	OBJ File Generated by Blender
#
####
o my_cube.obj
v 1 1 -1
v -1 1 -1
v -1 -1 -1
v 1 -1 -1
v 1 1 -3
v -1 1 -3
v -1 -1 -3
v 1 -1 -1
vn 0 0 1
vn 1 0 0
vn -1 0 0
vn 0 0 -1
vn 0 1 0
vn 0 -1 0
f 1//1 2//1 3//1
f 3//1 4//1 1//1
f 5//2 1//2 4//2
f 4//2 8//2 5//2
f 2//3 6//3 7//3
f 7//3 3//3 2//3
f 7//4 8//4 5//4
f 5//4 6//4 7//4
f 5//5 6//5 2//5
f 2//5 1//5 5//5
f 8//6 4//6 3//6
f 3//6 7//6 8//6
`;

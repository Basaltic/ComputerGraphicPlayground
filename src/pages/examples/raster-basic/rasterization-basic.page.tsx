import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '../../../renderer/canvas';
import { DEG_TO_RAD } from './math/const';
import { Matrix } from './math/matrix';
import { Triangle } from './math/shapes/triangle';
import { Vector3 } from './math/vector3';
import { useHotkeys } from 'react-hotkeys-hook';
import { FormItem } from '../../../component/form';

const WIDTH = 800;
const HEIGHT = 800;

/**
 * 基本光栅化
 * @returns
 */
export default function BasicRasterizationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [options, setOptions] = useState({ z_rotate_angle: 0, anti_alias: 0, pixel_size: 1, eye_fov: 45, z_near: -1, z_far: -50 });

  useHotkeys('a', () => setOptions({ ...options, z_rotate_angle: options.z_rotate_angle - 10 }), [options]);
  useHotkeys('d', () => setOptions({ ...options, z_rotate_angle: options.z_rotate_angle + 10 }), [options]);

  useEffect(() => {
    startRender();
  }, [options.z_rotate_angle]);

  /**
   * 开始绘制
   */
  const startRender = () => {
    if (!canvasRef.current) return;

    const context: CanvasRenderingContext2D = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    const canvas = new Canvas(context);

    canvas.clear();

    const width = WIDTH / options.pixel_size;
    const height = HEIGHT / options.pixel_size;

    // 空间中点坐标定义
    const vecs = [
      [2, 0, -2],
      [0, 2, -2],
      [-2, 0, -2],
      [3.5, -1, -5],
      [2.5, 1.5, -5],
      [-1, 0.5, -5],

      [1, 0, -1],
      [0, 4, -4],
      [-2, 0, -7]
    ];
    // 组成三角形关系
    const inds = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    // 每个点的颜色
    const cols = [
      [185, 217, 238],
      [185, 217, 238],
      [185, 217, 238],
      [217, 238, 185],
      [217, 238, 185],
      [217, 238, 185],
      [66, 135, 245],
      [66, 135, 245],
      [66, 135, 245]
    ];

    const eye_fov = options.eye_fov;
    const eye_pos = new Vector3(0, 0, 5);
    const z_rotate_angle = options.z_rotate_angle;
    const z_near = options.z_near;
    const z_far = options.z_far;
    const aspect_ratio = 1;

    const projection = get_projection_matrix(eye_fov, aspect_ratio, z_near, z_far);
    const view = getViewMatrix(eye_pos);
    const model = getModelMatrix(z_rotate_angle);

    const mvp = projection.multiply(view).multiply(model);

    const f1 = (Math.abs(z_far) - Math.abs(z_near)) / 2;
    const f2 = (Math.abs(z_far) + Math.abs(z_near)) / 2;

    const frameBuffer = [];
    const z_buffer: number[] = [];

    for (let ind of inds) {
      // 普通的点转换为齐次坐标的点
      const v0 = [...vecs[ind[0]], 1];
      const v1 = [...vecs[ind[1]], 1];
      const v2 = [...vecs[ind[2]], 1];

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

      const colors = [cols[ind[0]], cols[ind[1]], cols[ind[2]]].map((c) => Vector3.createByArray(c));

      const triangle = new Triangle([t0, t1, t2], colors);

      // 画出三角形1 - 构建包围盒，以包围盒的范围来进行
      const minX = Math.floor(Math.min(t0.x, t1.x, t2.x));
      const maxX = Math.ceil(Math.max(t0.x, t1.x, t2.x));
      const minY = Math.floor(Math.min(t0.y, t1.y, t2.y));
      const maxY = Math.ceil(Math.max(t0.y, t1.y, t2.y));

      // MSAA - n * n
      const antiAlias = options.anti_alias > 0;
      const antiAliasN = options.anti_alias;

      for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
          // 开启抗锯齿 - MSAA
          if (antiAlias) {
            const ysqrt = antiAliasN * antiAliasN;

            const gap = 1 / (antiAliasN * 2);

            let count = 0;
            for (let x = 1; x <= ysqrt; x++) {
              const row = Math.ceil(x / antiAliasN);
              const col = x % antiAliasN;

              const xx = i + (col * 2 - 1) * gap;
              const yy = j + (row * 2 - 1) * gap;

              const is_inside_triangle = triangle.isInside(xx, yy);
              if (is_inside_triangle === true) {
                count += 1;
              }
            }
            if (count > 0) {
              const [alpha, beta, gamma] = computeBarycentric2D(i, j, triangle.v);

              const x = i + width / 2;
              const y = -j + height / 2;

              const w = 1 / (alpha + beta + gamma);
              let z_interpolated = alpha * triangle.v0.z + beta * triangle.v1.z + gamma * triangle.v2.z;
              z_interpolated *= w;

              const ind = x + y * width;

              const oldDepth = z_buffer[ind];

              if (oldDepth === undefined || oldDepth < z_interpolated) {
                frameBuffer[ind] = triangle.colors[0].coord.concat(count / ysqrt);
                z_buffer[ind] = z_interpolated;
              }
            }
          }
          // 没有抗锯齿
          else {
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
    }

    // 画出整个frame
    for (let i = 0; i < frameBuffer.length; i++) {
      const color = frameBuffer[i];
      const x = i % width;
      const y = Math.floor(i / width);
      if (color) {
        canvas.drawPixel(x, y, color, options.pixel_size);
      }
    }

    console.log('render finished !');
  };

  /**
   * 抗锯齿选项
   */
  const change_anti_alias_option = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = parseInt(e.target.value);
    setOptions({ ...options, anti_alias: n });
  };

  /**
   * 更改像素的大小
   */
  const change_pixel_size = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setOptions({ ...options, pixel_size: size });
  };

  /**
   * 更改z near
   */
  const change_z_near = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z_near = parseInt(e.target.value);
    setOptions({ ...options, z_near });
  };

  /**
   * 更改z far
   */
  const change_z_far = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z_far = parseInt(e.target.value);
    setOptions({ ...options, z_far });
  };

  /**
   * 更改 eye fov
   */
  const change_eye_fov = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eye_fov = parseInt(e.target.value);
    setOptions({ ...options, eye_fov });
  };

  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

      <div style={{ position: 'absolute', top: 10, left: 1000 }}>
        <div>
          <form>
            <FormItem label="Z Near">
              <input type="number" value={options.z_near} onChange={change_z_near} />
            </FormItem>
            <FormItem label="Z Far">
              <input type="number" value={options.z_far} onChange={change_z_far} />
            </FormItem>
            <FormItem label="Eye fov">
              <input type="number" value={options.eye_fov} onChange={change_eye_fov} />
            </FormItem>
            <FormItem label="Pixel Size">
              <select onChange={change_pixel_size}>
                <option value="1">1x</option>
                <option value="4">4x</option>
                <option value="8">8x</option>
              </select>
            </FormItem>
            <FormItem label="Anti Alias">
              <select onChange={change_anti_alias_option}>
                <option value="0">--Please choose an option--</option>
                <option value="2">MSAA 4x</option>
                <option value="4">MSAA 8x</option>
                <option value="8">MSAA 16x</option>
              </select>
            </FormItem>
          </form>
        </div>
        <br />
        <br />
        <div>
          <button onClick={startRender}>Render</button>
        </div>
        <br />
        <br />
        <div>A: Left Rotation，D: Right Rotation</div>
      </div>
    </div>
  );
}

/**
 * 获取模型矩阵 - 也就是变换矩阵
 */
const getModelMatrix = (rotation_angle: number) => {
  const rad_angle = rotation_angle * DEG_TO_RAD;
  const cos_value = Math.cos(rad_angle);
  const sin_value = Math.sin(rad_angle);

  const rotateByZMatrix = Matrix.createBy2dArray([
    [cos_value, -sin_value, 0, 0],
    [sin_value, cos_value, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);

  return rotateByZMatrix;
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

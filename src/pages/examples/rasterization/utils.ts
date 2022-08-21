import { DEG_TO_RAD } from '../../../libs/math/const';
import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector3 } from '../../../libs/math/vector3';

/**
 * 获取模型矩阵 - 也就是变换矩阵
 */
export const get_model_matrix = (z_rotation_angle: number, y_rotation_angle: number, x_rotation_angle: number) => {
  const z_rad_angle = z_rotation_angle * DEG_TO_RAD;
  const z_cos_value = Math.cos(z_rad_angle);
  const z_sin_value = Math.sin(z_rad_angle);
  const rotateByZMatrix = Matrix4.createBy2dArray([
    [z_cos_value, -z_sin_value, 0, 0],
    [z_sin_value, z_cos_value, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);

  const y_rad_angle = y_rotation_angle * DEG_TO_RAD;
  const y_cos_value = Math.cos(y_rad_angle);
  const y_sin_value = Math.sin(y_rad_angle);
  const rotateByYMatrix = Matrix4.createBy2dArray([
    [y_cos_value, 0, y_sin_value, 0],
    [0, 1, 0, 0],
    [-y_sin_value, 0, y_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  const x_rad_angle = x_rotation_angle * DEG_TO_RAD;
  const x_cos_value = Math.cos(x_rad_angle);
  const x_sin_value = Math.sin(x_rad_angle);
  const rotateByXMatrix = Matrix4.createBy2dArray([
    [1, 0, 0, 0],
    [0, x_cos_value, -x_sin_value, 0],
    [0, x_sin_value, x_cos_value, 0],
    [0, 0, 0, 1]
  ]);

  console.log(x_rotation_angle, y_rotation_angle, z_rotation_angle);

  return rotateByXMatrix.multiply(rotateByYMatrix).multiply(rotateByZMatrix);
};

/**
 * 根据摄像机（观察）所在的位置，生成一个平移矩阵，移动到（0，0，0）的位置
 * @param eyePos
 */
export const get_view_matrix = (eyePos: Vector3) => {
  const viewTranslateMatrix = Matrix4.createBy2dArray([
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
export const get_projection_matrix = (eye_fov: number, aspect_ratio: number, zNear: number, zFar: number) => {
  const radian_fov = eye_fov * DEG_TO_RAD;
  const tan_fov = Math.tan(radian_fov / 2);

  const top = tan_fov * Math.abs(zNear);
  const right = aspect_ratio * top;

  const right_to_left = right * 2;
  const top_to_bottom = top * 2;
  const near_to_far = zNear - zFar;

  // 这里默认 摄像机 在z轴上，那么不需要 x & y 轴的平移了
  // 正交矩阵
  const o1 = Matrix4.createBy2dArray([
    [2 / right_to_left, 0, 0, 0],
    [0, 2 / top_to_bottom, 0, 0],
    [0, 0, 2 / near_to_far, 0],
    [0, 0, 0, 1]
  ]);
  const o2 = Matrix4.createBy2dArray([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, -(zNear + zFar) / 2],
    [0, 0, 0, 1]
  ]);
  const ortho = o1.multiply(o2);

  // 透视转为正交的矩阵
  const persp_to_ortho = Matrix4.createBy2dArray([
    [zNear, 0, 0, 0],
    [0, zNear, 0, 0],
    [0, 0, zNear + zFar, -zNear * zFar],
    [0, 0, 1, 0]
  ]);

  const proj = ortho.multiply(persp_to_ortho);
  return proj;
};

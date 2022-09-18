/**
 * 返回随机数
 */
export function randomNum(min?: number, max?: number) {
  if (min && max) {
    return min + (max - min) * Math.random();
  }
  return Math.random();
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomNum(min, max));
}

/**
 * 数字裁剪
 *
 * @param num
 * @param min
 * @param max
 */
export function clamp(num: number, min: number, max: number) {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

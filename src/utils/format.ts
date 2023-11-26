export const clamp = (num: number, min: number, max: number) => {
  // num min 取最大
  return Math.min(Math.max(num, min), max)
}

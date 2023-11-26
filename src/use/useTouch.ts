import { ref } from 'vue'

// 获取方向 横向 or 纵向
const getDirection = (x: number, y: number) => {
  if (x > y) {
    return 'horizontal'
  }
  if (y > x) {
    return 'vertical'
  }
  return ''
}

// touch hooks
export function useTouch() {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const direction = ref('')
  const isVertical = () => direction.value === 'vertical'
  const isHorizontal = () => direction.value === 'horizontal'

  // 重新设定
  const reset = () => {
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0
  }

  /**
   *  touch start
   *  记录起始位置
   * @param event
   */
  const start = (event: TouchEvent) => {
    reset()
    startX.value = event.touches[0].clientX
    startY.value = event.touches[0].clientY
  }

  // move
  const move = (event: TouchEvent) => {
    // touches[0] 应该是指的是 第一根手指
    const touch = event.touches[0]

    // 沿着x移动的距离，通过与 startX 比较，计算出距离
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value
    deltaY.value = touch.clientY - startY.value
    // 偏移量一定是正数
    offsetX.value = Math.abs(deltaX.value)
    offsetY.value = Math.abs(deltaY.value)
    // 当移动的距离小于 10 的时候，看做出误触吧
    const LOCK_DIRECTION_DISTANCE = 10
    // 只会计算一次方向
    // 1.是否第一次计算一次方向了。
    // 2.触摸的距离是否大于10
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      direction.value = getDirection(offsetX.value, offsetY.value)
    }
  }

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
  }
}

import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * 当我们修改一些值的时候，会对页面造成一定的影响
 * 能关联到搜索页的切换
 * @param initState 初始状态
 * @return Ref<boolean> 包装 initState
 * @return () => void 对state取反
 */
export function useToggle(initState: boolean): [Ref<boolean>, () => void] {
  const state = ref(initState)
  const toggle = function () {
    state.value = !state.value
  }
  return [state, toggle]
}

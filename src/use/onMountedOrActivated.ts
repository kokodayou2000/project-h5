import { nextTick, onActivated, onMounted } from 'vue'

export function onMountedOrActivated(hook: () => void) {
  let mounted: boolean

  onMounted(() => {
    hook()
    // 下一次 DOM 更新刷新的工具方法。
    nextTick(() => {
      mounted = true
    })
  })
  // 缓存到 KeepLive 树中
  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}

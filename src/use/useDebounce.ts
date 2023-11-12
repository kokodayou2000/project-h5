import type { Ref, UnwrapRef } from 'vue'
import { onUnmounted, ref, watch } from 'vue'

interface IDebounceFn<T> {
  (...args: T[]): void | Promise<void>
}

// export function useDebounce<T>(fn: IDebounceFn<T>, delay: number) {
//   // https://stackoverflow.com/a/64071901
//   //  可能为 null or setTimeout 的返回值
//   let timeoutId: null | ReturnType<typeof setTimeout> = null
//   return function f(this: void, ...args: T[]) {
//     if (timeoutId) {
//       clearTimeout(timeoutId)
//     }
//
//     timeoutId = setTimeout(() => {
//       fn.call(this, ...args)
//     }, delay)
//   }
// }

export function useDebounce<T>(value: Ref<T>, delay: number) {
  const debounceValue = ref(value.value)

  let timeoutId: null | ReturnType<typeof setTimeout> = null
  // 对 value 进行封装，当 修改时间超过1s之后，才会修改 debounceValue
  const unwatch = watch(value, (nv) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      debounceValue.value = nv as UnwrapRef<T>
    }, delay)
  })
  onUnmounted(() => {
    unwatch()
  })
  return debounceValue
}

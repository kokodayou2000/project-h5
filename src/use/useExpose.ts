import { getCurrentInstance } from 'vue'
import { extend } from '@/utils/basic'

export function useExpose<T = Record<string, any>>(apis: T) {
  const instance = getCurrentInstance()
  if (instance) {
    // 将 apis 注入到 instance 中
    extend(instance, apis)
  }
}

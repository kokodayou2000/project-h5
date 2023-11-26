import type { InjectionKey } from 'vue'
import { getCurrentInstance, inject, onUnmounted } from 'vue'
import type { Child } from './useChildren'

// link unlink 已经一些别的变量
export type ParentProvide<T> = T & {
  link(instance: Child): void
  unlink(instance: Child): void
  [key: string]: any
}

/**
 * 子组件中使用父组件中的数据
 * @param key
 */
export function useParent<T>(key: InjectionKey<ParentProvide<T>>) {
  // 获取父组件
  const parent = inject(key, null)

  if (!parent) {
    return {
      parent: null,
    }
  }
  // 获取当前组件实例
  const instance = getCurrentInstance()
  const { link, unlink } = parent
  // 将当前组件加入到 link
  link(instance)
  // 当组件卸载的时候， unlink
  onUnmounted(() => unlink(instance))

  // 父组件
  return {
    parent,
  }
}

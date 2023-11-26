import type { ComponentInternalInstance, InjectionKey } from 'vue'
import { provide, reactive } from 'vue'
import type { ParentProvide } from './useParent'

export type NotNullChild = ComponentInternalInstance & Record<string, any>
export type Child = NotNullChild | null

/**
 * 钩子函数
 * @param key
 */
export function useChildren<T>(key: InjectionKey<ParentProvide<T>>) {
  // 一个父组件可能包含多个子组件
  const children = reactive<Child[]>([])

  // 将子组件放到 list中，以便父组件使用
  const linkChildren = (value?: T) => {
    const link = (child: Child) => {
      children.push(child)
    }

    // 将子组件从数组中删除
    const unlink = (child: Child) => {
      const index = children.indexOf(child)
      children.splice(index, 1)
    }

    // 暴露出来，以便子组件使用
    provide(key, {
      link,
      unlink,
      ...value,
    })
  }
  // 子组件集合和 link子组件的方法
  return {
    children,
    linkChildren,
  }
}

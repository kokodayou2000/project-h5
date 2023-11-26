import type { CSSProperties } from 'vue'
import { computed, defineComponent, reactive } from 'vue'
import { createNamespace } from '@/utils/create'
import { useExpose } from '@/use/useExpose'
import { useParent } from '@/use/useParent'
import { SWIPE_KEY } from './OpSwipe'

const [name, bem] = createNamespace('swipe-item')

export default defineComponent({
  name,
  setup(props, { slots }) {
    const state = reactive({
      offset: 0,
    })
    const { parent } = useParent(SWIPE_KEY)

    const style = computed(() => {
      const style: CSSProperties = {}

      if (parent) {
        // 宽度or高度和父组件一致
        if (parent.size.value) {
          style[parent.props.vertical ? 'height' : 'width'] = `${parent.size.value}px`
        }
        // 偏移量，通过暴露给 parent 设定值
        if (state.offset) {
          style.transform = `translate${parent.props.vertical ? 'Y' : 'X'}(${state.offset}px)`
        }
      }
      return style
    })

    const setOffset = (offset: number) => {
      state.offset = offset
    }
    // 暴露出去，以便父组件使用
    useExpose({ setOffset })

    return () => (
      <div class={bem()} style={style.value}>
        {slots.default?.()}
      </div>
    )
  },
})

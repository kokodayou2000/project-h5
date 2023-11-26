import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import {createNamespace} from '@/utils/create'
import {clamp} from '@/utils/format'
import {doubleRaf} from '@/utils/raf'
import {type NotNullChild, useChildren} from '@/use/useChildren'
import {useTouch} from '@/use/useTouch'
import {useEventListener} from '@/use/useEventListener'
import './OpSwipe.scss'

// name: op-swipe
// bem: bem('indicator',{active})
// 结果 op-swipe op-swipe__indicator--active
const [name, bem] = createNamespace('swipe')

export const SWIPE_KEY = Symbol(name)

// swipe 状态
// 高度 宽度，偏移量，活动页索引，是否滚动
export type SwipeState = {
  rect: {
    width: number
    height: number
  } | null
  width: number
  height: number
  offset: number
  active: number
  swiping: boolean
}

/**
 * 定义组件
 * name 参数 setup
 */
export default defineComponent({
  name,
  props: {
    // 自动播放
    autoplay: {
      type: Number,
      default: 0,
    },
    // 延迟
    duration: {
      type: Number,
      default: 500,
    },
    // 循环
    loop: {
      type: Boolean,
      default: true,
    },
    // 显示 dot
    showIndicators: {
      type: Boolean,
      default: true,
    },
    // 水平or垂直 滚动
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    // css
    const root = ref()
    // css
    const track = ref()
    // 状态
    const state = reactive<SwipeState>({
      rect: null,
      offset: 0,
      width: 0,
      height: 0,
      active: 0,
      swiping: false,
    })
    // touch hooks
    const touch = useTouch()
    // 需要使用子组件
    const { children, linkChildren } = useChildren(SWIPE_KEY)
    // 偏移量 根据水平or垂直来获取不同的
    const delta = computed(() => (props.vertical ? touch.deltaY.value : touch.deltaX.value))
    // 子组件数量
    const count = computed(() => children.length)
    // 根据 state[height] or state[width] 宽度 or 高度
    // 记录移动的距离，以便进行一些处理，假设touch到一半 touch 10px 内 ...
    const size = computed(() => state[props.vertical ? 'height' : 'width'])
    // 轨道线条大小
    const trackSize = computed(() => count.value * size.value)
    // 轨道线样式
    const trackStyle = computed(() => {
      const mainAxis = props.vertical ? 'height' : 'width'
      const style = {
        // 延时
        transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
        // 横向 or 纵向 但是只移动偏移量
        transform: `translate${props.vertical ? 'Y' : 'X'}(${state.offset}px)`,
        // 高度 or 宽度
        [mainAxis]: `${trackSize.value}px`,
      }
      return style
    })
    // 最小偏移量
    const minOffset = computed(() => {
      if (state.rect) {
        // 宽度 or 高度 的距离
        const base = props.vertical ? state.rect.height : state.rect.width
        return base - trackSize.value
      }
      return 0
    })
    // 活动的dot
    const activeIndicator = computed(() => {
      return (state.active + count.value) % count.value
    })

    // 步长一般设定为 1
    const getTargetActive = (pace: number) => {
      const { active } = state
      if (pace) {
        // 如果是循环的话
        if (props.loop) {
          // 假设 到末尾 ，现在步长为 1
          // 0 1 2 active+ 1 = 3  所以 返回 3
          // 这里只是为了避免步长为 >2 的时候超出范围的问题
          return clamp(active + pace, -1, count.value)
        }
        // 如果不循环的话，只会返回 [0,2] 之间
        return clamp(active + pace, 0, count.value - 1)
      }
      return active
    }

    // 计算偏移量 从初始位置开始计算的
    const getTargetOffset = (targetActive: number, offset = 0) => {
      const currentPosition = targetActive * size.value
      return offset - currentPosition
    }

    /**
     * move
     * @param pace 步长
     * @param offset 偏移量
     */
    const move = ({ pace = 0, offset = 0 }) => {
      // 如果item小于等于1
      // 不需要move
      if (count.value <= 1) {
        return
      }
      // 当前 active item
      const targetActive = getTargetActive(pace)
      // 当前 item 和 距离下一个的偏移量
      const targetOffset = getTargetOffset(targetActive, offset)
      // 如果自动循环的话
      if (props.loop) {
        // 正向滚动，从左向右
        // children 至少存在一个，并且目标偏移量 目标偏移量不等于最小偏移量
        // targetOffset 不等于 miniOffset.value
        if (children[0] && targetOffset !== minOffset.value) {
          // 如果大于 最小偏移量，才会设定偏移量，如果未到达最小偏移量，则设定成 0
          const outRightBound = targetOffset < minOffset.value
          // 如果超出了最小偏移量，就不移动，否则将第一个元素的偏移量设定为末尾
          children[0].setOffset(outRightBound ? trackSize.value : 0)
        }
        // 反向滚动，从右向左
        if (children[count.value - 1] && targetOffset !== 0) {
          const onLeftBound = targetOffset > 0
          ;(children[count.value - 1] as NotNullChild).setOffset(onLeftBound ? -trackSize.value : 0)
        }
      }
      // 当前活动 item
      state.active = targetActive
      // 偏移量
      state.offset = targetOffset
    }

    // 矫正位置
    const correctPosition = () => {
      state.swiping = true
      if (state.active <= -1) {
        // 直接移动到末尾
        move({ pace: count.value })
      } else if (state.active >= count.value) {
        // 反向移动
        move({ pace: -count.value })
      }
    }

    // 执行
    const next = () => {
      correctPosition()

      // 为什么要 double？
      // 因为 correctPosition 完成位置重置最多需要两次渲染，
      // 第一次是 swipeItem setOffset，第二次是 track 的 offset
      // 为了保证真正滚动时位置已经重置，所以这里需要 doubleRaf，等渲染两次
      doubleRaf(() => {
        state.swiping = false
        move({
          pace: 1,
        })
      })
    }

    let timeout: number
    const stopAutoPlay = () => clearTimeout(timeout)
    const autoplay = () => {
      stopAutoPlay()
      if (props.autoplay > 0 && count.value > 1) {
        timeout = setTimeout(() => {
          next()
          autoplay()
        }, props.autoplay)
      }
    }

    const init = () => {
      if (!root.value) {
        return
      }
      // 根据class来获取的
      const rect = {
        width: root.value?.offsetWidth,
        height: root.value?.offsetHeight,
      }
      state.rect = rect
      state.width = rect.width
      state.height = rect.height
      autoplay()
    }

    let touchStartTime: number

    /**
     * 当用户点击
     * 会记录点击的位置，起始时间，停止自动播放，修正位置
     * @param event
     */
    const onTouchStart = (event: TouchEvent) => {
      touch.start(event)
      touchStartTime = Date.now()

      stopAutoPlay()
      correctPosition()
    }
    /**
     * 执行move
     *
     * @param event
     */
    const onTouchMove = (event: TouchEvent) => {
      touch.move(event)

      event.preventDefault()
      move({ offset: delta.value })
    }
    // 滑动结束，进行一些处理
    const onTouchEnd = () => {
      const duration = Date.now() - touchStartTime
      const speed = delta.value / duration
      // 如果滑动速度大于 0.25，或者滑动距离大于一半，则滚动到下一张
      const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2

      if (shouldSwipe) {
        const offset = props.vertical ? touch.offsetY.value : touch.offsetX.value
        let pace = 0
        if (props.loop) {
          // 如果偏移量大于0，并且 距离大于 0 pace = -1
          pace = offset > 0 ? (delta.value > 0 ? -1 : 1) : 0
        } else {
          pace = -Math[delta.value > 0 ? 'ceil' : 'floor'](delta.value / size.value)
        }
        // 移动的步长，假如为-1?
        move({ pace })
      } else {
        move({ pace: 0 })
      }

      state.swiping = false
      autoplay()
    }
    // 渲染 Dot 假如是活动的，就设置为 active
    const renderDot = (_: string, index: number) => {
      const active = index === activeIndicator.value
      return <i class={bem('indicator', { active })}></i>
    }
    // 渲染指示器
    const renderIndicator = () => {
      if (props.showIndicators) {
        return <div class={bem('indicators')}>{Array(count.value).fill('').map(renderDot)}</div>
      }
    }

    // 链接
    linkChildren({
      size,
      props,
    })
    // 组件加载的时候
    onMounted(init)
    // 在卸载之前，先暂停
    onBeforeUnmount(stopAutoPlay)
    watch(() => props.autoplay, autoplay)
    // 事件监听器
    // 对 touchMove事件进行处理
    useEventListener('touchmove', onTouchMove, {
      target: track,
    })

    return () => (
      <div ref={root} class={bem()}>
        <div
          ref={track}
          style={trackStyle.value}
          class={bem('track')}
          onTouchstart={onTouchStart}
          onTouchend={onTouchEnd}
        >
          {slots.default?.()}
        </div>
        {renderIndicator()}
      </div>
    )
  },
})

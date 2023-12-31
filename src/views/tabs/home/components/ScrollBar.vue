<script lang="ts" setup>
import type { IScrollBarInfo } from '@/types'
import { onMounted, ref } from 'vue'
import { useInterval } from '@/use/useInterval'

interface IProps {
  intervalTime?: number
  transitionTime?: number
  height?: number
  data: IScrollBarInfo[]
}

const props = withDefaults(defineProps<IProps>(), {
  intervalTime: 3000,
  transitionTime: 1000,
  height: 40,
})

const heightPx = `${props.height}px`
const containerRef = ref()
onMounted(() => {
  // 获取dom
  const container = containerRef.value
  // 获取子dom个数 方便确定是否到了末尾
  const count = container.children.length
  // 记录首节点
  const firstSwipeItem = container.children[0]
  // 设定高度
  container.style.height = `${count * props.height}px`
  let index = 0
  // 定时切换位置
  useInterval(() => {
    index++
    // 如果超过 item 个数就需要将第一个元素接到后面
    if (index >= count) {
      // 移动到最初的位置
      firstSwipeItem.style.transform = `translateY(${index * props.height}px)`
      // 第一个元素滚动动画结束之后，将整个 container 位置重置
      const timeout = setTimeout(() => {
        // 重置逻辑
        firstSwipeItem.style.transform = ''
        container.style.transform = ''
        container.style.transition = ''
        clearTimeout(timeout)
      }, props.transitionTime)
    }
    // 向上移动
    container.style.transform = `translateY(-${index * props.height}px)`
    // 移动时间
    container.style.transition = `all linear ${props.transitionTime}ms`
    index = index % count
  }, props.intervalTime)
})
</script>

<template>
  <div class="home-scroll-bar">
    <div class="home-scroll-bar__swipe">
      <div ref="containerRef">
        <div v-for="v in props.data" :key="v.type" class="swipe-item">
          <div :class="`scroll-bar__info__${v.type}`" class="scroll-bar__info">
            <span class="info-badge">{{ v.badge }}</span>
            <span class="info-detail" v-html="v.detail"></span>
            <span class="info-btn op-thin-border">{{ v.btn }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home-scroll-bar {
  --bean-color: rgb(252, 164, 40);
  --hongbao-color: rgb(252, 68, 25);

  &__swipe {
    background: white;
    border-radius: 8px;
    margin: 5px 10px;
    font-size: 13px;
    position: relative;
    overflow: hidden;
    height: v-bind(heightPx);

    .swipe-item {
      height: v-bind(heightPx);
    }
  }

  .scroll-bar__info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
    height: 100%;

    .info-badge {
      border-radius: 5px;
      padding: 2px 6px;
      color: white;
      margin-right: 6px;
      font-size: 12px;
    }

    .info-detail {
      flex: 1;
    }

    .info-btn {
      padding: 3px 14px;
      font-size: 12px;

      &.op-thin-border:before {
        border-radius: 50px;
      }
    }

    .info-num {
      font-weight: bold;
      margin: 0 2px;
    }

    &__bean {
      .info-badge {
        background: var(--bean-color);
      }

      .info-btn {
        color: var(--bean-color);

        &:before {
          border-color: var(--bean-color);
        }
      }

      .info-num {
        color: var(--bean-color);
      }
    }

    &__hongbao {
      .info-badge {
        background: var(--hongbao-color);
      }

      .info-btn {
        color: var(--hongbao-color);

        &:before {
          border-color: var(--hongbao-color);
        }
      }

      .info-num {
        color: var(--hongbao-color);
      }
    }
  }
}
</style>

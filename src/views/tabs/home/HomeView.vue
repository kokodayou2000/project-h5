<script lang="ts" setup>
import { useToggle } from '@/use/useToggle'
import SearchView from '@/views/search/SearchView.vue'
import { useAsync } from '@/use/useAsync'
import { fetchHomePageData } from '@/api/home'
import type { ICountdown, IHomeInfo } from '@/types'
import { PRIMARY_COLOR, TRANSPARENT } from '@/config'
import { ref } from 'vue'
import { HOME_TABS } from '@/views/tabs/home/config'
import OpSwipeItem from '@/components/swipe/OpSwipeItem'
import OpLoadingView from '@/components/OpLoadingView.vue'
import TheTransformer from '@/views/tabs/home/components/TheTransformer.vue'
import ScrollBar from '@/views/tabs/home/components/ScrollBar.vue'
import OpSwipe from '@/components/swipe/OpSwipe'
import TheTop from '@/views/tabs/home/components/TheTop.vue'
import CountDown from '@/views/tabs/home/components/CountDown.vue'

const recommends = [
  {
    value: 1,
    label: '牛腩',
  },
  {
    value: 2,
    label: '奶茶',
  },
]
// 用来管理搜索页面是否显示,isSearchViewShown 是状态 toggleSearchView 是action
const [isSearchViewShown, toggleSearchView] = useToggle(false)

const { pending, data } = useAsync(fetchHomePageData, {
  banner: [],
  searchRecommends: [],
  transformer: [],
  scrollBarInfoList: [],
  countdown: {} as ICountdown,
  activities: [],
} as IHomeInfo)

const tabBackgroundColor = ref(TRANSPARENT)
const onTabScroll = ({ isFixed }: { isFixed: Boolean }) => {
  tabBackgroundColor.value = isFixed ? 'write' : TRANSPARENT
}
</script>

<template>
  <div class="home-page">
    <Transition name="fade">
      <SearchView v-if="isSearchViewShown" @cancel="toggleSearchView"></SearchView>
    </Transition>
    <!--  只有不显示搜索页的时候，才加载主页  -->
    <div v-show="!isSearchViewShown">
      <TheTop :recommends="recommends" @searchClick="toggleSearchView" />
      <OpLoadingView :loading="pending" type="skeleton">
        <div class="home-page__banner">
          <img v-for="v in data.banner" :key="v.imgUrl" :src="v.imgUrl" alt=" " />
        </div>
        <TheTransformer :data="data.transformer" />
        <ScrollBar :data="data.scrollBarInfoList" />
        <div class="home-page__activity">
          <CountDown :data="data.countdown" />
          <OpSwipe :autoplay="3000" class="home-page__activity__swipe">
            <OpSwipeItem v-for="item in data.activities" :key="item">
              <img :src="item" />
            </OpSwipeItem>
          </OpSwipe>
        </div>
        <VanTabs
          :background="tabBackgroundColor"
          :color="PRIMARY_COLOR"
          offset-top="50px"
          sticky
          @scroll="onTabScroll"
        >
          <VanTab v-for="v in HOME_TABS" :key="v.value" :title="v.title">
            <component :is="v.component"></component>
          </VanTab>
        </VanTabs>
      </OpLoadingView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 动画
// 在 0.5s中  透明度从0到1
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.home-page {
  background: var(--op-gray-bg-color);
  padding-bottom: 70px;

  &__banner {
    img {
      width: 100%;
      padding-top: 10px;
      background: white;
    }
  }

  &__activity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;

    &__swipe {
      border-radius: 8px;
      width: 180px;
      height: 170px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

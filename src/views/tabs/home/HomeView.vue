<script lang="ts" setup>
import TheTop from '@/views/tabs/home/components/TheTop.vue'
import { useToggle } from '@/use/useToggle'
import SearchView from '@/views/search/SearchView.vue'
import { useAsync } from '@/use/useAsync'
import { fetchHomePageData } from '@/api/home'
import type { ICountdown, IHomeInfo } from '@/types'
import OpLoadingView from '@/components/OpLoadingView.vue'
import TheTransformer from '@/views/tabs/home/components/TheTransformer.vue'
import ScrollBar from '@/views/tabs/home/components/ScrollBar.vue'
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
</script>

<template>
  <div class="home-page">
    <Transition name="fade">
      <SearchView v-if="isSearchViewShown" @cancel="toggleSearchView"></SearchView>
    </Transition>
    <TheTop :recommends="recommends" @searchClick="toggleSearchView" />
    <OpLoadingView :loading="pending" type="skeleton">
      <div class="home-page__banner">
        <img v-for="v in data.banner" :key="v.imgUrl" :src="v.imgUrl" alt=" " />
      </div>
      <TheTransformer :data="data.transformer" />
      <ScrollBar :data="data.scrollBarInfoList" />
      <div class="home-page__activity">
        <CountDown :data="data.countdown" />
      </div>
    </OpLoadingView>
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

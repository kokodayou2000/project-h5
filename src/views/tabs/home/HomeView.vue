<script lang="ts" setup>
import TheTop from '@/views/tabs/home/components/TheTop.vue'
import { useToggle } from '@/use/useToggle'
import SearchView from '@/views/search/SearchView.vue'

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
</script>

<template>
  <div class="home-page">
    <Transition name="fade">
      <SearchView v-if="isSearchViewShown" @cancel="toggleSearchView"></SearchView>
    </Transition>
    <TheTop :recommends="recommends" @searchClick="toggleSearchView" />
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
</style>

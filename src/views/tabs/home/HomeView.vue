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
    <SearchView v-if="isSearchViewShown" @cancel="toggleSearchView"></SearchView>
    <TheTop :recommends="recommends" @searchClick="toggleSearchView" />
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import TheTop from '@/views/tabs/home/components/TheTop.vue'

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
</script>

<template>
  <div class="home-page">
    <TheTop :recommends="recommends" />
  </div>
</template>

<style scoped></style>

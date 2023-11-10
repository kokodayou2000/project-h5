<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { fetchTest } from '@/api/test'

// eslint-disable-next-line no-console
fetchTest().then((res) => {
  // eslint-disable-next-line no-console
  console.log(res)
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
@import 'normalize.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  /* 字体抗锯齿 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

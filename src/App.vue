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

<style scoped></style>

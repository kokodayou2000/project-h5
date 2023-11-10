<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 路由实例
const route = useRoute()
const router = useRouter()
const active = ref(route.name as string)

// 当 用户点击的时候，触发 watch事件
// 然后将新的push进路由
watch(active, (newVal) => {
  router.push({
    name: newVal,
  })
})
</script>

<template>
  <RouterView />
  <VanTabbar v-model="active">
    <VanTabbarItem icon="home-o" name="home">首页</VanTabbarItem>
    <VanTabbarItem icon="bars" name="order">订单</VanTabbarItem>
    <VanTabbarItem icon="contact" name="me">我的</VanTabbarItem>
  </VanTabbar>
</template>

<style scoped>
.center {
  text-align: center;
}
</style>

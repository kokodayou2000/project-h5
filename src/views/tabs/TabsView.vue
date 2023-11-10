<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Tabbar, TabbarItem } from 'vant'
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
  <Tabbar v-model="active">
    <TabbarItem icon="home-o" name="home">首页</TabbarItem>
    <TabbarItem icon="bars" name="order">订单</TabbarItem>
    <TabbarItem icon="contact" name="me">我的</TabbarItem>
  </Tabbar>
</template>

<style scoped>
.center {
  text-align: center;
}
</style>

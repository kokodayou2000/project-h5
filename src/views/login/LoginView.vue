<script lang="ts" setup>
import { ref } from 'vue'
import type { ILoginInfo } from '@/types/user'
import { useAuth } from '@/use/useAuth'

const username = ref('')
const password = ref('')

// 回到上一个页面
const onClickLeft = () => history.back()

const { login } = useAuth()

const onSubmit = async (data: ILoginInfo) => {
  await login(data)
  onClickLeft()
}
</script>

<template>
  <div class="login-page op-fullscreen">
    <VanNavBar left-arrow left-text="返回" title="请登录" @click-left="onClickLeft" />
    <VanForm class="login-page__form" @submit="onSubmit">
      <VanCellGroup inset>
        <VanField
          v-model="username"
          :rules="[{ required: true, message: '请填写用户名' }]"
          label="用户名"
          name="username"
          placeholder="用户名"
        />
        <VanField
          v-model="password"
          :rules="[{ required: true, message: '请填写密码' }]"
          label="密码"
          name="password"
          placeholder="密码"
        />
      </VanCellGroup>
      <div style="margin: 16px">
        <VanButton block native-type="submit" round type="primary">提交</VanButton>
      </div>
    </VanForm>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  .login-page__form {
    margin-top: 100px;
  }
}
</style>

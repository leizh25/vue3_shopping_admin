<template>
  <div>
    <h1>我是一级路由-Home展示登录成功以后得数据</h1>
  </div>
</template>
<script setup lang="ts">
//引入组合式API函数之生命周期函数
import { onMounted } from 'vue'
//获取仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
//首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})
</script>
<style scoped></style>

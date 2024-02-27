<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" class="avatar" />
        <div>
          <h3 class="title">{{ getTime() }}好呀{{ userStore.userName }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
//引入组合式API函数之生命周期函数
import { onMounted } from 'vue'
//获取仓库
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
//首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})
</script>
<style scoped lang="scss">
.box {
  display: flex;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .title {
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 20px;
  }

  .subtitle {
    font-style: italic;
    color: skyblue;
  }
}
.bottom {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>

<template>
  <el-button size="small" circle icon="Refresh" @click="updateRefresh"></el-button>
  <el-button size="small" circle icon="FullScreen" @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker size="small" v-model="color" show-alpha :predefine="predefineColors" @change="setColor"></el-color-picker>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" inline-prompt active-icon="Sunny" inactive-icon="Moon" @change="changeTheme" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" circle icon="Setting"></el-button>
    </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.userName }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//过去layout小仓库
import useLayoutSettingStore from '@/store/modules/setting'
//获取用户相关小仓库
import useUserStore from '@/store/modules/user'
//获取路由器对象
const $router = useRouter()
const $route = useRoute()
const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
//颜色组件的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//收集开关数据
let dark = ref<boolean>(false)
//刷新按钮点击的回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
//点击全屏按钮的回调
const fullScreen = () => {
  //DOM对象的一个属性, 可以用来判断当前是不是全屏模式[全屏:true,不是全屏:null]
  let full = document.fullscreenElement
  //切换全屏模式  文档根节点的方法requestFullscreen()实现全屏模式
  if (!full) document.documentElement.requestFullscreen()
  else document.exitFullscreen()
}
//退出登录点击的回调
const logout = async () => {
  //1.向服务器发请求[退出登录接口]
  //2.仓库中关于用户相关的数据清空[token|userName|avatar]
  //3.跳转到登录页面
  await userStore.userLogout()
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
//switch事件暗黑模式切换的回调
const changeTheme = () => {
  //获取HTML根节点
  let root = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? root.classList.remove('dark') : root.classList.add('dark')
}
//主题颜色的设置
const setColor = () => {
  //获取HTML根节点
  let root = document.documentElement
  //设置根节点的背景色
  root.style.setProperty('--el-color-primary', color.value)
}
</script>
<style scoped></style>

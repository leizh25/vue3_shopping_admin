<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Age class="age"></Age>
          <Sex class="sex"></Sex>
        </div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入顶部子组件
import Top from './components/top.vue'
//引入子组件
import Tourist from './components/tourist.vue'
import Age from './components/age.vue'
import Sex from './components/sex.vue'
//获取数据大屏展示内容盒子的DOM元素
const screen = ref<HTMLElement | null>(null)
onMounted(() => {
  screen.value!.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})
//定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return Math.min(ww, wh)
}
//监听视口的变化
window.onresize = () => {
  screen.value!.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background-image: url(./images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .right {
        flex: 1;
      }

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
          background: #0f0;
        }

        .age {
          flex: 1;
          background: #00f;
        }
      }

      .center {
        flex: 2;
      }
    }
  }
}
</style>

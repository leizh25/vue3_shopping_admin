<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="item in people" :key="item" class="people">{{ item }}</span>
    </div>
    <!-- 盒子将来echarts展示图形图表节点 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
let people = ref('216908人')
import * as echarts from 'echarts'
//水球图扩展插件
import 'echarts-liquidfill'
//获取节点
let charts = ref()
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  //设置实例配置对象
  mycharts.setOption({
    // 标题组件
    title: {
      text: '水球图',
    },
    // x|y轴组件
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill', //系列
      data: [0.6, 0.4, 0.2], //展示的数据
      waveAnimation: true, //动画
      animationDuration: 3, //动画时间
      animationDurationUpdate: 0, //
      radius: '100%', //半径
    },
    //布局组件
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>
<style lang="scss" scoped>
.box {
  background: url(../images/dataScreen-main-lb.png) no-repeat;
  background-size: cover;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: #fff;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../images/dataScreen-title.png) no-repeat;
      background-size: cover;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: #fff;

      // font-size: 18px;
      span {
        color: yellowgreen;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../images/total.png) no-repeat;
      background-size: cover;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
    background: #f00;
  }
}
</style>

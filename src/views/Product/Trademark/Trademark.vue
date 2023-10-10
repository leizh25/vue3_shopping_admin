<template>
  <el-card class="box-card">
    <!-- 卡片顶部的添加品牌按钮 -->
    <el-button type="primary" icon="plus">添加品牌</el-button>
    <!-- 表格组件: 用于展示已有的品牌数据 -->
    <!-- 
      table
          boder 设置表格纵向是否有边框
      table-column
          label:列标题
          width:设置列宽度
          align:设置这一列的对齐方式,默认left
     -->
    <el-table style="margin: 10px 0" border :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <!-- table-column:默认展示数据用的是div -->
      <el-table-column label="品牌名称">
        <template #default="{ row }">
          <pre style="color: brown">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌logo">
        <template #default="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default>
          <el-button type="primary" size="small" icon="edit"></el-button>
          <el-button type="primary" size="small" icon="delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器组件 pagination :
        v-model:current-page="" :设置分页器当前页码
        v-model:page-size="": 设置每一页展示数据的条数
        page-sizes: 下拉菜单的数据
        small: 是否使用小型分页样式,默认false
        background:是否分页器设置背景颜色
        layout:设置分页器6个子组件的布局调整
     -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
  </el-card>
</template>
<script setup lang="ts">
//引入组合式API函数ref
import { onMounted, ref } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TrademarkResponseData } from '@/api/product/trademark/type'
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌的数据的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//获取已有品牌的接口封装为一个函数,再任何的情况下获取数据,调用此函数即可
const getHasTrademark = async () => {
  const res: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  // console.log('res: ', res.data)
  if (res.code == 200) {
    //存储已有品牌的数量
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}
onMounted(() => getHasTrademark())
</script>
<style scoped></style>

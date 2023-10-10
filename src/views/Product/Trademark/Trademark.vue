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
    <el-table style="margin: 10px 0" border>
      <el-table-column label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="品牌名称"></el-table-column>
      <el-table-column label="品牌logo"></el-table-column>
      <el-table-column label="操作"></el-table-column>
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
      :total="400"
    />
  </el-card>
</template>
<script setup lang="ts">
//引入组合式API函数ref
import { ref } from 'vue'
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//
</script>
<style scoped></style>

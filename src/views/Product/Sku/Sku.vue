<template>
  <el-card>
    <el-table border style="margin: 10px 0">
      <el-table-column lable="序号" type="index" width="80px"></el-table-column>
      <el-table-column lable="名称" show-overflow-tooltip width="200px"></el-table-column>
      <el-table-column lable="描述" show-overflow-tooltip width="200px"></el-table-column>
      <el-table-column lable="图片" width="200px"></el-table-column>
      <el-table-column lable="重量" width="200px"></el-table-column>
      <el-table-column lable="价格" width="200px"></el-table-column>
      <el-table-column lable="操作" width="250px" fixed="right"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="PageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      :total="400"
      layout="prev,pager,next,jumper,->,sizes,total"
    ></el-pagination>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

//分页器当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let PageSize = ref<number>(10)
</script>
<style scoped></style>

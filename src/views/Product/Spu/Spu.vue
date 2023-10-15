<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="plus">添加SPU</el-button>
      <el-table style="margin: 10px 0" border align="center" width="100px">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,-> ,size,total"
        :total="400"
      />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
//场景值
const scene = ref<number>(0)
//分页器默认页码
let pageNo = ref<number>(1)
//每页展示几条数据
let pageSize = ref<number>(3)
</script>
<style scoped></style>

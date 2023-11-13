<template>
  <div>
    <el-card style="height: 70px; margin: 10px 0">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="输入职位关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" icon="plus">添加职位</el-button>
      <el-table border style="margin: 10px 0">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="ID"></el-table-column>
        <el-table-column align="center" label="职位名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="职位名称"></el-table-column>
        <el-table-column align="center" label="操作" width="260"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total "
        :total="400"
      />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
//当前页码
const pageNo = ref<number>(1)
//一页展示几条数据
const pageSize = ref<number>(10)
</script>
<style scoped>
.form {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

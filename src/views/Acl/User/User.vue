<template>
  <div>
    <el-card style="height: 70px; margin: 10px 0">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="输入用户名进行搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary">添加用户</el-button>
      <el-button type="danger">批量删除</el-button>
      <!-- 表格展示用户信息 -->
      <el-table style="margin: 10px 0" border>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="ID" align="center"></el-table-column>
        <el-table-column label="用户名" align="center"></el-table-column>
        <el-table-column label="用户昵称" align="center"></el-table-column>
        <el-table-column label="用户角色" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center"></el-table-column>
        <el-table-column label="更新时间" align="center"></el-table-column>
        <el-table-column label="操作" width="260px" align="center"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="400"
        :background="true"
        :page-sizes="[5, 7, 9, 11]"
        layout="prev, pager, next, jumper, ->, sizes, total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

//默认第一页
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <div>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="date" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" :disabled="row.level === 4">添加{{ row.level === 3 ? '功能' : '菜单' }}</el-button>
          <el-button type="primary" size="small" :disabled="row.level === 1">编辑</el-button>
          <el-button type="primary" size="small" :disabled="row.level === 1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
//引入获取菜单请求API
import { reqAllPermission } from "@/api/acl/menu"
//引入ts类型
import type { PermissionResponse, Permission } from "@/api/acl/menu/type"
let permissionArr = ref<Permission[]>([])
onMounted(() => {
  getHasPermission()
})
//获取菜单数据的方法
const getHasPermission = async () => {
  const res: PermissionResponse = await reqAllPermission()
  if (res.code === 200) {
    permissionArr.value = res.data
  }
}
</script>
<style scoped></style>

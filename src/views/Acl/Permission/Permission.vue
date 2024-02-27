<template>
  <div>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="date" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" :disabled="row.level === 4" @click="addPermission(row)">
            添加{{ row.level === 3 ? '功能' : '菜单' }}
          </el-button>
          <el-button type="primary" size="small" :disabled="row.level === 1" @click="updatePermission(row)">编辑</el-button>
          <el-popconfirm width="200" :title="`确定要删除${row.name}吗？`" @confirm="deletePermission(row.id)">
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level === 1">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件:添加或更新已有的菜单的数据 -->
    <el-dialog v-model="dialogVisible" :title="`${menuData.id ? '编辑' : '添加'}菜单`">
      <!-- 表单组件:将来用于收集新增与已有的菜单数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
//引入获取菜单请求API
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
//引入ts类型
import type { PermissionResponse, Permission, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
let permissionArr = ref<Permission[]>([])
//控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
//携带的参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
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
//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  //收集新增的菜单的level数值
  menuData.level = row.level + 1
  //给谁新增子菜单
  menuData.pid = row.id as number
}
//更新已有菜单的回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  //点击修改按钮:收集已有的菜单数据进行更新
  Object.assign(menuData, row)
}
//确定按钮回调
const save = async () => {
  //发请求:更新子菜单或更新一个已有菜单的数据
  const res: any = await reqAddOrUpdateMenu(menuData)
  if (res.code === 200) {
    //对话框隐藏
    dialogVisible.value = false
    //提示信息
    ElMessage.success(menuData.id ? '更新成功' : '添加成功')
    //再次获取数据
    getHasPermission()
  }
}
//删除按钮的回调
const deletePermission = async (id: number) => {
  const res: any = await reqRemoveMenu(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getHasPermission()
  }
}
</script>
<style scoped></style>

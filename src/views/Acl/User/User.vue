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
      <el-table style="margin: 10px 0" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户昵称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="270px" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="user">分配角色</el-button>
            <el-button type="primary" size="small" icon="edit">编辑</el-button>
            <el-button type="danger" size="small" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="total"
        :background="true"
        :page-sizes="[5, 7, 9, 11]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @current-change="getHasUsers"
        @size-change="sizeChangeHandle"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqUserList } from '@/api/acl/user/index.ts'
import { UserResponseData, Records } from '@/api/acl/user/type'
//默认第一页
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])

//获取全部已有的账号信息
const getHasUsers = async (page = 1) => {
  //收集当前页码
  pageNo.value = page
  const res: UserResponseData = await reqUserList(pageNo.value, pageSize.value)
  console.log('res: ', res)
  //存储数据
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}
//组件挂载完毕
onMounted(() => {
  getHasUsers()
})
//分页器下拉菜单自定义事件回调
const sizeChangeHandle = () => {
  getHasUsers()
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

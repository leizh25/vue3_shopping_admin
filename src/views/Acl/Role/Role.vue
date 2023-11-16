<template>
  <div>
    <el-card style="height: 70px; margin: 10px 0">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="输入职位关键字" v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyWord.trim() === ''" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" icon="plus">添加职位</el-button>
      <el-table border style="margin: 10px 0" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="职位名称" show-overflow-tooltip prop="roleName"></el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" label="更新时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template #default>
            <el-button size="small" icon="user" type="primary">分配权限</el-button>
            <el-button size="small" icon="edit" type="warning">编辑</el-button>
            <el-button size="small" icon="delete" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total "
        :total="total"
        @current-change="getHasRole"
        @size-change="sizeChangeHandle"
      />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqAllRoleList } from '@/api/acl/role'
import { Records, RoleResponseData } from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
//当前页码
const pageNo = ref<number>(1)
//一页展示几条数据
const pageSize = ref<number>(10)
//搜索职位关键字
let keyWord = ref<string>('')
//存储全部职位
let allRole = ref<Records[]>([])
//职位总数量
let total = ref<number>(0)
//组件挂载完毕
onMounted(() => {
  // 加载数据
  getHasRole()
})
//获取职位的请求  分页器页码发生变化的回调
const getHasRole = async (page = 1) => {
  pageNo.value = page
  const res: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyWord.value)
  // console.log('res: ', res)
  if (res.code === 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}
//页码下拉框改变时触发的回调
const sizeChangeHandle = () => {
  getHasRole()
}
//搜索按钮回调
const search = () => {
  getHasRole()
}
//重置按钮回调
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
</script>
<style scoped>
.form {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

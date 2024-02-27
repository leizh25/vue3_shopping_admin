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
      <el-button type="primary" icon="plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 10px 0" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="职位名称" show-overflow-tooltip prop="roleName"></el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" label="更新时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template #default="{ row }">
            <el-button size="small" icon="user" type="primary" @click="setPermission(row)">分配权限</el-button>
            <el-button size="small" icon="edit" type="warning" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除 ${row.roleName} 职位吗？`" width="260" @confirm="deleteRole(row.id)">
              <template #reference>
                <el-button size="small" icon="delete" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
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
    <!-- 添加职位与更新职位的对话框弹窗 -->
    <el-dialog v-model="isSHowDialog" :title="`${RoleParams.id ? '更新' : '添加'}角色`">
      <el-form :model="RoleParams" :rules="rules" ref="roleNameFormRef">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="输入职位名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isSHowDialog = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件  分配角色的菜单权限与按钮权限 -->
    <el-drawer v-model="isShowDrawer" direction="rtl">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr" :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="isShowDrawer = false">取消</el-button>
          <el-button type="primary" @click="savePermission">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role'
import { Records, RoleResponseData, MenuDataResponse, MenuList, MenuData } from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { RoleData } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
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
//对话框的显示与隐藏
let isSHowDialog = ref<boolean>(false)
//收集新增岗位的数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})
//职位表单组件
const roleNameFormRef = ref<any>()
//控制抽屉组件的显示与隐藏
let isShowDrawer = ref<boolean>(false)
//树形控件的展示数据
const defaultProps = {
  children: 'children',
  label: 'name',
}
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
//准备一个数组:数组用于存储勾选的节点ID(四级)
let selectArr = ref<number[]>([])
//获取属性控件组件
let tree = ref<any>()
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
//添加职位按钮回调
const addRole = () => {
  isSHowDialog.value = true
  //清空表单数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  //清空上一次表单校验的结果
  nextTick(() => roleNameFormRef.value.clearValidate())
}
//更新职位按钮回调
const updateRole = (role: RoleData) => {
  isSHowDialog.value = true
  // console.log('role: ', role)
  //存储职位 -- 带有ID
  Object.assign(RoleParams, role)
  //清空上一次校验的结果
  nextTick(() => roleNameFormRef.value.clearValidate())
}
//自定义校验规则
const validateRoleName = (_rule: any, value: string, callback: any) => {
  if (value.trim().length < 2) {
    callback(new Error('职位名称至少两位字符'))
  } else {
    callback()
  }
}
//职位表单校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }],
}
//职位表单确定按钮的回调
const save = async () => {
  //表单校验,结果通过发请求,未通过不该发请求
  await roleNameFormRef.value.validate()
  //添加/更新职位的请求
  const res = await reqAddOrUpdateRole(RoleParams)
  // console.log('res: ', res)
  if (res.code === 200) {
    ElMessage.success(`${RoleParams.id ? '更新' : '添加'}职位成功`)
    isSHowDialog.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error(res.message)
  }
}
//分配权限按钮回调
const setPermission = async (role: RoleData) => {
  isShowDrawer.value = true
  // console.log('role: ', role)
  //收集当前要分配权限的职位数据
  Object.assign(RoleParams, role)
  //根据职位获取权限数据
  const res: MenuDataResponse = await reqAllMenuList(role.id as number)
  // console.log('res: ', res)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: MenuList, initArr: any) => {
  allData.forEach((item: MenuData) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length >= 1) filterSelectArr(item.children, initArr)
  })
  return initArr
}
//抽屉确定按钮的回调
const savePermission = async () => {
  //职位的ID
  const roleId = RoleParams.id as number
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  let res: any = await reqSetPermission(roleId, arr.concat(arr1))
  if (res.code === 200) {
    //提示信息
    ElMessage.success('分配权限成功')
    //关闭抽屉
    isShowDrawer.value = false
    // 刷新页面(更新实时数据)
    window.location.reload()
  } else {
    ElMessage.error(res.message)
  }
}
//删除已有的职位
const deleteRole = async (roleId: number) => {
  const res = await reqRemoveRole(roleId)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getHasRole(allRole.value.length > 1 ? pageNo.value : 1)
  } else {
    ElMessage.error(res.message)
  }
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

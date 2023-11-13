<template>
  <div>
    <el-card style="height: 70px; margin: 10px 0">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="输入用户名进行搜索" v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyWord.trim() === ''" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="danger" :disabled="selectIdArr.length === 0" @click="deleteSelectUser">批量删除</el-button>
      <!-- 表格展示用户信息 -->
      <el-table style="margin: 10px 0" border :data="userArr" @selection-change="selectChange">
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
            <el-button type="primary" size="small" icon="user" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" size="small" icon="edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}吗?`" width="200" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="delete">删除</el-button>
              </template>
            </el-popconfirm>
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
    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="isShowDrawer" direction="rtl">
      <!-- 头部标题:文字标题应该是动态的 -->
      <template #header>
        <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名:" prop="username">
            <el-input placeholder="请输入姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop="name">
            <el-input placeholder="请输入昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" prop="password" v-if="userParams.id">
            <el-input placeholder="请输入密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构: 用于分配角色 -->
    <el-drawer v-model="isShowDrawer2">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group v-model="userRole" @change="handleCheckedRolesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="isShowDrawer2 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqUserList, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqDeleteSelectUser } from '@/api/acl/user/index.ts'
import { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData, RoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'
//默认第一页
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let isShowDrawer = ref<boolean>(false)
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
//获取表单组件实例
const formRef = ref<any>(null)
//控制抽屉2(分配角色的抽屉)的显示与隐藏
let isShowDrawer2 = ref<boolean>(false)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([])
//准备数组存储批量选中的用户ID
let selectIdArr = ref<User[]>([])
//收集用户输入进来的关键字
let keyWord = ref<string>('')
// 获取模板setting仓库
const layoutSettingStore = useLayoutSettingStore()
//获取全部已有的账号信息
const getHasUsers = async (page = 1) => {
  //收集当前页码
  pageNo.value = page
  const res: UserResponseData = await reqUserList(pageNo.value, pageSize.value, keyWord.value)
  // console.log('res: ', res)
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
//添加用户按钮回调
const addUser = () => {
  //显示抽屉
  isShowDrawer.value = true
  //清空数据
  Object.assign(userParams, {
    username: '',
    name: '',
    password: '',
    id: 0,
  })
  //清除上一次表单验证错误信息   因为第一次点击的时候,表单组件还没有渲染完成,所以需要等到渲染完成之后再去清除验证错误信息, 以免报错
  // 办法一   使用nextTick
  nextTick(() => {
    formRef.value.clearValidate()
  })
  //办法二  使用?.语法
  // formRef.value?.clearValidate()
}
//更新用户按钮回调
const updateUser = (user: User) => {
  //显示抽屉
  isShowDrawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, user)
  //清空之前的校验信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//抽屉保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部符合条件再去发送请求
  await formRef.value.validate()

  // console.log('userParams: ', userParams)
  //点击保存按钮:可能是添加新的用户,或者是更新已有的用户
  const res: any = await reqAddOrUpdateUser(userParams)
  // console.log('res: ', res)
  // 添加或者更新成功
  if (res.code === 200) {
    //关闭抽屉
    isShowDrawer.value = false
    //提示成功
    ElMessage.success(`${userParams.id ? '更新' : '添加'}成功`)
    //重新获取用户列表
    // getHasUsers(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新页面
    window.location.reload()
  } else {
    ElMessage.error(`${userParams.id ? '更新' : '添加'}失败`)
  }
}
//取消按钮的回调
const cancel = () => {
  //关闭抽屉
  isShowDrawer.value = false
}

//校验用户名的回调函数
const validateUsername = (_rule: any, value: any, callback: any) => {
  // console.log(value)
  // 用户名字或昵称,长度至少是5位
  if (value.trim().length > 5) callback()
  else callback(new Error('用户名长度至少是5位'))
}
//校验昵称的回调函数
const validateName = (_rule: any, value: any, callback: any) => {
  // console.log(value)
  // 用户名字或昵称,长度至少是5位
  if (value.trim().length > 5) callback()
  else callback(new Error('用户昵称长度至少是5位'))
}
//校验密码的回调函数
const validatePassword = (_rule: any, value: any, callback: any) => {
  // console.log(value)
  // 用户名字或昵称,长度至少是5位
  if (value.trim().length > 6) callback()
  else callback(new Error('用户昵称长度至少是6位'))
}
//表单校验规则对象
const rules = {
  //用户名
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  //用户名
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  //密码
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
}
//分配角色按钮的回调
const setRole = async (user: User) => {
  // console.log('user: ', user)

  //存储已有的用户信息
  Object.assign(userParams, user)
  //发请求获取全部职位与当前用户已有的职位数据
  const res: AllRoleResponseData = await reqAllRole(userParams.id as number)
  // console.log('res: ', res)
  if (res.code === 200) {
    //存储全部职位
    allRole.value = res.data.allRolesList
    //存储当前用户已有的职位
    userRole.value = res.data.assignRoles
    //显示抽屉2
    isShowDrawer2.value = true
  }
}
//收集顶部复选框全选的数据
let checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(false)
//顶部全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  //val: true 代表全选,false代表未全选
  // console.log(val)
  userRole.value = val ? allRole.value : []
  //不确定的样式
  isIndeterminate.value = false
}
//底部全部的复选框的change事件
const handleCheckedRolesChange = (value: string[]) => {
  // console.log(value)
  //勾选上的项目个数与全部的职位的个数相等,顶部的全选复选框也要勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length > 0 && value.length < allRole.value.length
}
//分配角色确认按钮的回调
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item: RoleData) => item.id),
  }
  //发请求分配用户职位
  const res: any = await reqSetUserRole(data)
  // console.log('res: ', res)
  if (res.code === 200) {
    //提示
    ElMessage.success('分配职务成功')
    //关闭抽屉2
    isShowDrawer2.value = false
    //获取更新完毕用户的信息, 更新完毕留在当前页面
    getHasUsers(pageNo.value)
  }
}
//删除某一个账户
const deleteUser = async (userId: number) => {
  const res: any = await reqRemoveUser(userId)
  // console.log('res: ', res)
  if (res.code === 200) {
    //提示
    ElMessage.success('删除成功')
    //刷新用户信息
    getHasUsers(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
//table复选框勾选的时候触发的事件
const selectChange = (value: any) => {
  // console.log(value)
  selectIdArr.value = value
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idList: number[] = selectIdArr.value.map((item: User) => item.id as number)
  // console.log('idList: ', idList)
  const res: any = await reqDeleteSelectUser(idList)
  // console.log('res: ', res)
  if (res.code === 200) {
    //提示
    ElMessage.success('批量删除成功')
    //刷新用户信息
    getHasUsers(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('批量删除失败')
  }
}
//搜索按钮回调
const search = async () => {
  //根据关键字获取相应的用户数据
  getHasUsers()
  keyWord.value = ''
}
//重置按钮回调
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

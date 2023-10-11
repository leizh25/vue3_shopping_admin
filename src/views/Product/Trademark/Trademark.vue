<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部的添加品牌按钮 -->
      <el-button type="primary" icon="plus" @click="addTrademark">添加品牌</el-button>
      <!-- 表格组件: 用于展示已有的品牌数据 -->
      <!-- 
      table
          boder 设置表格纵向是否有边框
      table-column
          label:列标题
          width:设置列宽度
          align:设置这一列的对齐方式,默认left
     -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!-- table-column:默认展示数据用的是div -->
        <el-table-column label="品牌名称">
          <template #default="{ row }">
            <pre style="color: brown">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template #default="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="warning" size="small" icon="edit" @click="updateTrademark(row)"></el-button>
            <el-button type="danger" size="small" icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
      分页器组件 pagination :
        v-model:current-page="" :设置分页器当前页码
        v-model:page-size="": 设置每一页展示数据的条数
        page-sizes: 下拉菜单的数据
        small: 是否使用小型分页样式,默认false
        background:是否分页器设置背景颜色
        layout:设置分页器6个子组件的布局调整
     -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 对话框组件:在添加品牌与修改已有品牌的业务时候使用结构 -->
    <!-- 
    v-model:属性用户控制对话框的显示与隐藏  true显示  false隐藏
    title:对话框左上角的标题
   -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" required label-width="100px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
          upload组件相应属性
            action:	图片上传路径/api,代理服务器不发送此次post请求
        -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
//引入组合式API函数ref
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark } from '@/api/product/trademark'
import type { Records, TrademarkResponseData, Trademark } from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌的数据的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//定义一个收集新增品牌的数据
let trademarkParams = reactive<Trademark>({
  logoUrl: '',
  tmName: '',
})
//获取el-form组件实例
const formRef = ref()
//获取已有品牌的接口封装为一个函数,再任何的情况下获取数据,调用此函数即可
const getHasTrademark = async (page = 1) => {
  pageNo.value = page
  const res: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  // console.log('res: ', res.data)
  if (res.code == 200) {
    //存储已有品牌的数量
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}
// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//组件挂载完毕发一次请求, 获取第一页三个已有品牌的数据
onMounted(() => getHasTrademark())

//分页器页码发生变化的回调
//对于当前页码发生变化自定义事件,组件pagination父组件回传了数据(当前的页码)
// const changePageNo = (a) => {
//   //当前页码发生变化时再次发送请求获取对应已有品牌的数据展示
//   getHasTrademark()
//   console.log(a)
// }

//当下拉菜单发生变化的时候触发此函数
//这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  //当前每一页的数据量发生变化的时候,当前页码归一
  getHasTrademark()
}
//添加品牌按钮的回调
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true
  //清空收集数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //清除之前的表单校验结果
  //因为第一次点击添加按钮时,el-form组件还没有创建，所以不能调用clearValidate方法
  //第二次点击点击添加时,el-form其实只是隐藏,ref可以获取到el-form组件实例
  //第①种写法: TS的?写法
  // formRef.value?.clearValidate()
  //第②种写法
  nextTick(() => formRef.value.clearValidate())
}
//修改品牌按钮的回调
//row作用域插槽回传的那一行的数据
const updateTrademark = (row: Trademark) => {
  //清除之前的表单校验结果
  nextTick(() => formRef.value.clearValidate())
  // console.log('row: ', row)
  //对话框显示
  dialogFormVisible.value = true
  //ES6语法合并对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // //展示已有品牌的数据
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.tmName = row.tmName
}
//对话框取消按钮的回调
const cancel = () => {
  //对话框取消
  dialogFormVisible.value = false
}
const confirm = async () => {
  //再发请求之前要对于整个表单进行校验
  //调用这个方法进行全部的表单项校验, 如果校验全部通过, 再执行后面的语句
  await formRef.value.validate()

  let res: any = await reqAddOrUpdateTrademark(trademarkParams)
  // console.log('res: ', res)
  //添加或修改已有品牌
  if (res.code == 200) {
    //添加品牌成功
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage({ type: 'success', message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功' })
    //再次发请求获取已有全部品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    //添加品牌失败
    ElMessage({ type: 'error', message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败' })
    dialogFormVisible.value = false
  }
}

//上传图片组件 -> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //在图片上传成功之前触发, 在上传文件之前可以约束文件的类型和大小
  //要求:上传文件格式 png|jpg|webp|gif  4M
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif' || rawFile.type == 'image/webp') {
    if (rawFile.size / 1024 / 1024 < 4) return true
    else {
      ElMessage({ type: 'error', message: '上传文件的大小应小于4M' })
    }
  } else {
    ElMessage({ type: 'error', message: '上传图片的格式必须是png,jpg,webp,gif' })
    return false
  }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //response 这次上传图片post请求服务器返回的数据
  //uploadFile
  //收集上传图片的地址,添加一个新的品牌带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

//品牌自定义校验规则的方法
const validateTmName = (_rule: any, value: any, callback: any) => {
  //是当表单元素触发blur的时候会触发此方法
  // console.log('rule: ', rule)

  //自定义校验规则
  if (value.trim().length >= 2) callback()
  //校验未通过返回的错误的提示信息
  else callback(new Error('品牌名称字符长度大于等于两位'))
}
//品牌logo图片的自定义校验规则方法
const validateLogoUrl = (_rule: any, value: any, callback: any) => {
  //如果图片上传了,那么value(图片的地址)即有值
  if (value) callback()
  else callback(new Error('logo的图片务必上传'))
}
//表单校验规则对象
const rules = {
  //required:这个字段务必要校验,表单项前面出现一个五角星
  //trigger:触发校验规则的时机 blur:失去焦点时  change:输入时
  tmName: [{ required: true, trigger: 'blur', validator: validateTmName }],
  logoUrl: [{ required: true, validator: validateLogoUrl }],
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

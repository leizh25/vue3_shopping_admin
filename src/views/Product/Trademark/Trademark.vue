<template>
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
        <template #default>
          <el-button type="primary" size="small" icon="edit" @click="updateTrademark"></el-button>
          <el-button type="primary" size="small" icon="delete"></el-button>
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
  <el-dialog v-model="dialogFormVisible" title="添加品牌">
    <el-form style="width: 80%">
      <el-form-item label="品牌名称" required label-width="80px">
        <el-input placeholder="请您输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="80px">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
</template>
<script setup lang="ts">
//引入组合式API函数ref
import { onMounted, ref } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TrademarkResponseData } from '@/api/product/trademark/type'
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌的数据的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
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
let dialogFormVisible = ref<boolean>(true)
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
}
//修改品牌按钮的回调
const updateTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true
}
//对话框取消按钮的回调
const cancel = () => {
  //对话框取消
  dialogFormVisible.value = false
}
const confirm = () => {
  dialogFormVisible.value = false
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

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

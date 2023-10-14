<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button type="primary" icon="plus" :disabled="!categoryStore.c3Id" @click="addAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default>
              <!-- row:已有的属性对象 -->
              <el-button type="primary" size="small" icon="edit" @click="updateAttr"></el-button>
              <el-button type="danger" size="small" icon="delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加与修改属性的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性的名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="plus">添加属性值</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0">
          <el-table-column width="80" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="属性值名称"></el-table-column>
          <el-table-column label="属性值操作"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive } from 'vue'
//引入获取已有属性与属性值的接口
import { reqAttr } from '@/api/product/attr'
//获取分类的仓库
import useCategoryStore from '@/store/modules/category'
//引入类型
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
//获取仓库对象
const categoryStore = useCategoryStore()
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
//定义卡片组件内容切换的变量
let scene = ref<number>(0) //scene=0显示table, scene=1,展示添加与修改属性结构
//收集新增属性的数组
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性名字
  attrValueList: [],
  categoryId: '', //对应的三级分类的ID
  categoryLevel: 3, //对应的几级分类
})
//监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  async () => {
    //清空上一次查询的属性与属性值
    attrArr.value = []
    //保证三级分类有值才能发请求 (由于切换一级或二级分类会清空三级分类的数据,导致触发监听事件)
    //获取分类的属性
    categoryStore.c3Id && getAttr()
  },
)
//获取已有属性值与属性值的方法
const getAttr = async () => {
  //获取分类的ID
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取已有属性值与属性值
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  // console.log('res: ', res)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}
//添加属性按钮的回调
const addAttr = () => {
  //切换到添加与修改属性的机构
  scene.value = 1
}
//table表格中修改已有属性按钮的回调
const updateAttr = () => {
  scene.value = 1
}

//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
</script>
<style scoped></style>

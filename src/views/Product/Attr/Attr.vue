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
            <el-input v-model="attrParams.attrName" placeholder="请你输入属性的名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="plus" :disabled="!attrParams.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column width="80" type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row即为当前的属性值对象 -->
            <template #default="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ row, $index }">
              <el-button type="danger" size="small" icon="delete" @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="!attrParams.attrValueList.length">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive, nextTick } from 'vue'
//引入获取已有属性与属性值的接口
import { reqAddOrUpdateAttr, reqAttr } from '@/api/product/attr'
//获取分类的仓库
import useCategoryStore from '@/store/modules/category'
//引入类型
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
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
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([])
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
  //每一次点击的时候,先清空一下数据  Object.assign() ES6新增语法,合并对象作用
  Object.assign(attrParams, {
    attrName: '', //新增的属性名字
    attrValueList: [],
    categoryId: categoryStore.c3Id, //收集对应的三级分类的ID
    categoryLevel: 3, //对应的几级分类
  })
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
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值的编辑模式的切换
  })
  //获取最后的el-input,让他聚焦
  nextTick(() => inputArr.value[attrParams.attrValueList.length - 1].focus())
}
//保存按钮的回调
const save = async () => {
  //发请求
  const res: any = await reqAddOrUpdateAttr(attrParams)
  //添加属性|修改属性已经成功
  if (res.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({ type: 'success', message: attrParams.id ? '修改成功' : '添加成功' })
    //获取全部已有属性与属性值
    getAttr()
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}
//属性值表单元素失去焦点的事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况的判断
  if (row.valueName.trim() == '') {
    ElMessage.error('属性值不能为空')
    //删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    return
  }
  //非法情况二:
  let repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失去焦点属性值对象从当前数组返回出去判断
    //item != row 就是排除当前行,和别的行进行比较
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //删除当前重复的属性值
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage.error('属性值不能重复')
    return
  }
  //相应的属性值对象flag:变为false,展示div
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  //对应的属性值对象flag:变为true,展示input
  row.flag = true
  //nextTick:响应式数据发生变化,获取更新后的DOM或组件实例
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
</script>
<style scoped></style>

<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category></Category>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="plus" :disabled="!categoryStore.c3Id">添加属性</el-button>
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
            <el-button type="primary" size="small" icon="edit"></el-button>
            <el-button type="danger" size="small" icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import { watch, ref } from 'vue'
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
</script>
<style scoped></style>

<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler1" :disabled="scene == 1">
          <!-- label即为展示的数据,展示的数据不可以用插值语法写在标签内,否则change事件触发时,标签内显示的就是ID  value即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :value="c1.id" :label="c1.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler2" :disabled="scene == 1">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :value="c2.id" :label="c2.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" v-model="categoryStore.c3Id">
        <el-select v-model="categoryStore.c3Id" :disabled="scene == 1">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :value="c3.id" :label="c3.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
//引入声明周期钩子
import { onMounted } from 'vue'
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
//全局组件挂载完毕通知仓库发请求获取一斤分类的数据
onMounted(() => {
  getC1()
})
//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

//一级分类下拉菜单的change时间(选中值的时候会触发)
const handler1 = () => {
  //需要将二级,三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c2Arr = []
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  //通知仓库获取二级分类数据
  categoryStore.getC2()
}
//二级下拉菜单change事件
const handler2 = () => {
  //需要将三级分类的数据清空
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC3()
}

//接收父组件传过来的场景值
defineProps(['scene'])
</script>
<style scoped></style>

<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id">
          <!-- label即为展示的数据,也可以写在标签内  value即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :value="c1.id">{{ c1.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option value="1">北京</el-option>
          <el-option value="12">上海</el-option>
          <el-option value="13">广州</el-option>
          <el-option value="14">深圳</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option value="1">北京</el-option>
          <el-option value="12">上海</el-option>
          <el-option value="13">广州</el-option>
          <el-option value="14">深圳</el-option>
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
</script>
<style scoped></style>

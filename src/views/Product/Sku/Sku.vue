<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column lable="序号" type="index" width="80px"></el-table-column>
      <el-table-column lable="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
      <el-table-column lable="描述" show-overflow-tooltip width="200px" prop="skuDesc"></el-table-column>
      <el-table-column lable="图片" width="200px">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column lable="重量" width="200px" prop="weight"></el-table-column>
      <el-table-column lable="价格" width="200px" prop="price"></el-table-column>
      <el-table-column lable="操作" width="250px" fixed="right">
        <template #default>
          <el-button type="primary" size="small" icon="top"></el-button>
          <el-button type="warning" size="small" icon="edit"></el-button>
          <el-button type="info" size="small" icon="infoFilled"></el-button>
          <el-button type="danger" size="small" icon="delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      :total="total"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getHasSku"
      @size-change="handler"
    ></el-pagination>
  </el-card>
</template>
<script setup lang="ts">
//引入请求
import { reqSkuList } from '@/api/product/sku'
import { onMounted, reactive, ref } from 'vue'
//引入类型
import { SkuData, SkuResponseData } from '@/api/product/sku/type'
//分页器当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let pageSize = ref<number>(10)
//总共多少条数据
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
//组件挂载完毕
onMounted(() => {
  //请求数据
  getHasSku()
})
const getHasSku = async (page = 1) => {
  //当前分页器的页码
  pageNo.value = page

  const res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  // console.log('res: ', res)
  if (res.code === 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}
//分页器下拉菜单发生变化触发
const handler = (ps: number) => {
  pageSize.value = ps
  getHasSku()
}
</script>
<style scoped></style>

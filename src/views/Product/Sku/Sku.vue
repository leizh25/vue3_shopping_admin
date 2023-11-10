<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="250px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="250px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px" align="center">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="200px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="200px" prop="price"></el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template #default="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'info' : 'primary'"
            size="small"
            :icon="row.isSale == 1 ? 'bottom' : 'top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button type="warning" size="small" icon="edit" @click="ElMessage.info('程序员正在努力更新中...')"></el-button>
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
import { onMounted, ref } from 'vue'
//引入请求
import { reqSkuList, reqCancelSale, reqSaleSku } from '@/api/product/sku'
//引入类型
import { SkuData, SkuResponseData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
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
//商品的上架与下架的操作
const updateSale = async (sku: SkuData) => {
  //如果当前商品的isSale == 1 ,说明当前是上架的状态,需要发请求更新为下架
  //否则else的情况与上面相反
  if (sku.isSale === 1) {
    //下架操作
    await reqCancelSale(sku.id as number)
    ElMessage.success('下架成功')
    //发请求获取当前更新完毕的全部数据
    getHasSku(pageNo.value)
  } else {
    //上架操作
    await reqSaleSku(sku.id as number)
    ElMessage.success('上架成功')
    //发请求获取当前更新完毕的全部数据
    getHasSku(pageNo.value)
  }
}
</script>
<style scoped></style>

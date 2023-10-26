<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input placeholder="重量(g)"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="sku描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline="true" label-width="100px">
          <el-form-item :label="attr.attrName" v-for="attr in attrArr" :key="attr.id">
            <el-select>
              <el-option :label="attrValue.valueName" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline="true" label-width="100px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleArr" :key="saleAttr.id">
            <el-select>
              <el-option :label="attrValue.saleAttrValueName" v-for="attrValue in saleAttr.spuSaleAttrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr">
          <el-table-column type="selection" width="80px" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { SaleAttr, SaleAttrResponseData, SpuData, SpuHasImg, SpuImg } from '@/api/product/spu/type'
import { AttrList, AttrResponseData } from '@/api/product/attr/type'
//引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import { ref } from 'vue'

//平台属性
const attrArr = ref<AttrList>([])
//销售属性
const saleArr = ref<SaleAttr[]>([])
//照片墙
const imgArr = ref<SpuImg[]>()
//自定义事件的方法
const $emit = defineEmits(['changeScene'])
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
//对外暴露的初始化数据的方法
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
  //获取平台属性
  const res1: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  // console.log('res1: ', res1)
  attrArr.value = res1.data
  //获取Spu照片墙数据
  const res2: SpuHasImg = await reqSpuImageList(spu.id as number)
  // console.log('res2: ', res2)
  imgArr.value = res2.data
  //获取销售属性
  const res3: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // console.log('res3: ', res3)
  saleArr.value = res3.data
}
//当前子组件对外暴露方法
defineExpose({ initSkuData })
</script>
<style scoped></style>

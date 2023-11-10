<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称" v-model="skuParams.skuNmae"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input placeholder="重量(g)" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="sku描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="attr.attrName" v-for="attr in attrArr" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleArr" :key="saleAttr.id">
            <el-select v-model="saleAttr.saleIdAndValueId">
              <el-option
                :label="attrValue.saleAttrValueName"
                v-for="attrValue in saleAttr.spuSaleAttrValueList"
                :key="attrValue.id"
                :value="`${saleAttr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr" ref="tableRef">
          <el-table-column type="selection" width="80px" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="setDefaultImg(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { SaleAttr, SaleAttrResponseData, SkuData, SpuData, SpuHasImg, SpuImg } from '@/api/product/spu/type'
import { AttrList, AttrResponseData } from '@/api/product/attr/type'
//引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqAddSku, reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

//平台属性
const attrArr = ref<AttrList>([])
//销售属性
const saleArr = ref<SaleAttr[]>([])
//照片墙
const imgArr = ref<SpuImg[]>()
//自定义事件的方法
const $emit = defineEmits(['changeScene'])
//收集Sku的参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '', //三级分类ID
  spuId: '', //SPU ID
  tmId: '', //品牌ID
  //v-model收集
  skuNmae: '', //sku名称
  price: '', //价格
  weight: '', //重量
  skuDesc: '', //描述
  skuAttrValueList: [
    //平台属性
    // {
    //   attrId: '', //平台属性ID
    //   valueId: '', //属性值ID
    // },
  ],
  skuSaleAttrValueList: [
    //销售属性
    // {
    //   saleAttrId: '', //属性ID
    //   saleAttrValueId: '', //属性值的ID
    // },
  ],
  skuDefaultImg: '', //默认图片
})
//获取table组件实例
const tableRef = ref<any>()
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
//对外暴露的初始化数据的方法
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id as number
  skuParams.tmId = spu.tmId
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
//设置默认图片按钮的回调
const setDefaultImg = (row: any) => {
  // console.log(row.imgUrl)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
  // console.log(tableRef.value)
  //全部取消勾选
  tableRef.value.clearSelection()
  //复选框选中
  tableRef.value.toggleRowSelection(row, true)
}
//保存按钮回调
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
      // console.log('attrId,valueId: ', attrId, valueId)
    }
    return prev
  }, [])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])
  // console.log(skuParams)

  //添加sku请求
  const res = await reqAddSku(skuParams)
  // console.log('res: ', res)
  if (res.code == 200) {
    ElMessage.success('添加SKU成功')
    //通知父组件切换场景0
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage.error('添加SKU失败')
  }
}
//当前子组件对外暴露方法
defineExpose({ initSkuData })
</script>
<style scoped></style>

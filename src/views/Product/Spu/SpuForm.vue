<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="spu名称">
        <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="spu品牌">
        <el-select v-model="spuParams.tmId">
          <el-option v-for="item in allTrademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input type="textarea" placeholder="请输入Spu描述" v-model="spuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="spu照片">
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="spu销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select>
          <el-option label="华为"></el-option>
          <el-option label="小米"></el-option>
          <el-option label="OPPO"></el-option>
          <el-option label="vivo"></el-option>
        </el-select>
        <el-button icon="plus" type="primary" style="margin-left: 10px">添加属性值</el-button>
        <!-- 展示销售属性与属性值 -->
        <el-table border style="margin: 10px 0">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名字" width="120px"></el-table-column>
          <el-table-column label="属性值"></el-table-column>
          <el-table-column label="操作" width="120px"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reqAllSaleAttr, reqAllTrademark, reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import {
  AllTrademark,
  HasSaleAttr,
  HasSaleAttrResponseData,
  SaleAttr,
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  SpuImg,
} from '@/api/product/spu/type'
import { Trademark } from '@/api/product/trademark/type'
import { ref } from 'vue'

const $emits = defineEmits(['changeScene'])

//点击取消按钮：通知父组件切换场景1， 展示有的Spu
const cancel = () => {
  $emits('changeScene', 0)
}
//存储已有的SPU的数据
let allTrademark = ref<Trademark[]>([])
//商品图片
let imgList = ref<SpuImg[]>([])
//已有SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部的销售属性
let AllSaleAttr = ref<HasSaleAttr[]>([])
//存储已有的SPU对象,将来在模板中展示
let spuParams = ref<SpuData>({
  category3Id: '', //三级分类ID
  spuName: '', //SPU名字
  description: '', //SPU描述
  tmId: '', //品牌ID
  spuImageList: [],
  spuSaleAttrList: [],
})
//供父组件调用的初始化方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象
  spuParams.value = spu
  //spu为父组件传递过来的已有Spu对象(不完整)
  //获取全部的品牌的数据
  const res1: AllTrademark = await reqAllTrademark()
  // console.log('res1: ', res1)
  //获取某一个品牌旗下的全部售卖商品的图片
  const res2: SpuHasImg = await reqSpuImageList(spu.id as number)
  // console.log('res2: ', res2)
  //获取已有的Spu销售属性
  const res3: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // console.log('res3: ', res3)
  //获取整个项目全部SPU的销售属性
  const res4: HasSaleAttrResponseData = await reqAllSaleAttr()
  // console.log('res4: ', res4)
  //存储全部品牌的数据
  allTrademark.value = res1.data
  //SPU对应商品图片
  imgList.value = res2.data
  //存储已有的SPU的销售属性
  saleAttr.value = res3.data
  //存储全部销售属性
  AllSaleAttr.value = res4.data
}
//对外暴露
defineExpose({ initHasSpuData })
</script>
<style scoped></style>

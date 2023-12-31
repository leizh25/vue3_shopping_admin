<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <!-- v-if | v-show都可以显示与隐藏 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="plus" :disabled="!categoryStore.c3Id" @click="addSpu">添加SPU</el-button>
        <!-- 展示已有SPU数据 -->
        <el-table style="margin: 10px 0" border align="center" width="100px" :data="recoreds">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="warning" size="small" icon="edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="small" icon="view" title="查看SKU列标" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}吗?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,-> ,sizes,total"
          :total="total"
          :disabled="!recoreds.length"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加以及修改Spu子组件 -->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="SpuFormVC"></SpuForm>
      <!-- 添加Sku子组件 -->
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="SkuFormVC"></SkuForm>
    </el-card>
    <!-- dialog对话框展示已有的SKu数据 -->
    <el-dialog title="SKU列表" v-model="dialogShow">
      <el-table border :data="skuArr">
        <el-table-column lable="SKU名字" prop="skuName"></el-table-column>
        <el-table-column lable="SKU价格" prop="price"></el-table-column>
        <el-table-column lable="SKU重量" prop="weight"></el-table-column>
        <el-table-column lable="SKU图片">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
//引入分类仓库
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import { HasSpuResponseData, Records, SkuData, SpuData } from '@/api/product/spu/type'
//引入相应的子组件SpuForm
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
//场景值
const scene = ref<number>(0) //0 显示已有Spu   1 添加或修改已有Spu   2 添加Sku
//分页器默认页码
let pageNo = ref<number>(1)
//每页展示几条数据
let pageSize = ref<number>(3)
//存储已有SPU的数组
let recoreds = ref<Records>([])
//存储已有SPU总个数
let total = ref<number>(0)
//获取子组件实例SpuForm
const SpuFormVC = ref<any>()
//获取子组件实例
const SkuFormVC = ref<any>()
//存储全部的Sku数据
let skuArr = ref<SkuData[]>([])
//对话框显示隐藏
let dialogShow = ref<boolean>(false)
//监听三级分类ID的变化
watch(
  () => categoryStore.c3Id,
  () => {
    //务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
//此方法执行可以获取某一个三级分类下的全部SPU
const getHasSpu = async (currentPage = 1) => {
  pageNo.value = currentPage
  const res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  // console.log('res: ', res)
  if (res.code == 200) {
    recoreds.value = res.data.records
    total.value = res.data.total
  }
}
//分页器下拉菜单发生变化时触发
const changeSize = () => {
  getHasSpu()
}
//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1:添加与修改已有SPU结构 -> SpuForm
  scene.value = 1
  //调用子组件方法初始化数据
  SpuFormVC.value.initAddSpu(categoryStore.c3Id)
}
//子组件SpuForm绑定的自定义事件:目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  //子组件SpuForm点击取消变为场景0:展示已有Spu
  scene.value = obj.flag
  //重新发生请求获取数据
  if (obj.params == 'update') {
    // 更新: 留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加: 回到第一页
    getHasSpu()
  }
}
//修改已有Spu按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1:添加与修改已有SPU结构 -> SpuForm
  scene.value = 1
  // console.log(SpuFormVC.value)
  //调用子组件实例方法去获取完整的已有的SPU的数据
  SpuFormVC.value.initHasSpuData(row)
}
//添加Sku按钮的回调
const addSku = (spu: SpuData) => {
  //切换场景2
  scene.value = 2
  //调用子组件方法初始化添加Sku的数据
  SkuFormVC.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, spu)
}
//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  const res = await reqSkuList(row.id as number)
  // console.log('res: ', res)
  if (res.code === 200) {
    skuArr.value = res.data
    //对话框显示
    dialogShow.value = true
  }
}
//删除SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  const res = await reqRemoveSpu(row.id as number)
  // console.log('res: ', res)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    //删除成功,重新请求数据
    getHasSpu(recoreds.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
//路由组件销毁前清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style scoped></style>

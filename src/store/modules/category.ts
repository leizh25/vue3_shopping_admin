//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      //存储一级分类的数据
      c1Arr: [],
      //存储一级分类的ID
      c1Id: '',
      //存储二级分类的数据
      c2Arr: [],
      //存储二级分类的ID
      c2Id: '',
      //三级
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    //获取一级分类的方法
    async getC1() {
      //发请求获取一级分类数据
      const res: CategoryResponseData = await reqC1()
      // console.log('res: ', res)
      if (res.code == 200) {
        this.c1Arr = res.data
      }
    },
    //获取二级分类的方法
    async getC2() {
      const res: CategoryResponseData = await reqC2(this.c1Id)
      // console.log('res: ', res)
      if (res.code == 200) {
        this.c2Arr = res.data
      }
    },
    //获取三级分类的方法
    async getC3() {
      const res: CategoryResponseData = await reqC3(this.c2Id)
      console.log('res: ', res)
      if (res.code == 200) {
        this.c3Arr = res.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore

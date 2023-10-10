//品牌管理模块的接口
import request from '@/utils/request'

//品牌管理模块接口地址
enum API {
  //获取已有品牌的接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
}

//获取已有品牌的接口方法
//page: 获取第几页 -- 默认第一页
//limit: 获取鸡哥已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) => request.get<any, any>(API.TRADEMARK_URL + `${page}/${limit}`)

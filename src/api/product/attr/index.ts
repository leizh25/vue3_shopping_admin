//书写属性相关的API接口文件
import request from '@/utils/request'
import { CategoryResponseData, AttrResponseData, Attr } from './type'
//属性管理模块接口地址
enum API {
  //获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  //获取二级分类
  C2_URL = '/admin/product/getCategory2/',
  //获取三级分类
  C3_URL = '/admin/product/getCategory3/',
  //获取分类下已有的属性与属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加或修改已有属性的接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  //删除属性的接口地址
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}
//获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

//获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

//获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

//获取对应分类下的已有属性与属性值接口
export const reqAttr = (category1Id: string | number, category2Id: string | number, category3Id: string | number) => {
  return request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
}

//新增或修改已有属性的接口
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

//删除属性的接口
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId)

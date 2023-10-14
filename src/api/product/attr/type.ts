//分类相关的数据的TS类型
export interface ResponseData {
  code: number
  message: string
  ok: string
}
//分类TS类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
//相应的分类接口返回的数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//对应的属性与属性值的数据类型

//属性值对象的TS类型
export interface AttrValue {
  id: number
  valueName: string
  attrId: number
}
//存储每一个属性值的数据类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
  id: number
  attrName: string
  category1Id: number
  categoryLevel: number
  AttrValueList: AttrValueList
}
//存储每一个属性对象的数组TS类型
export type AttrList = Attrp[]
//属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}

//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SPU的TS类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
}
//数组元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据TS类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//所有品牌数据的TS类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌接口返回的数据TS类型
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}
//商品图片TS类型
export interface SpuImg {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
}
//已有的SPU照片墙数据的类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

//已有的销售属性值对象TS类型
export interface SaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象TS类型
export interface SaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
}
//SPU已有销售属性接口返回的数据TS类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU的返回数据TS类型
export interface HasSaleAttr {
  id: number
  name: string
}
//
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

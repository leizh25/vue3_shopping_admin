export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//定义SKU对象TS类型
export interface Attr {
  attrId: number | string //平台属性ID
  valueId: number | string //属性值ID
  id?: number //SKU ID
  valueName: string
}
export interface SaleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
  id?: number //SKU ID
  saleAttrValueName: string
}
export interface SkuData {
  category3Id?: number | string //三级分类ID
  spuId?: number | string //SPU ID
  tmId?: number | string //品牌ID
  skuNmae?: string //sku名称
  price?: number | string //价格
  weight?: number | string //重量
  skuDesc?: string //描述
  skuAttrValueList?: Attr[] //平台属性
  skuSaleAttrValueList?: SaleArr[] //销售属性
  skuDefaultImg?: string //默认图片
  isSale?: number //是否上架
  id?: number
  skuImageList?: any
}
//获取SKU接口返回的数据TS类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

//获取sku商品详情接口返回的数据TS类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}

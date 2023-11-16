export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//职位数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
}

//全部职位数组ts类型
export type Records = RoleData[]

//全部职位数据相应的TS类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    searchCount: boolean
    pages: number
  }
}

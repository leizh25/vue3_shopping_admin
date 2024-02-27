export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//菜单数据与按钮数据的ts类型
export interface Permission {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: Permission[]
  select: boolean
}

//菜单接口返回二数据类型
export interface PermissionResponse extends ResponseData {
  data: Permission[]
}

//添加与修改菜单携带的参数的ts类型
export interface MenuParams {
  id?: number
  code: string //权限值
  level: number //几级菜单
  name: string //菜单名称
  pid: number //父级id
}

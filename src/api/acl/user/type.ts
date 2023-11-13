//账号列表的TS类型
//响应类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//一个账号信息的TS类型
export interface User {
  id?: number
  createTime: string
  updateTime: string
  username?: string
  password?: string
  name?: string
  phone: null
  roleName: string
}

//数组包含全部的用户信息
export type Records = User[]

//获取全部用户信息接口返回的数据TS类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pager: number
  }
}

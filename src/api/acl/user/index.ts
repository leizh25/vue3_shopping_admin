//用户管理模块的接口
import request from '@/utils/request'
import { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'
//枚举地址
enum API {
  //获取全部的账号信息
  ALLUSER_URL = '/admin/acl/user/',
  //添加一个新的用户账号
  ADDUSER_URL = '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位,当前账号拥有的职位接口
  ALLROLEURL = '/admin/acl/user/toAssign/',
  //给已有的用户分配角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除的接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

//获取全部账号的接口
export const reqUserList = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + page + '/' + limit + '?username=' + username)

//添加用户与更新用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  //携带参数有ID,即为更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    //无ID即为添加
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

//获取全部的职位以及当前账号拥有的职位接口
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

//分配职务
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)

//删除某一个账号
export const reqRemoveUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)

//批量删除用户的接口
export const reqDeleteSelectUser = (idList: number[]) => request.delete<any,any>(API.DELETEALLUSER_URL, { data: idList })

//角色管理模块接口
import request from '@/utils/request'
import { MenuDataResponse, RoleData, RoleResponseData } from './type'
//枚举地址
enum API {
  //获取全部的职位
  ALLROLE_URL = '/admin/acl/role/',
  //新增岗位/角色接口
  ADDROLE_URL = '/admin/acl/role/save',
  //更新岗位/角色接口
  UPDATE_URL = '/admin/acl/role/update',
  //获取全部的菜单与按钮数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //给相应的角色分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  //删除已有的职位
  REMOVEROLE_URL = "/admin/acl/role/remove/",
}
//获取全部的职位
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + page + '/' + limit + '?roleName=' + roleName)

//新增/更新职位
export const reqAddOrUpdateRole = (data: RoleData) => {
  //有ID  即更新
  if (data.id) return request.put<any, any>(API.UPDATE_URL, data)
  //无ID  即新增
  else return request.post<any, any>(API.ADDROLE_URL, data)
}

//获取全部的菜单与按钮数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuDataResponse>(API.ALLPERMISSION_URL + roleId)

//给相应的角色下发权限
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)

//删除已有的职位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId)
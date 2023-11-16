//角色管理模块接口
import request from '@/utils/request'
import { RoleData, RoleResponseData } from './type'
//枚举地址
enum API {
  //获取全部的职位
  ALLROLE_URL = '/admin/acl/role/',
  //新增岗位/角色接口
  ADDROLE_URL = '/admin/acl/role/save',
  //更新岗位/角色接口
  UPDATE_URL = '/admin/acl/role/update',
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

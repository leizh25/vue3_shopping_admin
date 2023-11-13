//用户管理模块的接口
import request from '@/utils/request'
import { UserResponseData } from './type'
//枚举地址
enum API {
  //获取全部的账号信息
  ALLUSER_URL = '/admin/acl/user/',
}

//获取全部账号的接口
export const reqUserList = (page: number, limit: number) => request.get<any, UserResponseData>(API.ALLUSER_URL + page + '/' + limit)

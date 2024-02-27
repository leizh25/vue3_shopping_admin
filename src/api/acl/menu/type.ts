export interface ResponseData {
    code: number
    message: string
    ok: boolean
}
//菜单数据与按钮数据的ts类型
export interface Permission {
    "id"?: number,
    "createTime": string
    "updateTime": string
    "pid": number,
    "name": string,
    "code": string,
    "toCode": string,
    "type": number,
    "status": null,
    "level": number,
    "children"?: Permission[],
    "select": boolean
}

//菜单接口返回二数据类型
export interface PermissionResponse extends ResponseData {
    data: Permission[]
}
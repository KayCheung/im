/**
 * 通讯录相关接口
 */
import { post, get } from '@/utils/request'

// 获取部门及成员列表服务接口
export const GetAddressBooksApi = data => {
    return get('/oa/api/department/all_department_users', data)
}
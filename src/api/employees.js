import request from '@/utils/request'
/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeList (params) {
  return request({
    url: '/sys/user',
    params
  })
}
/**
 * 获取员工的简单列表数据
 * ***/
 export function getEmployeeSimple (params) {
  return request({
    url: '/sys/user/simple',
    params
  })
}
/**
 * 删除员工接口
 * ****/

export function delEmployee (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/** **
 *  新增员工的接口
 * **/
export function addEmployee (data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 *给员工分配角色
 * @param {*} data
 * @returns
 */
export const roleChoose = ({ id, roleIds }) => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data: { id, roleIds }
  })
}
// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}
/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

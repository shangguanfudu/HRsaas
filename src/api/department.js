import request from '@/utils/request'

/**
 *获取组织架构列表
 * @returns
 */
export const getDepartment = () => {
  return request({
    url: '/company/department'
  })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepart (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 * 新增部门
 * @param code 编码
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}
/**
 * 编辑部门
 * @param {*} data
 * @returns
 */
export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}

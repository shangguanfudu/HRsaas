import request from '@/utils/request'
// 获取所有的权限点
export const getPermissions = () => {
  return request({
    url: '/sys/permission'
  })
}
// 给角色分配权限
export const assignPermission = (id, permIds) => {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data: { id, permIds }
  })
}

// 新增权限
export function addPermission (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission (data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限
export function delPermission (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
// 获取权限详情
export function getPermissionDetail (id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

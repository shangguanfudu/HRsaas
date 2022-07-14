import request from '@/utils/request'

/**
 * 登录
 * @param {*} param0
 * @returns
 */
export const login = ({ mobile, password }) => {
  return request({
    method: 'POST',
    url: '/sys/login',
    data: { mobile, password }
  })
}

/**
 *
 * @returns 获取用户个人资料
 */
export function getInfo () {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

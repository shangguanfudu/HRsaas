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

export function getInfo (token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

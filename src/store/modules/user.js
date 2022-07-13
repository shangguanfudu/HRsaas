import { login } from '@/api/user'
import { Message } from 'element-ui'
import { setToken, getToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken() || ''
}
const mutations = {
  setToken (state, token) {
    state.token = token
  },
  // 删除缓存
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }

}
const actions = {
  async login (context, data) {
    try {
      const { data: res } = await login(data)
      // console.log(res)
      if (res.success) {
        context.commit('setToken', res.data)
        setToken(res.data)
        Message.success('登录成功')
      } else {
        // Message.error(res.message)
        return Promise.reject(new Error(res.message))// 解决账号密码错误也能跳转页面的问题
      }
    } catch (error) {
      // console.log(error)
      return Promise.reject(new Error('登录失败,请重试'))
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


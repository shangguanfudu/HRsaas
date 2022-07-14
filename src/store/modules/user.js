import { login, getInfo, getUserDetailById } from '@/api/user'
// import { Message } from 'element-ui'
import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
const state = {
  token: getToken() || '',
  userInfo: {}
}
const mutations = {
  setToken (state, token) {
    state.token = token
  },
  // 删除缓存
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo (state, userInfo) {
    state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo (state) {
    state.userInfo = {}
  }

}
const actions = {
  // 登录
  async login (context, data) {
    const res = await login(data)
    // console.log(res)
    context.commit('setToken', res)
    setToken(res)
    // 设置时间戳
    setTimeStamp()
  },
  // 获取用户信息
  async getInfo (context) {
    const res = await getInfo(context)
    const result = await getUserDetailById(res.userId)
    // console.log(res)
    // console.log(result)
    const baseRes = { ...res, ...result }
    context.commit('setUserInfo', baseRes)
    return baseRes
  },
  // 登出的action
  logout (context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


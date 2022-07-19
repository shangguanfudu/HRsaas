import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// response interceptor
service.interceptors.response.use(
  response => {
    const { data, success, message } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // 实现token失效的被动处理
    // console.dir(error)
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    }

    return Promise.reject(error)
  }
)
// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) { // 每次发起请求还要判断token是否过期
    const time = Date.now() - getTimeStamp()
    if (time > 2 * 60 * 60 * 1000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default service

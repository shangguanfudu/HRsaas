import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
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
    console.log('err' + error) // for debug

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

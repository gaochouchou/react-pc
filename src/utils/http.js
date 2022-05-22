// 封装axios
// 实例化-请求拦截器-响应拦截器
import axios from 'axios'
import { getToken, removeToken } from './token'
import { history } from './history'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  // timeout-超时事件配置5秒钟
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  // 在请求发送之前将token放进去
  // 一处配置多处生效
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.log(error.response.status)
  if (error.response.status === 401) {
    // 跳回到登录 reactRouter
    removeToken()
    history.push('/login')
  }
  return Promise.reject(error)
})

export { http }
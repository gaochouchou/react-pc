// 先把所有的工具函数导出模块在此处导入
// 然后再统一导出
import { http } from './http'
import { setToken, getToken, removeToken, } from './token'

export {
  http,
  setToken,
  getToken,
  removeToken,
}

// export {http} from '@/utils'
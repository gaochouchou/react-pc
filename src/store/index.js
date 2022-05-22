// 把所有的模块统一处理
// 导出统一的方法useStore
import React from 'react'
import LoginStore from './login.Store'
import UserStore from './user.Store'

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
  }
}

// 实例化根
const rootStore = new RootStore()
// 导出useStore context
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)
export { useStore }
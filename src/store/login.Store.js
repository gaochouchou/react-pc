// login module

import { getToken, http, removeToken, setToken } from "@/utils"
import { makeAutoObservable } from "mobx"


class LoginStore {
  // 在给token赋值之前先进行一次本地取，如果本地没有再赋空
  // 防止刷新丢失
  token = getToken() || ''

  constructor() {
    // 响应式
    makeAutoObservable(this)
  }

  // 登录操作，设置token
  getToken = async ({ mobile, code }) => {
    // 调用登录接口
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    // 存入token
    console.log(res.data)
    this.token = res.data.token
    // 存入localStorage
    setToken(this.token)
  }

  // 退出操作，删除token
  // 不要使用useNavigate操作，useXXXX为钩子函数，在对象组件或者其他钩子函数中使用它
  remToken = () => {
    this.token = ''
    removeToken()
  }
}

export default LoginStore 

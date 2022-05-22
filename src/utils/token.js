// 封装ls存取token
const key = 'pc-key'

const setToken = (token) => {
  // 需要调用完整，返回返回值
  return window.localStorage.setItem(key, token)
}

const getToken = () => {
  return window.localStorage.getItem(key)
}

const removeToken = () => {
  return window.localStorage.removeItem(key)
}

export {
  setToken,
  getToken,
  removeToken,
}
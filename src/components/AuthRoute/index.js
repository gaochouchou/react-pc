// 1、判断token是否存在
// 2、存在 正常渲染
// 3、不存在 重定向到登录路由

const { getToken } = require("@/utils")
const { Navigate } = require("react-router-dom")

// 高阶组件：一个组件当成另外一个组件的参数传入
// 通过一定的判断，返回新的组件

function Authcomponent ({ children }) {
  const istoken = getToken()
  // 按照选择渲染
  if (istoken) {
    return <>{children}</>
  }
  else {
    // 此处使用Navigate时按照有无token进行jsx渲染（样例如下）
    return <Navigate to='/login' replace></Navigate>
  }
}

// <Authcomponent> <Layout/> </Authcomponent>
// 登录：<> <Layout/> </>
// 非登录 <Navigate to='/login' replace></Navigate>

export {
  Authcomponent
}

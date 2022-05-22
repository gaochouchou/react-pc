import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import './App.css'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { Authcomponent } from '@/components/AuthRoute'
import Home from './pages/Home'
import Article from './pages/Article'
import Publish from './pages/Publish/Publish'
import { history } from '@/utils/history'

function App () {
  return (
    <HistoryRouter history={history}>
      <Routes>
        {/* Layout需要鉴权处理 */}
        {/* Layout不能直接渲染，要根据Authcomponent来包裹*/}
        <Route path='/' element={
          <Authcomponent>
            <Layout />
          </Authcomponent>}
        >
          <Route index element={<Home />}></Route>
          <Route path='article' element={<Article />}></Route>
          <Route path='publish' element={<Publish />}></Route>
        </Route>

        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </HistoryRouter>
  )
}

export default App

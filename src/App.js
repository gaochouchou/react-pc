import { Routes, BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Login from '@/pages/Login'


function App () {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Layout />}> </Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Friend from './components/Friend'
import Header from './components/Header'
import Home from './components/Home'
import Member from './components/Member'
import RouteEdit from './components/RouteEdit'
import RouteView from './components/RouteView'

function App() {
  return (
    <BrowserRouter>
      <div className='fixed w-full top-0 z-10'>
        <Header />
      </div>
      <div className='h-16' />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/member' element={<Member />} />
        <Route path='/route' element={<RouteView />} />
        <Route path='/edit-route' element={<RouteEdit />} />
        <Route path='/friend' element={<Friend />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

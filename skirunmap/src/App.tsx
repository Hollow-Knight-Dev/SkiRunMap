import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Friend from './pages/Friend'
import Home from './pages/Home'
import Member from './pages/Member'
import RouteEdit from './pages/RouteEdit'
import RouteView from './pages/RouteView'
import SignIn from './pages/Signin'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className='fixed top-0 z-10 w-full'>
        <Header />
      </div>
      <div className='h-16' />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
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

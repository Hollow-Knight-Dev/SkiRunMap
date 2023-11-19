import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import EditRoute from './components/EditRoute'
import Footer from './components/Footer'
import Friend from './components/Friend'
import Header from './components/Header'
import Home from './components/Home'
import Member from './components/Member'
import ViewRoute from './components/ViewRoute'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/member' element={<Member />} />
        <Route path='/route' element={<ViewRoute />} />
        <Route path='/edit-route' element={<EditRoute />} />
        <Route path='/friend' element={<Friend />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

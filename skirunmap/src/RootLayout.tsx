import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

const RootLayout = () => {
  return (
    <div>
      <div className='fixed top-0 z-10 w-full'>
        <Header />
      </div>
      <div className='h-16' />
      <Outlet />
      <Footer />
    </div>
  )
}

export default RootLayout

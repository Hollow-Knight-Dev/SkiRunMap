import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import SmallScreen from './pages/SmallScreen'

const RootLayout = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 1280)
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1280)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <div className='fixed top-0 z-50 w-full'>
        <Header />
      </div>
      <div className='h-16' />
      {isSmallScreen ? <SmallScreen /> : <Outlet />}

      <Footer />
      <ScrollRestoration />
    </div>
  )
}

export default RootLayout

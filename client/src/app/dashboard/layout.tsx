import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'


function Layout({children}: {children: React.ReactNode}) {
  return (
    <div>
    <Navbar />
    <div className='mt-6'>
      {children}
    </div>
      <Footer />
    </div> 
  )
}

export default Layout
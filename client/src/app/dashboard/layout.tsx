import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import ThemeProvider from "@/utils/ThemeProvider";
import React from 'react'


function Layout({children}: {children: React.ReactNode}) {
  return (
    <div  className={`dark:bg-gradient-to-b dark:from-gray-900 dark:to-black bg-white duration-300 bg-no-repeat min-h-screen w-full dark:text-white text-black`}>
    <Navbar />
    <div className='mt-6'>
      {children}
    </div>
      <Footer />
    </div> 
  )
}

export default Layout
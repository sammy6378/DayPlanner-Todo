import Navbar from './navbar'
import Footer from './footer'
 
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className='bg-gray-900 h-screen'>{children}</main>
      <Footer />
    </>
  )
}
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <nav className='flex justify-between items-center p-2 bg-slate-800'>
        <div className=''>
            <Link href={'/'}>Logo</Link>
        </div>

        {/* navlinks */}
        <ul className='flex justify-between items-center space-x-3'>
            <Link href={'/'} className='hover:text-blue-300'>Home</Link>
            <Link href={'/about'} className='hover:text-blue-300'>About</Link>
            <Link href={'/contact'} className='hover:text-blue-300'>Contact</Link>
        </ul>

        {/* auth */}
        <div className='flex justify-between items-center space-x-6'>
            <Link href={'/user-login'} className='bg-green-700 py-2 rounded-md px-4 hover:bg-green-800'>Login</Link>
            <Link href={'/user-register'} className=' underline'>Signup</Link>
        </div>
    </nav>
  )
}

export default Navbar
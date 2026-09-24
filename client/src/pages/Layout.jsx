import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchUser } from '../features/user/userSlice'

const Layout = () => {

    const user = useSelector((state)=>state.user.value)
    const status = useSelector((state)=>state.user.status)
    const error = useSelector((state)=>state.user.error)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const { getToken } = useAuth()

    const retry = async () => {
        const token = await getToken()
        dispatch(fetchUser(token))
    }

    // Fetch fail ho gaya (backend down / DB/Clerk key mismatch / etc.) -
    // ab hamesha ke liye spinner atkega nahi, error dikhega with retry option.
    if(status === 'failed' && !user){
        return (
            <div className='w-full h-screen flex flex-col items-center justify-center gap-3 text-center px-4'>
                <p className='text-red-500 font-medium'>Something went wrong while loading your profile.</p>
                <p className='text-gray-500 text-sm'>{error}</p>
                <button onClick={retry} className='px-4 py-2 bg-purple-600 text-white rounded-md'>Retry</button>
            </div>
        )
    }

  return user ? (
    <div className='w-full flex h-screen'>

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <div className='flex-1 bg-slate-50'>
            <Outlet />
        </div>
      {
        sidebarOpen ? 
        <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(false)}/>
        : 
        <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(true)}/>
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout

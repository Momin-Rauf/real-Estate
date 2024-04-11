import React from 'react'
import { FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className='bg-[#545454] flex flex-row justify-between gap-3 p-3  sm:text-sm ' >
        <div className='p-3  font-bold' >
        <span className='text-slate-200 text-md '>Seven</span>
        <span className='text-slate-400 text-xl' >Estate</span>
        </div>
        <div className='p-3 text-white flex flex-row justify-center items-center bg-transparent ' >
            <input type="text" className='p-2  rounded-lg bg-[#7b7474] text-white outline-none' placeholder='search...'/>
            <FiSearch size={25} className='m-1' />
            
        </div>
        <div className='p-3 sm:inline hidden sm:justify-center sm:items-center text-white   ' >
            <ul className='flex gap-4' >
                <li>About</li>
                <li>Home</li>
                <li>
                    Login
                </li>
                {/* <Link to={'/'} >hello</Link> */}
                {/* <Link to='/about' ><li className='hover:underline text-white' >About</li></Link> */}
                {/* <Link to='/login' ><li className='hover:underline text-white' >Login</li></Link> */}
            </ul>
        </div>
    </nav>
  )
}

export default Header
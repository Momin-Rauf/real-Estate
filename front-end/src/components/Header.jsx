import React from 'react'
import { FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';

const Header = () => {
  const {currentUser} = useSelector((state)=> state.user);
  return (
    <nav className='bg-[#545454] flex w-[100%] flex-row justify-between gap-3 p-3  sm:text-sm ' >
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
                <a href="/home">Home</a>
                <a href="/about">About</a>
                
                <a href="/profile">

                {currentUser ? (
                  <img className='w-7 h-7 rounded-full object-cover' src={currentUser.photo} alt="profile" />
                ) : (
                  <li>Sign in</li>
                )
              }
              </a>
                
                
            </ul>
        </div>
    </nav>
  )
}

export default Header
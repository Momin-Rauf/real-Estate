import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from 'react';

const Header = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const {currentUser} = useSelector((state)=> state.user);
  return (
    <nav className='bg-[#545454] flex w-[100%] flex-row justify-between gap-3 p-3  sm:text-sm ' >
        <div className='p-3  font-bold' >
        <span className='text-slate-200 text-md '>Seven</span>
        <span className='text-slate-400 text-xl' >Estate</span>
        </div>
        <div className='p-3 text-white flex flex-row justify-center items-center bg-transparent ' >
            <form onSubmit={handleSubmit}>
              <input type='text'
           
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className='p-2  rounded-lg bg-[#7b7474] text-white outline-none' placeholder='search...'/>
            <button type='submit' ><FiSearch  className='m-1' /></button>
            </form>
            
        </div>
        <div className='p-3 sm:inline hidden sm:justify-center sm:items-center text-white   ' >
            <ul className='flex gap-4' >
                <Link to={'/'} >Home</Link>
                <Link to={'/about'} >About</Link>
                
              <Link to={'/profile'} >

                {currentUser ? (
                  <img className='w-7 h-7 rounded-full object-cover' src={currentUser.photo} alt="profile" />
                ) : (
                  <li>Sign in</li>
                )
              }
              
              </Link>
                
            </ul>
        </div>
    </nav>
  )
}

export default Header
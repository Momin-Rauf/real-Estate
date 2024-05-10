import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../public/logo.png';
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
    <nav className='bg-[#2D3748]  flex w-[100%] flex-row justify-between gap-3 p-3  sm:text-sm ' >
        <div className='p-3 h-[10%]  font-bold' >
        
        <img className='h-20' src={logo} alt="" />
        
        </div>
        <div className='p-3 text-white flex flex-row justify-center ml-auto' >
            <form className='p-3 text-white flex flex-row justify-center ' onSubmit={handleSubmit}>
              <input type='text'
           
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className='p-2   rounded-lg bg-[#7b7474]  text-white outline-none' placeholder='search...'/>
            <button type='submit' className='' ><FiSearch className='m-1' size={40}  /></button>
            </form>
            
        </div>
        <div className='p-3  hidden sm:justify-center sm:flex sm:items-center text-white   ' >
            <ul className='flex gap-10 font-semibold ' >
                <Link  className='hover:underline text-lg' to={'/'} >Home</Link>
                <Link className='hover:underline text-lg' to={'/about'} >About</Link>
                
              <Link className='hover:underline text-lg' to={'/profile'} >

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
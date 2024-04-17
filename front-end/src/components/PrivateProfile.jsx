import React from 'react'
import {useSelector} from 'react-redux';
import { Outlet,Navigate } from 'react-router-dom';
const PrivateProfile = () => {
    const {currentUser} = useSelector((state)=> state.user);
  return  currentUser ? <Outlet/> : <Navigate to='/login' />  
  
}

export default PrivateProfile
import React from 'react'
import {GoogleAuthProvider,getAuth} from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import {app} from '../firebase';
import { useNavigate } from 'react-router-dom';
import {signInStart,signInSuccess,signInfailure} from '../redux/user/userSlice.js';
const GoogleAuth = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
    const googleSignIn = async()=>{
       try {
        const provider = new GoogleAuthProvider();
       const auth = getAuth();

       const result  =await signInWithPopup(auth,provider);
       console.log(result);

       const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           username: result.user.displayName,
            email:result.user.email,
           photo: result.user.photoURL,}
        ),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
       } catch (error) {
        console.log("Google sign in error",error);
       }
    }

  return (
    <button onClick={googleSignIn} className='mt-4 w-[30%] block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:shadow-md  shadow-sm shadow-black hover:shadow-black  bg-blue-500 hover:opacity-90' type='button' >Google Sign in</button>
  )
}

export default GoogleAuth
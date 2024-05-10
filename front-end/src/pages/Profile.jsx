import { app } from '../firebase';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading.jsx';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import {deleteUserFailure,deleteUserSuccess,deleteUserStart, updateUserStart, updateUserFailure, updateUserSuccess } from '../redux/user/userSlice.js';

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const imageRef = useRef();
  const dispatch = useDispatch();
  const [Fetchlisting,setListing] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const { loading, error } = useSelector(state => state.user);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      }
    );

    uploadTask
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        setFormData({...formData, photo: downloadURL});
      })
      .catch((error) => {
        console.error('Error getting download URL:', error);
      });
  };

  const handleImageClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const updateHandler = async () => {
    try {
      dispatch(updateUserStart(true));
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update');
      }

      const updatedData = await res.json();
      dispatch(updateUserSuccess(updatedData));
      
    } catch (error) {
      dispatch(updateUserFailure("Failed to update"));
    }
  };

  console.log(currentUser._id);
  const logout = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch('/api/user/logout');
      const data = await res.json();
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure('failed to log out'));
    }
  };
  

    
  
  const deleteHandler = async()=>{
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure("Failed to delete"));
    }}

    const fetchLists = async()=>{
      const data = await fetch(`/api/user/listing/${currentUser._id}`);
      const res = await data.json();
      setListing(res);
      console.log("response",res);

    }

    const deletelistHandler = async(ID)=>{
      console.log(ID)
      const res = await fetch(`/api/listing/delete/${ID}`,{
        method:"DELETE"});
        const data =await res.json();
        setListing((prev) =>
          prev.filter((listing) => listing._id !== ID));
        return;
    }

  return (
    <>
      {loading && <Loading />}
      <form className="flex flex-col gap-3 mx-auto max-w-lg min-w-lg">
        <h1 className="text-3xl text-[#545454] self-center text-center ">Profile</h1>
        <input
          type="file"
          onChange={handleFileChange}
          hidden
          accept="image/*"
          ref={imageRef}
        />
        <img 
          onClick={handleImageClick}
          className="w-24 cursor-pointer h-24 shadow-md shadow-black self-center mb-4 rounded-full object-cover"
          src={formData.photo || currentUser.photo}
          alt="photo"
        />
        <h2 className='text-center text-lg mb-2 font-bold'>{currentUser.username}</h2>
        {fileUploadError && <span className="text-red-600">{fileUploadError}</span>}
        <input
          className=" p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="text"
          id="username"
          onChange={handleFormChange}
          placeholder={currentUser.username}
        />
        <input
          className=" p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="email"
          id="email"
          onChange={handleFormChange}
          placeholder={currentUser.email}
        />
        <input
          className=" p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="password"
          onChange={handleFormChange}
          id="password"
          placeholder="*******"
        />
        <button
          type="button"
          className="mt-4 block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:opacity-95 shadow-sm shadow-black hover:shadow-black bg-[#545454]"
          onClick={() => updateHandler()}
        >
          Update
        </button>
        <Link className="mt-4 text-center block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:opacity-95 shadow-sm shadow-black hover:shadow-black bg-green-900"
             to={'/create-list'} >Create listing</Link>
        {error && <span className='text-red-900 text-md'>Error! {error}</span>}
      </form>
      <button onClick={()=>fetchLists()} >Show listing</button>
      {Fetchlisting ? Fetchlisting.map((l,index)=>{
        console.log("adsd",l._id)
        return <div key={index} >
          <img src={l.imageUrls[0]} alt="" />
          <Link to={`/get/${l._id}`} className='underline' >{l.description}</Link>
          <button onClick={()=>deletelistHandler(l._id)} >delete</button>
          <Link to={`/editlist/${l._id}`} >Edit</Link>
        </div>
      }) : ''
    }
      <div className='flex mx-auto w-[40%] mt-2 flex-row justify-between'>
        <button type='button' onClick={deleteHandler} className='border-[1px] p-1 rounded-lg border-blue-900 bg-transparent hover:bg-[#545454] hover:text-white'>
          Delete account
        </button>
        <button onClick={()=>logout()} className='border-[1px] p-1 rounded-lg border-[blue] bg-transparent hover:bg-[#545454] hover:text-white'>
          Sign out
        </button>
      </div>
    </>
  )
  }


export default Profile;

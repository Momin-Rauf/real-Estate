import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { app } from '../firebase';
import Loading from '../components/Loading';
import {
  deleteUserFailure,
  deleteUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [fetchListing, setFetchListing] = useState([]);
  const imageRef = useRef();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    fetchListingData();
  }, []);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      }
    );

    uploadTask
      .then(() => getDownloadURL(storageRef))
      .then((downloadURL) => {
        setFormData((prev) => ({ ...prev, photo: downloadURL }));
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
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const updateHandler = async () => {
    dispatch(updateUserStart());
    try {
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      const updatedData = await response.json();
      dispatch(updateUserSuccess(updatedData));
    } catch (error) {
      dispatch(updateUserFailure('Failed to update'));
    }
  };

  const logout = async () => {
    dispatch(updateUserStart());
    try {
      const response = await fetch('/api/user/logout');
      const data = await response.json();
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure('Failed to log out'));
    }
  };

  const deleteHandler = async () => {
    try {
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure('Failed to delete'));
    }
  };

  const fetchListingData = async () => {
    try {
      const response = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await response.json();
      setFetchListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    }
  };

  const deleteListHandler = async (ID) => {
    try {
      const response = await fetch(`/api/listing/delete/${ID}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setFetchListing((prev) => prev.filter((listing) => listing._id !== ID));
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <div className="p-3 m-2 flex gap-3 w-full justify-between">
        <button
          type="button"
          onClick={deleteHandler}
          className="bg-red-700 py-1 h-10 rounded-lg text-white  px-4"
        >
          Delete Account
        </button>
        <div>
          <button
            onClick={logout}
            className="border-1 m-4 p-1 rounded-lg border-gray-400 bg-gray-500 text-white"
          >
            Sign Out
          </button>
          <button className='border-[1px] border-black hover:border-gray-600 hover:bg-gray-600 px-4 py-1 rounded-lg hover:text-white ' onClick={onOpen}>Show Listing</button>
        </div>
      </div>

      <form className="flex flex-col gap-3 h-auto p-4 m-3 mx-auto max-w-lg min-w-lg">
        <h1 className="text-40 text-2D3748 font-extrabold text-center m-5">Profile</h1>

        <input
          type="file"
          onChange={handleFileChange}
          hidden
          accept="image/*"
          ref={imageRef}
        />

        <img
          onClick={handleImageClick}
          className="w-36 cursor-pointer h-36 shadow-md shadow-black self-center mb-4 rounded-full object-cover"
          src={formData.photo || currentUser.photo}
          alt="Profile Photo"
        />

        <h2 className="text-center text-2xl mb-2 p-3 font-bold">{currentUser.username}</h2>

        {fileUploadError && <span className="text-red-600">{fileUploadError}</span>}

        <input
          className="p-5 rounded-lg text-sm outline-none shadow-md"
          type="text"
          id="username"
          onChange={handleFormChange}
          placeholder={currentUser.username}
        />

        <input
          className="p-5 rounded-lg text-sm outline-none shadow-md"
          type="email"
          id="email"
          onChange={handleFormChange}
          placeholder={currentUser.email}
        />

        <input
          className="p-5 rounded-lg text-sm outline-none shadow-md"
          type="password"
          onChange={handleFormChange}
          id="password"
          placeholder="*******"
        />

        <button
          type="button"
          className="mt-4  rounded-lg py-2 px-4 text-white bg-[#2D3748] hover:opacity-95 shadow-sm"
          onClick={updateHandler}
        >
          Update
        </button>

        <Link
          className="mt-4 text-center block rounded-lg py-2 px-4 text-white bg-green-900"
          to="/create-list"
        >
          Create Listing
        </Link>

        {error && <span className="text-red-900 text-md">Error! {error}</span>}
      </form>

      <Modal  isOpen={isOpen} onClose={onClose}>
      
        <ModalContent>
          <ModalHeader className='bg-white mt-10 w-[80%] mx-auto p-4 text-black text-2xl' >Properties</ModalHeader>
          
          <ModalBody>
            {fetchListing.map((listing, index) => (
              <div key={index} className='w-[80%]  shadow-black m-auto flex justify-between gap-4 bg-[#2D3748] p-10  text-white items-center' >
                <div className='flex flex-row gap-4 items-center' ><img className=' h-16' src={listing.imageUrls[0]} alt={`Property ${listing.description}`} />
                <Link className="text-2xl underline" to={`/get/${listing._id}`} >
                  {listing.description}
                </Link></div>
               <div className='flex gap-4' > 
               <button className='bg-white text-gray-900 shadow-sm font-semibold rounded-sm hover:opacity-85 px-4 shadow-white' onClick={() => deleteListHandler(listing._id)}>Delete</button>
                <Link className='bg-white text-gray-900 shadow-sm font-semibold rounded-sm hover:opacity-85 px-4 shadow-white'  to={`/editlist/${listing._id}`}>Edit</Link>
               </div>
              </div>
            ))}
          </ModalBody>

          <ModalFooter className='bg-white w-[80%] mx-auto p-4 text-black text-2xl' >
            <Button className='bg-red-900 text-white px-4 py-1 ' colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;

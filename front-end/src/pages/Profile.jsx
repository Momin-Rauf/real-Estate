import { app } from '../firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import profileImage from '../../public/profile.jpeg';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null); // Initialize as null for error handling
  const { currentUser } = useSelector((state) => state.user);
  const imageRef = React.useRef(null);
  const [formData,setFormData] = useState({});
  console.log(currentUser.photo,formData.photo,profileImage);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name; // Ensure unique filename
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
        console.log(Math.round(progress));
      },
      (error) => { // Handle upload error
        setFileUploadError(error.message); // Set error message
      }
    );

    uploadTask
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        console.log('File uploaded:', downloadURL);
        setFormData({...FormData,photo:downloadURL});
        // Handle the downloaded URL as needed
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

  return (
    <div>
      <h1 className="text-3xl text-[#545454] self-center text-center m-5 mb-12">Profile</h1>
      <form className="flex flex-col mx-auto max-w-lg">
        <input
          type="file"
          onChange={handleFileChange}
          hidden
          accept="image/*"
          ref={imageRef}
        />
        <img
          onClick={handleImageClick}
          className="w-24 cursor-pointer h-24 shadow-sm self-center mb-4 rounded-full object-cover"
          src={formData.photo || currentUser.photo}
          alt="photo"
        />
     {fileUploadError ? (
  <span>error uploading the file</span>
) : percentage > 0 && percentage < 100 ? (
  <span className='text-green-600 text-center text-sm'>{percentage}%</span>
) : percentage === 100 ? (
  <span className='text-green-600 text-center text-sm'>successful</span>
) : null}

        <input
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="text"
          id="username"
          placeholder="Username"
        />
        <input
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="email"
          id="email"
          placeholder="Email"
        />
        <input
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm outline-none shadow-md"
          type="password"
          id="password"
          placeholder="Password"
        />
        <button
          type="button" // Change to 'button' type to prevent form submission
          className="mt-4 block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:shadow-md hover:bg-[#616060] shadow-sm shadow-black hover:shadow-black bg-[#545454]"
          onClick={() => {
            // Handle form submission logic here
          }}
        >
          Update
        </button>
      </form>
      
    </div>
  );
};

export default Profile;

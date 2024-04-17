import { app } from '../firebase';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import profile from '../../public/profile.jpeg';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [percentage,setPercentage] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const imageRef = React.useRef(null);

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

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercentage(Math.round(progress));
      console.log(percentage);
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
          src={profile}
          alt="photo"
        />
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
          type="submit" // Assuming this should be 'submit'
          className="mt-4 block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:shadow-md hover:bg-[#616060] shadow-sm shadow-black hover:shadow-black bg-[#545454]"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default Profile;

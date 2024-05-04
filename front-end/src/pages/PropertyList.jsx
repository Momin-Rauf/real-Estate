import { getDownloadURL, getStorage, ref,uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { app } from '../firebase';

const PropertyList = () => {
    const [imageUploadError,setImageUploadError] = useState(false);
    const [files,setFiles] = useState([]);
    console.log(files);
    const [formData,setFormData] = useState({
            imageUrls:[],
    });

    console.log("form data",formData);

    const handleImageSubmit = (e) => {
        e.preventDefault();
        console.log(files.length);
        try {
            if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
                console.log('Condition met. Starting image upload...');
                const promises = [];
    
                for (let i = 0; i < files.length; i++) {
                    console.log(`Processing file ${i + 1} of ${files.length}`);
                    promises.push(StoreImage(files[i]));
                }
    
                Promise.all(promises).then((urls) => {
                    console.log('All images uploaded successfully.');
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                });
            } else {
                console.log('Condition not met. Aborting image upload.');
            }
        } catch (error) {
            console.error('Error occurred during image upload:', error);
            setImageUploadError(true);
        }
    };
    

    const StoreImage = async(file) => {
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",
            (snapshot)=> {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('uploadProgress:',progress);
            },
            (error)=>{reject(error)},
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL);
                });
            }
        );
        })
    }
  return (
    <div className='bg-gray-300 mx-auto justify-center items-center h-[85vh] min-w-4xl sm:flex-row flex flex-col gap-1 border-red-200 ' >
        <form   className='flex p-3 rounded-lg flex-col gap-4 ' >
            <input id='name' placeholder='Name'  className='rounded-md outline-none h-[25px] p-3' required type="text" />
            <input id='address' placeholder='address' className='rounded-md p-3 h-[25px] outline-none' required type="text" />
            <textarea id='description' placeholder='description' className='rounded-md w-40 outline-none' required name="description"  cols="10" rows="2"></textarea>    

            <div className='flex  gap-4 flex-wrap sm:flex-row flex-row' >
            <div><input type="checkbox" className='m-4' id="sell" /><span>sell</span></div>
            <div><input type="checkbox" className='m-4' id="rent" /><span>rent</span></div>
           <div> <input type="checkbox" className='m-4' id="parking" /><span>parking</span></div>
            <div><input type="checkbox" className='m-4' id="furnished" /><span>furnished</span></div>
           <div> <input type="checkbox" className='m-4' id="offer" /><span>offer</span></div>
            </div>

            <div className='flex gap-5 flex-wrap sm:flex-row' >
            <input type="number" className='w-[33%]' name="bed" id="bde" />
            <input type="number" className='w-[33%]' name="bath" id="bath" />
            <input type="number" className='w-[33%]' name="regualrPrice" id="regularPrice" />
            </div>
            <p><span className='font-bold' >Important</span>First image will be used as cover</p>

            <input multiple  onChange={(e)=>setFiles(e.target.files)} type="file" accept='image/*' name="image" id="image" />
            <button type='button' onClick={handleImageSubmit} className='border-[.4px] border-red-500' id="upload">Upload</button>

            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url)=>{
                    <img src={url} alt="listing images" className='w-20 h-20 object-cover rounded-lg' />
})
            }
            <button type='submit' className="mt-4 text-center block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white 
       hover:opacity-95 shadow-sm shadow-black hover:shadow-black bg-green-900">create</button>
        </form>
    </div>
  )
}

export default PropertyList;
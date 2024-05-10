import { getDownloadURL, getStorage, ref,uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
const PropertyList = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
    const [imageUploadError,setImageUploadError] = useState(false);
    const [files,setFiles] = useState([]);
    const [error,setError] = useState('');
    const [Progress,setProgress] = useState('');
    const [loading,setLoading] = useState(false);
    console.log(files);
    const [formData,setFormData] = useState({
            imageUrls:[],
            name:'',
            description:'',
            address:'',
            type:'rent',
            bedrooms:1,
            bathrooms:1,
            regularPrice:0,
            discountPrice:0,
            offer:false,
            parking:false,
            furnished:false,
            
    });


    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
          setFormData({
            ...formData,
            type: e.target.id,
          });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
          });
        }
    
        if (
          e.target.type === 'number'||
          e.target.type === 'text' ||
          e.target.type === 'textarea'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          });
        }

        
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          
          console.log(currentUser);
          if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
          if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch('/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              useRef: currentUser._id,
            }),
          });
          console.log(JSON.stringify({
            ...formData,
            useRef:currentUser._id
          }));
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }

        } catch (error) {
          setError("error:"+ error.message);
          setLoading(false);
        }
      };
      
      

    const handleImageSubmit = (e) => {
        e.preventDefault();

        try {

            if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
                console.log('Condition met. Starting image upload...');
                setLoading(true);
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
                    setLoading(true);
                    setImageUploadError(false);
                });
            } else {
                console.log('Condition not met. Aborting image upload.');
            }
        } catch (error) {
            console.error('Error occurred during image upload:', error);
            setImageUploadError(true);
            setLoading(true);
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
                setProgress(progress);
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

    const handleRemove = async (index) => {
        try {
            const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                imageUrls: updatedUrls,
            });
        } catch (error) {
            console.error('Error occurred during image removal:', error);
        }
    };
    
  return (
    <div className='bg-gray-300 mx-auto justify-center items-center h-[85vh] min-w-4xl sm:flex-row flex flex-col gap-1 border-red-200 ' >
        <form onSubmit={handleSubmit}  className='flex p-3 rounded-lg flex-col gap-4 ' >
            <input onChange={handleChange} value={formData.name} id='name' placeholder='Name'  className='rounded-md outline-none h-[25px] p-3' required type="text" />
            <input onChange={handleChange} value={formData.address}  id='address' placeholder='address' className='rounded-md p-3 h-[25px] outline-none' required type="text" />
            <textarea onChange={handleChange} value={formData.description}  id='description' placeholder='description' className='rounded-md w-40 outline-none' required name="description"  cols="10" rows="2"></textarea>    

            <div className='flex  gap-4 flex-wrap sm:flex-row flex-row' >
    <div><input onChange={handleChange} checked={formData.type === 'sale'}  type="checkbox" className='m-4' id="sell" /><span>sell</span></div>
    <div><input onChange={handleChange} checked={formData.type === 'rent'}  type="checkbox" className='m-4' id="rent" /><span>rent</span></div>
    <div> <input onChange={handleChange} checked={formData.parking} type="checkbox" className='m-4' id="parking" /><span>parking</span></div>
    <div><input onChange={handleChange} checked={formData.furnished} type="checkbox" className='m-4' id="furnished" /><span>furnished</span></div>
    <div> <input onChange={handleChange}  checked={formData.offer} type="checkbox" className='m-4' id="offer" /><span>offer</span></div>
</div>


            <div className='flex gap-5 flex-wrap sm:flex-row'>
            <input value={formData.bedrooms} onChange={handleChange} type="number" className='w-[33%]' name="bed" id="bedrooms" />
            <input value={formData.bathrooms} onChange={handleChange} type="number" className='w-[33%]' name="bath" id="bathrooms" />
            <input value={formData.regularPrice} onChange={handleChange} type="number" className='w-[33%]' name="regualrPrice" id="regularPrice" />
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
            </div>
            <p><span className='font-bold' >Important</span>First image will be used as cover</p>

            <input multiple  onChange={(e)=>setFiles(e.target.files)} type="file" accept='image/*' name="image" id="image" />
            <button type='button' onClick={handleImageSubmit} className='border-[.4px] border-red-500' id="upload">Upload</button>
                {loading && <p>{Progress} Loading....</p> }
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>{
                   
                 return  <div key={index} ><img className="w-12 h-12"  src={url} alt="listing images"   /><button type='button' className='border-[2px]  border-black' onClick={()=>handleRemove(index)} >Delete</button></div>
})
            }
            <button type='submit' className="mt-4 text-center block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white 
       hover:opacity-95 shadow-sm shadow-black hover:shadow-black bg-green-900">create</button>
       {error && <p>{error}</p>}
        </form>
    </div>
  )
}

export default PropertyList;
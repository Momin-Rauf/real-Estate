import React from 'react'

const Loading = () => {
    console.log('loading');
  return (
    <div className='opacity-60 bg-black flex flex-col justify-center items-center absolute top-0 left-0 h-[120vh] w-full' >
        <span className='w-[100px] h-[100px] border-t-black border-l-black animate-spin  rounded-[50px] border-[4px] mb-6 bottom-[40%]  z-10 fixed' ></span>
        <div className='fixed text-white z-10' >Loading</div>
    </div>
  )
}

export default Loading
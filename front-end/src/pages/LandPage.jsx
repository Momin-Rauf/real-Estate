import React from 'react'
import {useEffect} from 'react';
import { useParams } from 'react-router-dom';

const LandPage = () => {
    const params = useParams();
    useEffect(()=>{
        const fetchData = async()=>{
        const res = await fetch(`/api/listing/get/${params.id}`)
        const data = await res.json();
        console.log(data);
        }
        fetchData();
    },[]);
  return (
    <div>LandPage</div>
  )
}

export default LandPage
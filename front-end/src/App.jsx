import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';  
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'; // Assuming this is the correct component name for signup
import About from './pages/About';
import Profile from './pages/Profile';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Header from './components/Header';
import Listing from './pages/Listing';
import PrivateProfile from './components/PrivateProfile';
import PropertyList from './pages/PropertyList';
import EditListing from './pages/EditListing';
import LandPage from './pages/LandPage';

function App() {
  return (
    <>
    <Header/>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        
        <Route path="/get/:id" element={<LandPage/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateProfile/>} >
          <Route path="/profile" element={<Profile />} />
          <Route path = '/create-list' element={<PropertyList/>} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route path='/editlist/:id' element={<EditListing/>} />

        </Route>
        
    </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;

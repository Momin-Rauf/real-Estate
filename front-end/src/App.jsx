import React from 'react';
import './index.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp'; // Assuming this is the correct component name for signup
import About from './components/About';
import Profile from './components/Profile';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

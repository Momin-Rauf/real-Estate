import React from 'react';
import './index.css';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'; // Assuming this is the correct component name for signup
import About from './pages/About';
import Profile from './pages/Profile';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <>
    <Header/>
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

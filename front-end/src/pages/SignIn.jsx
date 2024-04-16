import React, { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {signInStart,signInSuccess,signInfailure} from '../redux/user/userSlice.js';
import { useSelector,useDispatch } from "react-redux";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInfailure("Wrong Credentials"));
        console.log(error);
        return;
        }

      console.log("Signin successful:", data);
    dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInfailure(err.message));
    }   
  };
  return (
    <div>
      {loading && <Loading />}
      {/* Display loading indicator if loading state is true */}
      <form
        className="sm:text-lg sm:max-w-[100%] sm:bg-[#eadede] sm:py-3 sm:mt-5 sm:mx-[300px] sm:rounded-3xl sm:shadow-sm sm:shadow-black sm:flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl text-[#545454] text-center m-5">Sign in</h1>
        <input
          onChange={handleChange}
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm w-[100%] sm:w-[55%] outline-none shadow-md"
          type="email"
          id="email"
          placeholder="Email"
        />
        <input
          onChange={handleChange}
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm w-[100%] sm:w-[55%] outline-none shadow-md"
          type="password"
          id="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className="mt-4 block rounded-lg py-2 px-4 sm:ml-0 ml-4 text-white hover:shadow-md hover:bg-[#616060] shadow-sm shadow-black hover:shadow-black bg-[#545454]"
          id="signup"
        >
          Log in
        </button>
        {error && <p className="text-red-900 m-3">{error}</p>}
        <span>
          <p className="inline sm:ml-0 ml-4">Don't have an account?</p>
          <Link to={'/signup'} className="text-blue-900 sm:ml-0 ml-4 inline mx-2" href="">
            Login
          </Link>
        </span>
      </form>
    </div>

  )
}

export default SignIn
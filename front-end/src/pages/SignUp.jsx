import React, { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);
      setError(null);
      navigate('/login');
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loading />}{" "}
      {/* Display loading indicator if loading state is true */}
      <form
        className="sm:text-lg sm:max-w-[100%] sm:bg-[#eadede] sm:py-3 sm:mt-5 sm:mx-[300px] sm:rounded-3xl sm:shadow-sm sm:shadow-black sm:flex flex-col gap-5 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl text-[#545454] text-center m-5">Sign up</h1>
        <input
          onChange={handleChange}
          className="my-1 p-2 sm:ml-0 ml-4 rounded-lg text-sm w-[100%] sm:w-[55%] outline-none shadow-md"
          type="text"
          id="username"
          placeholder="Username"
        />
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
          Sign up
        </button>
        {error && <p className="text-red-900 m-3">{error}</p>}
        <span>
          <p className="inline sm:ml-0 ml-4">Already have an account?</p>
          <Link to={'/login'} className="text-blue-900 sm:ml-0 ml-4 inline mx-2" href="">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Log() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${VITE_API_BASE_URL}/api/auth/login`,
        loginData
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // STORE USER DATA
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login Successful!");

        setTimeout(() => {
          navigate("/blog");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]" />

      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            Login to continue exploring amazing features.
          </p>

          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md hover:border-slate-600/50 transition-all duration-300"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Login
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={loginData.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
          />

          {/* PASSWORD */}
          <div className="relative w-full mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ✅ FORGOT PASSWORD LINK */}
          <p className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              Forgot Password?
            </Link>
          </p>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
          >
            Login
          </button>

          {/* REGISTER LINK */}
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
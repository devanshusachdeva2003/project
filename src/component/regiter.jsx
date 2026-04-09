import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, username, email, password } = formData;

    if (!name || !username || !email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${VITE_API_BASE_URL}/api/auth/register`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration Successful! Check your email 📧");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Registration Failed";
      console.error("Registration Error:", error.response?.data);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Join Us
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Create your account and start your journey.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Register
          </h2>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-400 rounded-lg outline-none focus:border-indigo-500"
          />

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-400 rounded-lg outline-none focus:border-indigo-500"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-400 rounded-lg outline-none focus:border-indigo-500"
          />

          {/* PASSWORD */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-gray-400 rounded-lg outline-none focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 transition"
          >
            Register
          </button>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
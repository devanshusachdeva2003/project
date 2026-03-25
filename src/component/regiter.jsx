import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration Successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]" />

      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Join Us
          </h1>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            Create your account and start your journey with us.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Login
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
            Register
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
          >
            Register
          </button>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
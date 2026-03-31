import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/">
          <img src="/blog.png" alt="Logo" className="h-17 w-auto cursor-pointer" />
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-gray-300 font-medium">
          
         
          <Link 
            to="/register" 
            className="hover:text-white transition-colors duration-200"
          >
            Premium
          </Link>

        <Link 
            to="/register" 
            className="hover:text-white transition-colors duration-200"
          >
            Blog
          </Link>

         
          <select className="bg-transparent text-gray-300 outline-none hover:text-white cursor-pointer transition">
            <option className="text-black">Documentation</option>
            <option className="text-black">Support</option>
            <option className="text-black">Contact</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          
          <Link
            to="/login"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Log in
          </Link>

          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Nav;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlogApp from "./component/editor";
import PublicBlogs from "./component/Public";
import Hero from "./component/hero";
import Nav from "./component/nav";
import Register from "./component/regiter";
import Log from "./component/Login";
import AdminDashboard from "./component/admin";
import BlogDetails from "./component/blogdetail";
import SavedPosts from "./component/savedall";
import TrendingPosts from "./component/trending";
import EditProfile from "./component/editprofile";

import "./index.css";

const IsAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <Nav />
              <Hero />
              <PublicBlogs />
            </>
          }
        />

        <Route path="/blog" element={<BlogApp />} />
        <Route path="/login" element={<Log />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/edit-profile" element={<EditProfile />} />

        {/* SAVED POSTS PAGE */}
        <Route path="/trending" element={<TrendingPosts />} />
        <Route path="/saved" element={<SavedPosts />} />

        <Route
          path="/admin-dashboard"
          element={
            <IsAdminRoute>
              <AdminDashboard />
            </IsAdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
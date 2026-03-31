
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagePosts from "./post2";
import ManageUsers from "./manage";


export default function AdminDashboard() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  const currentUserId = user ? JSON.parse(user)._id : null;

  const navigate = useNavigate();

  // Verify current user's role on component mount and every 5 seconds
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (role !== "admin") {
      navigate("/blog");
      return;
    }

    // Verify role with backend
    const verifyRole = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        // If user's role is no longer admin, force logout
        if (data.role !== "admin") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          alert("Your role has been changed. Please log in again.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to verify role", err);
      }
    };

    verifyRole();
    const interval = setInterval(verifyRole, 5000);
    return () => clearInterval(interval);
  }, [token, role, navigate, VITE_API_BASE_URL]);

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      setPosts(
        data.map((p) => ({
          id: p._id,
          title: p.title,
          content: p.content,
          author: p.author,
        }))
      );
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }

    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Delete post
  const handleDeletePost = async (id) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchPosts();
    } catch {
      alert("Failed to delete post");
    }
  };

  // Edit post
  const handleEditPost = async (id, title, content) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Update failed");

      fetchPosts();
    } catch {
      alert("Failed to update post");
    }
  };

  // Create post
  const handleCreatePost = async (title, content) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Create failed");

      fetchPosts();
    } catch {
      alert("Failed to create post");
    }
  };

  // Create user (Admin)
  const handleCreateUser = async (name, email, password, username, role) => {
    try {
      console.log("🚀 Creating user:", { name, email, username, role });
      
      const res = await fetch(`${VITE_API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, username, role }),
      });

      const data = await res.json();
      console.log("📊 Response:", data);

      if (!res.ok) throw new Error(data.message || "Create user failed");

      alert("✅ User created successfully!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Create user error:", error);
      alert(error.message || "Failed to create user");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete user failed");

      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // Change role
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Role change failed");

      // If the current user's role is being changed, force logout
      if (id === currentUserId) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        alert("Your role has been changed. Please log in again.");
        navigate("/login");
      } else {
        fetchUsers();
      }
    } catch {
      alert("Failed to change role");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const goToBlogPage = () => {
    navigate("/blog");
  };

  return (
    <div className="min-h-screen flex bg-slate-900 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]" />

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 text-white flex flex-col p-8 h-screen sticky top-0 hover:border-slate-600/50 transition-all duration-300">

        <h1 className="text-3xl font-bold mb-12 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          <span>Admin</span>
        </h1>

        <nav className="flex flex-col space-y-3 flex-1">

          <button
            onClick={() => navigate("/")}
            className="text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 transform text-gray-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2"
          >
            🏠 Public Blogs
          </button>

          <button
            className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 transform ${
              activeTab === "posts"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            📝 Manage Posts
          </button>

          <button
            className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 transform ${
              activeTab === "users"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2"
            }`}
            onClick={() => setActiveTab("users")}
          >
            👥 Manage Users
          </button>

        </nav>

        {/* Logout button in sidebar */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-lg font-medium shadow-lg shadow-red-500/20 transition-all duration-300 transform hover:scale-105"
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            {activeTab === "posts" ? "Manage Posts" : "Manage Users"}
          </h2>
          <button
            onClick={goToBlogPage}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
          >
            📖 Go to Blog
          </button>
        </div>

        {error && <p className="text-red-400 mb-4 bg-red-500/20 border border-red-500/30 px-4 py-3 rounded-lg">{error}</p>}

        {activeTab === "posts" ? (
          <ManagePosts
            posts={posts}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            onCreate={handleCreatePost}
          />
        ) : (
          <ManageUsers
            users={users}
            onDelete={handleDeleteUser}
            onRoleChange={handleRoleChange}
            onCreate={handleCreateUser}
          />
        )}

      </div>

    </div>
  );
}

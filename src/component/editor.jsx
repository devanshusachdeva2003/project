import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getImageUrl } from "../utlis/image";
import NotificationPanel from "./notificationPanel";

// Function to decode HTML entities
const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};

import {
  Pencil,
  Trash2,
  PlusCircle,
  Loader2,
  Heart,
  Bookmark,
  MessageCircle,
  Search,
  LogOut,
  Bell,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Quill Dark Theme Styling
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const quillStyles = `
.quill-editor .ql-toolbar {
  background-color: rgb(51, 65, 85, 0.5) !important;
  border: 1px solid rgb(71, 85, 105, 0.5) !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  }
  .quill-editor .ql-container {
    background-color: rgb(51, 65, 85, 0.3) !important;
    border: 1px solid rgb(71, 85, 105, 0.5) !important;
    border-radius: 0 0 0.5rem 0.5rem !important;
    color: white !important;
    font-family: inherit;
  }
  .quill-editor .ql-editor {
    color: white !important;
    min-height: 200px;
  }
  .quill-editor .ql-editor p,
  .quill-editor .ql-editor ol,
  .quill-editor .ql-editor ul,
  .quill-editor .ql-editor li {
    color: white !important;
  }
  .quill-editor .ql-toolbar button:hover,
  .quill-editor .ql-toolbar button.ql-active {
    color: #818cf8 !important;
  }
  .quill-editor .ql-toolbar button {
    color: rgb(209, 213, 219) !important;
  }
  .quill-editor .ql-snow .ql-stroke {
    stroke: rgb(209, 213, 219) !important;
  }
  .quill-editor .ql-snow .ql-fill,
  .quill-editor .ql-snow .ql-stroke.ql-fill {
    fill: rgb(209, 213, 219) !important;
  }
  .quill-editor .ql-editor.ql-blank::before {
    color: rgb(107, 114, 128) !important;
  }
  .quill-editor .ql-picker-label {
    color: rgb(209, 213, 219) !important;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = quillStyles;
  document.head.appendChild(style);
}

export default function BlogEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
const [activePage, setActivePage] = useState("home");
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
// PROFILE
const [profile, setProfile] = useState({
  username: "",
  name: "",
  joined: "",
  avatar: "", // ✅ ADD THIS
});
const [isEditOpen, setIsEditOpen] = useState(false);
const [editName, setEditName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  const currentUserId = user ? JSON.parse(user)._id : null;
  const quillRef = useRef(null);
  
  // 🔥 CRITICAL: Get userId - Multiple fallback sources
  let userId = localStorage.getItem("userId");
  
  // Fallback 1: Get from user object stored in localStorage
  if (!userId) {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      if (userObj && userObj._id) {
        userId = userObj._id;
      }
    } catch (e) {
    }
  }

  // Verify current user's role on component mount and every 5 seconds
  useEffect(() => {
    if (!token) return;

    const verifyRole = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        // If role has changed, force logout
        if (data.role !== role) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          alert("Your role or permissions have changed. Please log in again.");
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



  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const updated = data.map((post) => ({
        ...post,
        isSaved: post.saves?.some((id) => id.toString() === userId),
      }));

      setBlogPosts(updated);
      setFilteredPosts(updated);
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

// 1️⃣ Load posts + profile on first load
useEffect(() => {
  fetchPosts();
  fetchProfile();
}, [fetchPosts]);

// 2️⃣ Reload profile when page changes (VERY IMPORTANT)
useEffect(() => {
  fetchProfile();
}, [activePage]);
// FETCH PROFILE
const fetchProfile = async () => {
  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setProfile({
      username: data.username || "user",
      name: data.name || "User",
      joined: new Date(data.createdAt).toLocaleDateString(),
      avatar: data.avatar?.startsWith("http")
  ? data.avatar
  : `${VITE_API_BASE_URL}${data.avatar}`
    });
    // ✅ ALSO UPDATE LOCALSTORAGE
    localStorage.setItem("user", JSON.stringify(data));

  } catch (err) {
    console.error("Failed to load profile:", err);
    toast.error("Failed to load profile");
  }
};
  // ---------------- TOPIC FILTER ----------------
  useEffect(() => {
    if (activeTopic === "all") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter((post) => post.topic === activeTopic));
    }
  }, [activeTopic, blogPosts]);

 
  // ---------------- SEARCH ----------------
  const handleSearch = () => {
  const result = blogPosts.filter((post) => {
    const title = post?.title?.toLowerCase() || "";
    const content = post?.content?.toLowerCase() || "";
    const author = post?.author?.toLowerCase() || "";

    const search = searchText.toLowerCase();

    return (
      title.includes(search) ||
      content.includes(search) ||
      author.includes(search)
    );
  });

  setFilteredPosts(result);
};
  // ---------------- CREATE / EDIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("You must be logged in to publish a blog");
      navigate("/login");
      return;
    }

    if (!title || !content) {
      toast.error("Title and content required");
      return;
    }

    const url = editingId
      ? `${VITE_API_BASE_URL}/api/blog/${editingId}`
      : `${VITE_API_BASE_URL}/api/blog`;

    const method = editingId ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("topic", topic);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      console.log("🚀 Submitting blog to:", url);
      console.log("📝 Method:", method);
      console.log("🔐 Token:", token ? "✅ Present" : "❌ Missing");
      console.log("📸 Cover Image:", coverImage ? "✅ Yes" : "❌ No");

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      console.log("📊 Response Status:", res.status);
      
      const responseData = await res.json();
      console.log("✉️ API Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      toast.success(editingId ? "✅ Post Updated" : "✅ Post Published");

      setTitle("");
      setContent("");
      setTopic("");
      setCoverImage(null);
      setCoverPreview("");
      setEditingId(null);

      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.setContents([], "silent");
      }
      
      console.log("🔄 Refreshing posts...");
      fetchPosts();
    } catch (error) {
      console.error("❌ Blog save error:", error);
      toast.error(error.message || "Save failed");
    }
  };

  // ---------------- DELETE ----------------
  const deletePost = async (id) => {
    if (!window.confirm("Delete post?")) return;

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------- EDIT ----------------
  const startEdit = (post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setTopic(post.topic || "");
    setContent(post.content);
    if (post.coverImage)
      setCoverPreview(getImageUrl(post.coverImage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- LIKE ----------------
  const likePost = async (postId) => {
    try {
      await fetch(`${VITE_API_BASE_URL}/api/blog/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setFilteredPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const liked = p.likes?.includes(userId);
            return {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== userId)
                : [...(p.likes || []), userId],
            };
          }
          return p;
        }),
      );
    } catch {
      toast.error("Like failed");
    }
  };

  // ---------------- SAVE ----------------
 const savePost = async (id) => {
  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Cannot save post");
      return;
    }

    setFilteredPosts((prev) =>
      prev.map((post) =>
        post._id === id
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );

    toast.success("Post save toggled");
  } catch (err) {
    toast.error("Save failed");
  }
};

  // ---------------- COMMENT ----------------
  const addComment = async () => {
    if (!commentText || !selectedPostId) return;

    try {
      await fetch(`${VITE_API_BASE_URL}/api/blog/${selectedPostId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      toast.success("Comment added");
      setCommentText("");
      setSelectedPostId(null);
      fetchPosts();
    } catch {
      toast.error("Comment failed");
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const topics = [
    "all",
    ...new Set(blogPosts.map((p) => p.topic).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 shadow-lg p-8 hidden md:flex flex-col fixed h-screen left-0">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-12 hover:scale-105 transition-transform">
            DS Blog
          </h1>

          <nav className="space-y-3 flex-1 text-gray-400">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-700/50 hover:text-indigo-400 hover:border-l-4 hover:border-indigo-500 transition-all duration-300 transform hover:translate-x-1 border-l-4 border-transparent font-medium"
            >
              <span className="text-xl">🏠</span>
              <span>Public Blogs</span>
            </button>

            <button
              onClick={() => navigate("/trending")}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-700/50 hover:text-indigo-400 hover:border-l-4 hover:border-indigo-500 transition-all duration-300 transform hover:translate-x-1 border-l-4 border-transparent font-medium"
            >
              <span className="text-xl">🔥</span>
              <span>Trending</span>
            </button>

            {role === "user" && (
              <button
                onClick={() => navigate("/saved")}
                className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-700/50 hover:text-indigo-400 hover:border-l-4 hover:border-indigo-500 transition-all duration-300 transform hover:translate-x-1 border-l-4 border-transparent font-medium"
              >
                <span className="text-xl">💾</span>
                <span>Saved</span>
              </button>
            )}

            {role === "admin" && (
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 border-2 border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:translate-x-1 font-semibold"
              >
                <span className="text-xl">⚙️</span>
                <span>Admin Panel</span>
              </button>
            )}

            {/* PROFILE CARD */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border-2 border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/20 shadow-md transition-all duration-300 transform hover:scale-105">
              <img
                src={
                  profile.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-3 ring-indigo-500"
              />
              <p className="text-center text-sm font-bold text-white truncate">
                @{profile.username || "user"}
              </p>
              <button
                onClick={() => navigate("/edit-profile")}
                className="w-full mt-4 px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </nav>

          {/* LOGOUT */}
          <div className="pt-6 border-t border-slate-700/50">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 hover:border-l-4 hover:border-red-500 rounded-lg transition-all duration-300 transform hover:translate-x-1 border-l-4 border-transparent font-semibold">
                  <LogOut size={18} />
                  Logout
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-slate-800 border-2 border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Logout Confirmation</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to logout from your account?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600 border border-slate-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={logout}
                    className="bg-red-600 text-white hover:bg-red-700 border border-red-700"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 ml-64 p-10 max-w-6xl">
          {/* SEARCH BAR + NOTIFICATION */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-slate-800/50 backdrop-blur-lg border-2 border-slate-700/50 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-500/20 shadow-md">
              <Search className="w-5 h-5 text-indigo-400 ml-4" />
              <input
                type="text"
                placeholder="Search blogs, authors, topics..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 px-4 py-4 bg-transparent outline-none text-white placeholder-gray-500 font-medium"
              />
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-4 font-bold transition-all duration-300 transform hover:scale-105 shadow-md shadow-indigo-500/30 border border-indigo-600"
              >
                Search
              </button>
            </div>

            {/* NOTIFICATION BUTTON */}
            <button
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg shadow-lg shadow-indigo-500/40 transition-all duration-300 transform hover:scale-110 border-2 border-indigo-600"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                🔔
              </span>
            </button>
          </div>

          {/* TOPIC TABS */}
          <div className="mb-12 flex gap-2 overflow-x-auto pb-2">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTopic(t)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 whitespace-nowrap ${
                  activeTopic === t
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/50"
                    : "bg-slate-800/50 text-gray-300 hover:text-white border border-slate-700/50 hover:border-indigo-500/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* CREATE / EDIT FORM */}
          {(role === "admin" || role === "user") && (
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl mb-12 hover:border-slate-600/50 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6">
                {editingId ? "✏️ Edit Post" : "✨ Create New Post"}
              </h2>
              <input
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-4 mb-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
              />
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white p-4 mb-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
              >
                <option value="">Select Topic</option>
                <option value="Technology">Technology</option>
                <option value="React">React</option>
                <option value="AI">AI</option>
                <option value="Programming">Programming</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setCoverImage(file);
                  if (file) setCoverPreview(URL.createObjectURL(file));
                }}
                className="w-full bg-slate-700/50 border border-slate-600/50 text-gray-300 p-4 mb-4 rounded-lg transition-all duration-300 hover:border-slate-500/50"
              />
              {coverPreview && (
                <img
                  src={coverPreview}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
              )}
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
                theme="snow"
                modules={quillModules}
                placeholder="Write your post content here..."
                className="mb-4 quill-editor"
              />
              <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/50">
                <PlusCircle size={20} />
                {editingId ? "Update Post" : "Publish Post"}
              </button>
            </form>
          )}

          {/* POSTS LIST */}
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Loading posts...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">📭 No posts found</p>
              <p className="text-gray-500 mt-2">Be the first to create one!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/blog/${post._id}`)}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-lg border border-slate-700/50 hover:border-indigo-500/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                 <div className="w-full">
                    {/* LEFT: Text */}
                    <div className="w-full">
                      <p className="text-xs text-gray-400 mb-2">
                        👤 {post.author || "Anonymous"} · 📅{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-3">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mb-4 text-sm line-clamp-3 break-words overflow-hidden w-full max-w-full">
                        {post?.content
                          ? decodeHtmlEntities(String(post.content)).replace(/<[^>]*>?/gm, "").slice(0, 150) + "..."
                          : "No content"}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        {post.topic && (
                          <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 rounded-full text-xs font-semibold">
                            #{post.topic}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">❤️ {post.likes?.length || 0}</span>
                        <span className="text-sm text-gray-500">💬 {post.comments?.length || 0}</span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            likePost(post._id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-red-600/30 text-gray-300 hover:text-red-400 rounded-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <Heart
                            size={16}
                            color={post.likes?.includes(userId) ? "red" : "currentColor"}
                            fill={post.likes?.includes(userId) ? "red" : "none"}
                          />
                          Like
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            savePost(post._id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-blue-600/30 text-gray-300 hover:text-blue-400 rounded-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <Bookmark size={16} />
                          {post.isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPostId(post._id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-purple-600/30 text-gray-300 hover:text-purple-400 rounded-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <MessageCircle size={16} />
                          Comment
                        </button>

                        {/* EDIT & DELETE - NOW SHOULD WORK FOR USERS */}
                        {(() => {
                          if (role === "admin") {
                            return true;
                          }
                          if (!userId) {
                            return false;
                          }
                          const authorIdStr = String(post.authorId).trim();
                          const userIdStr = String(userId).trim();
                          return authorIdStr === userIdStr;
                        })() && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(post);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-indigo-200 rounded-lg transition-all duration-300 transform hover:scale-110 border border-indigo-500/30"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePost(post._id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-red-200 rounded-lg transition-all duration-300 transform hover:scale-110 border border-red-500/30"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>

                      {/* COMMENTS */}
                      {selectedPostId === post._id && (
                        <div
                          className="mt-4 flex gap-3 p-4 bg-slate-700/30 rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 bg-slate-600/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded transition-all duration-300"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addComment();
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* NOTIFICATION PANEL */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />

      <ToastContainer theme="dark" />
    </div>
  );
}
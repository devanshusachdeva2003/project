import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Bookmark } from "lucide-react";
import { toast } from "react-toastify";
import { getImageUrl } from "../utlis/image";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ---------------- FETCH SAVED POSTS ----------------
  const fetchSavedPosts = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/saved/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await res.json();
      setSavedPosts(data);
    } catch (err) {
      toast.error("Failed to fetch saved posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  // ---------------- UNSAVE POST ----------------
  const unsavePost = async (postId) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${postId}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unsave failed");

      setSavedPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post removed from saved");
    } catch (err) {
      toast.error("Unsave failed");
    }
  };

  // ---------------- LOADING ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400 w-8 h-8" />
      </div>
    );
  }

  // ---------------- EMPTY ----------------
  if (savedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <p className="text-center text-gray-400 text-xl">
          You have no saved posts
        </p>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 p-10">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Saved Posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => {
            
            // 🔥 Remove inline black styles
            const cleanContent = post.content
              ?.replace(/color:\s*black[^;"]*;?/gi, "");

            return (
              <div
                key={post._id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl flex flex-col h-full shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
              >
                {/* Topic */}
                {post.topic && (
                  <p className="text-xs text-indigo-400 font-semibold mb-2">
                    #{post.topic}
                  </p>
                )}

                {/* Image */}
                {post.coverImage && (
                  <img
                    src={getImageUrl(post.coverImage)}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                    alt="cover"
                  />
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-2 break-words">
                  {post.title}
                </h2>

                {/* ✅ FIXED CONTENT (FORCED WHITE) */}
                <div
                  className="mb-4 text-sm line-clamp-3 overflow-hidden break-words w-full max-w-full [&_*]:!text-white"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: cleanContent || "",
                  }}
                />

                {/* Button */}
                <div className="mt-auto mb-4">
                  <Link
                    to={`/blog/${post._id}`}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    View More
                  </Link>
                </div>

                {/* Unsave */}
                <div className="flex gap-6 mt-2">
                  <button
                    onClick={() => unsavePost(post._id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Bookmark size={18} />
                    Unsave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // FETCH BLOG
  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBlog(data);
    } catch {
      // Error loading blog
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // ADD COMMENT (USER ONLY - ADMIN BLOCKED IN BACKEND)
  const addComment = async () => {
    if (!commentText) return;

    try {
      await fetch(`http://localhost:5000/api/blog/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      setCommentText("");
      fetchBlog();
    } catch {
      // Comment failed
    }
  };

  // DELETE COMMENT (ADMIN)
  const deleteComment = async (commentId) => {
    try {
      if (!window.confirm("Delete this comment?")) return;

      await fetch(
        `http://localhost:5000/api/blog/${id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update UI instantly
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch {
      // Delete failed
    }
  };

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="text-lg text-gray-400">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 mb-8">
          {/* Cover Image */}
          {blog.coverImage && (
            <img
              src={`http://localhost:5000${blog.coverImage}`}
              alt="blog cover"
              className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg shadow-indigo-500/20"
            />
          )}

          {/* Topic */}
          {blog.topic && (
            <p className="text-sm text-indigo-400 font-semibold mb-3 inline-block px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full">
              #{blog.topic}
            </p>
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6">
            {blog.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-4 text-gray-400 mb-8 pb-8 border-b border-slate-700/50">
            <span className="text-gray-300">
              By <span className="font-semibold text-white">{blog.author}</span>
            </span>
            <span>·</span>
            <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none text-gray-300 mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* ================= COMMENTS SECTION ================= */}
        {role === "admin" && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Comments
            </h2>

            {/* Add Comment */}
            <div className="flex gap-3 mb-8" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addComment();
                }}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Post
              </button>
            </div>

            {/* Show Comments */}
            {blog.comments && blog.comments.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-700/30 border border-slate-600/50 p-4 rounded-lg flex justify-between items-start hover:border-slate-600/80 transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <p className="text-gray-200">{c.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {c.username || "User"} · {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComment(c._id);
                      }}
                      className="ml-4 text-red-400 hover:text-red-300 transition-colors duration-300 hover:bg-red-600/20 p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No comments yet</p>
            )}
          </div>
        )}
        {/* ===================================================== */}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import parse from "html-react-parser";

export default function BlogDetails() {
  const { id } = useParams();
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // FETCH BLOG
  const fetchBlog = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBlog(data);
    } catch {}
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // ADD COMMENT
  const addComment = async () => {
    if (!commentText) return;

    try {
      await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      setCommentText("");
      fetchBlog();
    } catch {}
  };

  // DELETE COMMENT
  const deleteComment = async (commentId) => {
    try {
      if (!window.confirm("Delete this comment?")) return;

      await fetch(
        `${VITE_API_BASE_URL}/api/blog/${id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch {}
  };

  // 🔥 CLEAN HTML CONTENT (REMOVE INLINE COLORS)
  const cleanContent =
    blog &&
    parse(blog.content, {
      replace: (domNode) => {
        if (domNode.attribs) {
          delete domNode.attribs.style;
          delete domNode.attribs.color;
        }
      },
    });

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="text-lg text-gray-400">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Main Content Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 mb-8">
          
          {/* Cover */}
          {blog.coverImage && (
            <img
              src={`${VITE_API_BASE_URL}${blog.coverImage}`}
              alt="blog cover"
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          {/* Topic */}
          {blog.topic && (
            <p className="text-sm text-indigo-400 mb-3">
              #{blog.topic}
            </p>
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-6">
            {blog.title}
          </h1>

          {/* Author */}
          <div className="flex gap-4 text-gray-400 mb-8 border-b pb-6">
            <span>
              By <span className="text-white">{blog.author}</span>
            </span>
            <span>·</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* ✅ Blog Content (FIXED) */}
          <div
            className="
              prose max-w-none mb-12
              [&_*]:!text-white
              break-words
              [overflow-wrap:anywhere]
              prose-pre:overflow-x-auto
              prose-img:max-w-full
            "
          >
            {cleanContent}
          </div>

        </div>

        {/* ================= COMMENTS ================= */}
        {role === "admin" && (
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8">
            
            <h2 className="text-2xl font-bold text-white mb-6">
              Comments
            </h2>

            {/* Add comment */}
            <div className="flex gap-3 mb-8">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-700 border p-3 rounded-lg text-white"
              />
              <button
                onClick={addComment}
                className="bg-indigo-600 px-6 py-3 rounded-lg text-white"
              >
                Post
              </button>
            </div>

            {/* Comments list */}
            {blog.comments?.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-700 p-4 rounded-lg flex justify-between"
                  >
                    <div>
                      <p className="text-white">{c.text}</p>
                      <p className="text-xs text-gray-400">
                        {c.username} · {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button onClick={() => deleteComment(c._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No comments yet</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
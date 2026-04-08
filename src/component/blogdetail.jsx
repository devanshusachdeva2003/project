import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, UserPlus, UserMinus, Loader2 } from "lucide-react";
import parse from "html-react-parser";
import { getImageUrl } from "../utlis/image";
import { followUser, unfollowUser } from "../utlis/followService";
import { toast } from "react-toastify";

// Function to decode HTML entities
const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};

export default function BlogDetails() {
  const { id } = useParams();
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [authorId, setAuthorId] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const currentUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // FETCH BLOG
 const fetchBlog = async () => {
  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    setBlog(data);

    // ✅ ADD THIS BLOCK HERE
    if (data.authorId) {
      setAuthorId(data.authorId);

      if (currentUser && Array.isArray(data.followers)) {
        const isUserFollowing = data.followers.some(
          (followerId) => followerId === currentUser._id
        );
        setIsFollowing(isUserFollowing);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    fetchBlog();
  }, [id]);

  // HANDLE FOLLOW
  const handleFollow = async () => {
    if (!token) {
      toast.error("Please login to follow users");
      return;
    }

    if (!authorId) {
      toast.error("Author information not available");
      return;
    }

    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowUser(authorId, token);
        setIsFollowing(false);
        toast.success("Unfollowed successfully");
      } else {
        await followUser(authorId, token);
        setIsFollowing(true);
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    } finally {
      setIsLoadingFollow(false);
    }
  };

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

  // 🔥 CLEAN HTML CONTENT (REMOVE INLINE COLORS & DECODE ENTITIES)
  const cleanContent =
    blog &&
    parse(decodeHtmlEntities(blog.content), {
      replace: (domNode) => {
        if (domNode.attribs) {
          delete domNode.attribs.style;
          delete domNode.attribs.color;
        }
      },
    });

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <div className="text-lg text-gray-400 font-semibold">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]"></div>

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-10">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-lg transition-colors duration-300"
        >
          <ArrowLeft size={24} />
          Back
        </button>

        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-2 border-slate-700/50 shadow-2xl shadow-indigo-500/20 rounded-2xl p-10 mb-10">
          {/* Cover */}
          {blog.coverImage && (
            <img
              src={getImageUrl(blog.coverImage)}
              alt="blog cover"
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          )}

          {/* Topic */}
          {blog.topic && (
            <div className="inline-block bg-gradient-to-r from-indigo-600/20 to-blue-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-bold border border-indigo-500/30 mb-6">
              #{blog.topic}
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author with Follow Button */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-10 pb-8 border-b-2 border-blue-200">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 text-gray-700 font-semibold">
                <span>
                  By <span className="text-blue-600 font-bold text-lg">{blog.author}</span>
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Follow Button - Only show if not viewing own blog */}
            {currentUser && authorId && currentUser._id !== authorId && (
              <button
                onClick={handleFollow}
                disabled={isLoadingFollow}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 border-2 text-lg ${
                  isFollowing
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/40 border-red-600"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/40 border-indigo-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoadingFollow ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserMinus size={20} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          {/* ✅ Blog Content (FIXED) */}
          <div
            className="
              prose max-w-none mb-12
              [&_*]:!text-gray-200
              break-words
              [overflow-wrap:anywhere]
              prose-pre:overflow-x-auto
              prose-img:max-w-full
              [&_p]:break-words
              [&_h1]:break-words
              [&_h2]:break-words
              [&_h3]:break-words
              [&_a]:text-blue-600
              [&_a]:hover:text-blue-700
              [&_a]:font-semibold
              [&_code]:bg-blue-100
              [&_code]:text-blue-700
              [&_code]:px-2
              [&_code]:py-1
              [&_code]:rounded
              overflow-hidden
              text-lg
              leading-relaxed
              text-gray-800
            "
          >
            {cleanContent}
          </div>

        </div>

        {/* ================= COMMENTS ================= */}
        {role === "admin" && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-2 border-slate-700/50 shadow-2xl shadow-indigo-500/20 rounded-2xl p-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent mb-8 pb-6 border-b-2 border-slate-700/50">
              Comments Section
            </h2>

            {/* Add comment */}
            <div className="mb-10 bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-6 rounded-xl border-2 border-slate-700/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Write a thoughtful comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-700/50 border-2 border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 font-medium"
                />
                <button
                  onClick={addComment}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-8 py-4 rounded-lg text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/40 border-2 border-indigo-600"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments list */}
            {blog.comments?.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-l-4 border-indigo-500/50 p-6 rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-gray-200 font-semibold mb-2">{c.text}</p>
                      <p className="text-sm text-gray-600 font-medium">
                        <span className="text-blue-600 font-bold">{c.username}</span> · {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteComment(c._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200 font-bold"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-lg font-semibold">💬 No comments yet. Be the first to engage!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

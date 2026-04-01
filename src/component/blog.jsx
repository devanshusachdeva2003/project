import { useEffect, useState } from "react";
import { Heart, Bookmark, MessageCircle, Send } from "lucide-react";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  
  // FETCH POSTS
  const fetchPosts = () => {
    fetch(`${VITE_API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // LIKE POST
  const likePost = async (id) => {
    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPosts();
  };

  // SAVE POST
  const savePost = async (id) => {
    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPosts();
  };

  // COMMENT POST
  const addComment = async (id) => {
    if (!commentText.trim()) return;

    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    setCommentText("");
    fetchPosts();
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          My Blog Posts
        </h1>
        <p className="text-gray-600 text-lg">Engage with your community through meaningful discussions</p>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-4xl mx-auto space-y-8">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600 font-semibold">No blog posts yet. Start creating!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:border-indigo-300"
            >
              {/* Post Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 px-8 py-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  By <span className="text-blue-600 font-bold">{post.author}</span>
                </p>
              </div>

              {/* Post Content */}
              <div className="px-8 py-8">
                <p className="text-gray-700 text-base leading-relaxed line-clamp-4 mb-6">
                  {post.content}
                </p>

                {/* Engagement Stats */}
                <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b-2 border-blue-100">
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <Heart size={20} className="text-red-600" />
                    <span className="font-bold text-gray-800 text-lg">{post.likes?.length || 0}</span>
                    <span className="text-gray-600">Likes</span>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                    <Bookmark size={20} className="text-amber-600" />
                    <span className="font-bold text-gray-800 text-lg">{post.saves?.length || 0}</span>
                    <span className="text-gray-600">Saves</span>
                  </div>

                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                    <MessageCircle size={20} className="text-blue-600" />
                    <span className="font-bold text-gray-800 text-lg">{post.comments?.length || 0}</span>
                    <span className="text-gray-600">Comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => likePost(post._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md border border-red-600"
                  >
                    <Heart size={20} />
                    Like
                  </button>

                  <button
                    onClick={() => savePost(post._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md border border-amber-600"
                  >
                    <Bookmark size={20} />
                    Save
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md border border-blue-600"
                  >
                    <MessageCircle size={20} />
                    {expandedComments[post._id] ? "Hide" : "Show"} Comments
                  </button>
                </div>

                {/* Comment Input */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 mb-8">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addComment(post._id)}
                      className="flex-1 bg-white border-2 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-blue-200/50 font-medium"
                    />
                    <button
                      onClick={() => addComment(post._id)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md border border-blue-700 flex items-center gap-2"
                    >
                      <Send size={18} />
                      Post
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments[post._id] && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-blue-200 p-6 space-y-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle size={20} className="text-blue-600" />
                      Comments ({post.comments?.length || 0})
                    </h4>
                    
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment, i) => (
                        <div
                          key={i}
                          className="bg-white border-l-4 border-blue-400 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <p className="font-bold text-blue-600 mb-1">{comment.username}</p>
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center py-4">No comments yet. Be the first!</p>
                    )}
                  </div>
                )}
            </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Blog;
```

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
export default function TrendingPosts() {
  const [posts, setPosts] = useState([]);
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // Fetch trending posts when the component is mounted
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        // Fetch all blog posts
        const res = await fetch(`${VITE_API_BASE_URL}/api/blog`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Handle invalid token or other fetch errors
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();

        // Sort posts by number of likes (descending) and pick top 10
        const trending = data
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 10); // Top 10 trending posts based on likes

        setPosts(trending); // Set the state with the trending posts
      } catch (error) {
        toast.error("Failed to fetch trending posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending(); // Call the fetchTrending function when component mounts
  }, [token]);

  // If loading, show a loader
  if (isLoading) return <Loader2 className="animate-spin text-center mt-10 mx-auto" />;

  // If there are no trending posts
  if (posts.length === 0) return <div className="text-center text-gray-500 text-xl mt-10">No trending posts</div>;

  // Render the trending posts
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl hover:border-slate-600/50 transition-all duration-300 transform hover:scale-105 flex flex-col shadow-xl hover:shadow-indigo-500/20">
            {post.topic && <p className="text-xs text-indigo-400 font-semibold mb-2">#{post.topic}</p>}
            {post.coverImage && <img src={`${VITE_API_BASE_URL}${post.coverImage}`} className="w-full h-60 object-cover rounded-lg mb-4" alt="cover" />}
            <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-4">{post.content.replace(/<[^>]*>?/gm, "").slice(0, 150)}...</p>
            <div className="mt-auto mb-4">
              <Link
                to={`/blog/${post._id}`}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                View More
              </Link>
            </div>
            <p className="text-sm text-indigo-300">{post.likes?.length || 0} Likes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getImageUrl } from "../utlis/image";

export default function TrendingPosts() {
  const [posts, setPosts] = useState([]);
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${VITE_API_BASE_URL}/api/blog`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        const trending = data
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 10);

        setPosts(trending);
      } catch {
        toast.error("Failed to fetch trending posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, [token, VITE_API_BASE_URL]);

  if (isLoading) {
    return (
      <Loader2 className="animate-spin text-center mt-10 mx-auto text-white" />
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400 text-xl mt-10">
        No trending posts
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="relative z-10 p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {posts.map((post) => {
          // 🔥 Clean unwanted inline color styles
          const cleanContent = post.content
            ?.replace(/color:\s*black[^;"]*;?/gi, "");

          return (
            <div
              key={post._id}
              className="bg-slate-800/50 p-6 rounded-2xl flex flex-col h-full hover:scale-[1.02] transition"
            >
              {/* Topic */}
              {post.topic && (
                <p className="text-xs text-indigo-400 mb-2">
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
              <h2 className="text-xl font-bold mb-2 break-words">
                {post.title}
              </h2>

              {/* ✅ Content (FORCED WHITE) */}
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
              <div className="mt-auto">
                <Link
                  to={`/blog/${post._id}`}
                  className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  View More
                </Link>
              </div>

              {/* Likes */}
              <p className="text-sm mt-3 text-gray-300">
                ❤️ {post.likes?.length || 0}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
}
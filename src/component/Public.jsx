import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utlis/image";
import parse from "html-react-parser";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to decode HTML entities
const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function PublicBlogs() {
  const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userName = user ? JSON.parse(user).name : "User";

 useEffect(() => {
    // Fetching the posts from the API
    fetch(`${VITE_API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => setPosts(data));

    const timer = setTimeout(() => {
      if (!token) navigate("/register")
    }, 40000);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const topics = ["all", "Technology", "React", "AI", "Programming"];
  const featured = posts[0];

  return (
    <div className="bg-slate-900 min-h-screen py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]" />

      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            📖 Blog Platform
          </h1>

          <div className="flex gap-4 items-center">
            {token ? (
              <>
                <span className="text-gray-300 font-semibold">
                  Welcome, <span className="text-indigo-400">{userName}</span>
                </span>
                <button
                  onClick={() => navigate("/blog")}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  📝 My Blog
                </button>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  👤 Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20">

        {/* PAGE TITLE */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Latest Articles
          </h1>

          <p className="text-gray-400 text-lg">
            Discover insights on technology, programming and AI
          </p>
        </div>

        {/* FEATURED BLOG */}
        {featured && (
          <div className="max-w-6xl mx-auto mb-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2 hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 border border-slate-700/50">

            {featured.coverImage && (
              <img
                src={getImageUrl(featured.coverImage)}
                alt={featured.title}
                className="w-full h-full object-cover md:h-[420px]"
              />
            )}

            <div className="p-10 flex flex-col justify-center">

              <span className="text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                {featured.topic}
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 leading-tight bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
                {featured.title}
              </h2>

              <p className="text-gray-400 mb-6 leading-relaxed">
  {(() => {
    const plainText = decodeHtmlEntities(featured?.content || "").replace(/<[^>]*>/g, "");
    return plainText.slice(0, 180) || "...";
  })()}
</p>
              <Link
                to={`/blog/${featured._id}`}
                className="inline-block w-fit bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
              >
                Read Full Article
              </Link>

            </div>
          </div>
        )}

        {/* TABS SECTION */}
        <Tabs defaultValue="all" className="w-full">
<Tabs defaultValue="all" className="w-full flex flex-col items-center">

  {/* TAB BUTTONS */}
  <TabsList className="flex flex-row justify-center gap-3 mb-12 w-auto bg-transparent">

    {topics.map((topic) => (
      <TabsTrigger
        key={topic}
        value={topic}
        className="px-6 py-2 rounded-full text-sm font-medium bg-slate-800/50 text-gray-300 border border-slate-700/50 hover:text-white transition-all duration-300 transform hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:border-indigo-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/30"
      >
        {topic}
      </TabsTrigger>
    ))}

  </TabsList>

  {/* BLOGS */}

  <TabsContent value="all" className="w-full">
    <BlogGrid posts={posts} />
  </TabsContent>

  {topics.slice(1).map((topic) => (
    <TabsContent key={topic} value={topic} className="w-full">
      <BlogGrid posts={posts.filter((p) => p.topic === topic)} />
    </TabsContent>
  ))}

</Tabs>

          {/* ALL BLOGS */}
          <TabsContent value="all">
            <BlogGrid posts={posts} />
          </TabsContent>

          {/* FILTERED BLOGS */}
          {topics.slice(1).map((topic) => (
            <TabsContent key={topic} value={topic}>
              <BlogGrid posts={posts.filter((p) => p.topic === topic)} />
            </TabsContent>
          ))}

        </Tabs>

      </div>
    </div>
  );
}

/* BLOG GRID */

function BlogGrid({ posts }) {

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-400 text-lg">
        No blogs found
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 flex flex-col h-full"
        >

          {post.coverImage && (
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-52 object-cover rounded-t-2xl"
            />
          )}

          <div className="p-6 flex flex-col flex-1">

            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wide">
              {post.topic}
            </span>

            <h2 className="font-bold text-xl mt-2 mb-3 line-clamp-2 text-white leading-tight">
              {post.title}
            </h2>

           <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
  {(() => {
    const plainText = decodeHtmlEntities(post?.content || "").replace(/<[^>]*>/g, "");
    return plainText.slice(0, 140) || "...";
  })()}
</p>
            <div className="flex justify-between items-center mt-auto">

              <span className="text-xs text-gray-500">
                By {post.author}
              </span>

             <Link to={`/blog/${post._id}`} className="text-indigo-400 font-semibold text-sm hover:text-indigo-300 transition">
  Read →
</Link>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}
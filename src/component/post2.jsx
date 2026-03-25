import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ManagePosts({ posts, onDelete, onEdit }) {

  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Filter posts whenever search text or posts change
  useEffect(() => {
    const result = posts.filter((post) =>
      (post.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (post.author || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPosts(result);
  }, [search, posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Manage Posts</h2>

        {/* SEARCH BAR */}
        <div className="mb-8 flex items-center gap-3 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-500/20">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder-gray-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-b border-slate-700/50">
              <th className="p-4 text-left text-indigo-300 font-semibold">Title</th>
              <th className="p-4 text-left text-indigo-300 font-semibold">Author</th>
              <th className="p-4 text-left text-indigo-300 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-gray-500 text-lg">
                  Item not found
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                  <td className="p-4 text-gray-300">{post.title}</td>
                  <td className="p-4 text-gray-300">{post.author}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => onEdit(post.id)}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
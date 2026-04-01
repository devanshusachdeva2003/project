import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Users, UserPlus, UserMinus } from "lucide-react";
import { getImageUrl } from "../utlis/image";
import { followUser, unfollowUser } from "../utlis/followService";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userRes = await fetch(
          `${VITE_API_BASE_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!userRes.ok) {
          throw new Error("User not found");
        }
        
        const userData = await userRes.json();
        setUser(userData);

        // Check if current user is following this user
        if (currentUser && currentUser._id !== userId) {
          const isUserFollowing = userData.followers?.includes(currentUser._id) || false;
          setIsFollowing(isUserFollowing);
        }

        // Fetch user's blogs
        const blogsRes = await fetch(`${VITE_API_BASE_URL}/api/blog`);
        if (blogsRes.ok) {
          const allBlogs = await blogsRes.json();
          const userBlogs = allBlogs.filter((blog) => blog.authorId === userId);
          setUserBlogs(userBlogs);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, token, currentUser]);

  const handleFollowToggle = async () => {
    if (!token || !currentUser) {
      navigate("/login");
      return;
    }

    try {
      setFollowLoading(true);
      if (isFollowing) {
        // Unfollow
        await unfollowUser(userId, token);
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== currentUser._id),
        }));
      } else {
        // Follow
        await followUser(userId, token);
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), currentUser._id],
        }));
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      alert(error.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="text-lg text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="text-lg text-gray-400">User not found</div>
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

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={getImageUrl(user.avatar)}
                  alt={user.name}
                  className="w-32 h-32 rounded-xl object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-400 mb-4">@{user.username}</p>

              {user.bio && (
                <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 mb-6">
                {user.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail size={18} className="text-indigo-400" />
                    <span>{user.email}</span>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={18} className="text-indigo-400" />
                    <span>
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Follow Stats */}
              <div className="flex gap-6 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-indigo-400" />
                  <span>
                    <span className="font-bold text-white">
                      {user.followers?.length || 0}
                    </span>{" "}
                    Followers
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-blue-400" />
                  <span>
                    <span className="font-bold text-white">
                      {user.following?.length || 0}
                    </span>{" "}
                    Following
                  </span>
                </div>
              </div>

              {/* Follow/Unfollow Button */}
              {currentUser && currentUser._id !== userId && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isFollowing
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/20"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/20"
                  } ${followLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus size={18} />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User's Blogs */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">
            Posts by {user.name}{" "}
            <span className="text-gray-400 text-lg">({userBlogs.length})</span>
          </h2>

          {userBlogs.length > 0 ? (
            <div className="grid gap-6">
              {userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition cursor-pointer group"
                >
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 line-clamp-2">
                    {blog.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">
                {user.name} hasn't published any posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams(); // user id from URL
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // get current logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);
  }, []);

  // fetch other user's profile
  const fetchUser = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/users/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  // check follow status (handle both populated objects and id strings)
  const isFollowing = user.followers?.some(
    (f) => (typeof f === "string" ? f : f._id?.toString()) === currentUser?._id
  );

  // follow
  const handleFollow = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/users/follow/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchUser(); // refresh
    else console.error("Failed to follow");
  };

  // unfollow
  const handleUnfollow = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/users/unfollow/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchUser(); // refresh
    else console.error("Failed to unfollow");
  };

  return (
    <div className="p-10 text-white">
      <img src={user.avatar} alt="" loading="lazy" className="w-24 h-24 rounded-full" />

      <h2>{user.name}</h2>
      <p>@{user.username}</p>
      <p>{user.bio}</p>

      <p>Followers: {user.followers?.length}</p>
      <p>Following: {user.following?.length}</p>

      {/* FOLLOW BUTTON */}
      {currentUser && currentUser._id !== id && (
        isFollowing ? (
          <button onClick={handleUnfollow}>
            Unfollow
          </button>
        ) : (
          <button onClick={handleFollow}>
            Follow
          </button>
        )
      )}
    </div>
  );
}
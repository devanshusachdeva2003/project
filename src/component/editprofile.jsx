import React, { useEffect, useState } from "react";
import { Lock, Upload } from "lucide-react";
import { followUser, unfollowUser } from "../utlis/followService";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });
  
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
  const [avatarFile, setAvatarFile] = useState(null);
  const [postCount, setPostCount] = useState(0); // ✅ blog count
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

  // helper: fetch user details for an array of ids (or pass through objects)
  const fetchUserDetails = async (items) => {
    const ids = items.map((i) => (typeof i === "string" ? i : i._id?.toString()));
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`${VITE_API_BASE_URL}/api/users/profile/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return null;
            return await res.json();
          } catch (err) {
            return null;
          }
        })
      );

      return results.filter(Boolean);
    } catch (err) {
      return [];
    }
  };

  // ✅ FETCH PROFILE (UPDATED API)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setProfile({
  name: data.name || "",
  username: data.username || "",
  email: data.email || "",
  bio: data.bio || "",
 avatar: data.avatar
  ? data.avatar.startsWith("http")
    ? data.avatar.replace("https//", "https://") // fix broken cloudinary
    : `${VITE_API_BASE_URL}${data.avatar}`       // local image
  : "",
});
        setPostCount(data.postCount || 0); // ✅ blog count
        setFollowers(data.followers || []);
        setFollowingList(data.following || []);
        // if followers/following are ids, fetch user details
        if (data.followers && data.followers.length > 0) {
          fetchUserDetails(data.followers).then(setFollowers).catch(()=>{});
        }
        if (data.following && data.following.length > 0) {
          fetchUserDetails(data.following).then(setFollowingList).catch(()=>{});
        }
      } catch {
        // Error loading profile
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ UPDATE PROFILE (UPDATED API + MULTER)
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("username", profile.username);
      formData.append("bio", profile.bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(`${VITE_API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      setProfile({
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
         avatar: data.avatar
  ? data.avatar.startsWith("http")
    ? data.avatar
    : `${VITE_API_BASE_URL}${data.avatar}`
  : "",
});
      setAvatarFile(null);
      localStorage.setItem("user", JSON.stringify(data));

      // update followers/following if returned (and fetch details if needed)
      setFollowers(data.followers || []);
      setFollowingList(data.following || []);
      if (data.followers && data.followers.length > 0) {
        fetchUserDetails(data.followers).then(setFollowers).catch(()=>{});
      }
      if (data.following && data.following.length > 0) {
        fetchUserDetails(data.following).then(setFollowingList).catch(()=>{});
      }

      alert("Profile Updated ✅");
    } catch (err) {
      alert("Update failed");
    }
  };

  // ✅ CHANGE PASSWORD (NO CHANGE)
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
        return;
      }

      alert("Password updated ✅");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      alert("Failed to update password");
    }
  };

  // follow/unfollow a user from the followers list (follow back)
  const toggleFollowBack = async (target) => {
    if (!token) return;

    const targetId = typeof target === "string" ? target : target._id?.toString() || target;

    const isFollowingTarget = (profile.following || []).some(
      (f) => (typeof f === "string" ? f : f._id?.toString()) === targetId
    );

    try {
      if (isFollowingTarget) {
        const res = await unfollowUser(targetId, token);
        // update local following list
        setProfile((prev) => ({
          ...prev,
          following: (prev.following || []).filter(
            (f) => (typeof f === "string" ? f : f._id?.toString()) !== targetId
          ),
        }));
        setFollowingList((prev) => prev.filter((u) => (u._id || u).toString() !== targetId));
      } else {
        const res = await followUser(targetId, token);
        // fetch user details and append
        const details = await fetchUserDetails([targetId]);
        if (details && details[0]) {
          setFollowingList((prev) => [...(prev || []), details[0]]);
        } else {
          setProfile((prev) => ({ ...prev, following: [...(prev.following || []), targetId] }));
        }
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 shadow-lg p-8 fixed h-screen hidden md:flex flex-col">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-10">
            Dashboard
          </h2>

          <nav className="space-y-3 flex-1 text-gray-600">
            <div className="hidden"></div>
            <div className="hidden"></div>

            <hr className="border-blue-200 my-6" />

            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-2 border-blue-300 shadow-sm font-medium">
              <span className="text-xl">✏️</span>
              <span>Edit Profile</span>
            </div>

            <div
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 text-gray-600 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200 font-medium"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 md:ml-64 p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-12">
            Edit Profile
          </h1>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-2 border-slate-700/50 shadow-xl p-10 rounded-2xl mb-8">
            {/* AVATAR SECTION */}
            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10 pb-10 border-b-2 border-blue-200">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={
                    profile.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-36 h-36 rounded-full object-cover border-4 border-blue-400 ring-4 ring-blue-100 shadow-lg hover:shadow-xl transition duration-300"
                />

                <p className="text-lg font-semibold text-gray-600 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200">
                  📝 {postCount} Blogs
                </p>

                <label className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-lg hover:shadow-indigo-500/20 px-6 py-3 rounded-lg cursor-pointer text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-indigo-600 shadow-md">
                  <Upload size={16} />
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarFile(file);
                        const url = URL.createObjectURL(file);
                        setProfile({ ...profile, avatar: url });
                      }
                    }}
                  />
                </label>
              </div>

              {/* INPUTS */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Full Name"
                  className="bg-slate-700/50 border-2 border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 font-medium"
                />

                <input
                  value={profile.email}
                  disabled
                  className="bg-slate-700/30 border-2 border-slate-600/30 text-gray-400 p-4 rounded-lg cursor-not-allowed font-medium"
                />

                <input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="@username"
                  className="bg-slate-700/50 border-2 border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 font-medium md:col-span-2"
                />
              </div>
            </div>

            {/* BIO */}
            <div className="mb-10">
              <label className="block text-gray-700 font-bold mb-3 text-lg">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                className="w-full bg-slate-700/50 border-2 border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 min-h-[140px] font-medium"
              />
            </div>

            {/* SAVE */}
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-10 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/40 border border-indigo-600 text-lg"
            >
              Save Changes
            </button>
          </div>

          {/* Followers list */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Followers ({followers?.length || 0})</h2>

            {followers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {followers.map((f) => {
                  const fid = typeof f === "string" ? f : f._id?.toString() || "";
                  const name = typeof f === "string" ? fid.slice(0, 6) : f.name || f.username || fid.slice(0, 6);
                  const avatar = typeof f === "string" ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : (f.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png");

                  const isFollowing = (profile.following || []).some(
                    (x) => (typeof x === "string" ? x : x._id?.toString()) === fid
                  );

                  return (
                    <div key={fid} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-lg">
                      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="font-semibold">{name}</div>
                        <div className="text-sm text-gray-400">@{(typeof f === 'object' && f.username) || fid.slice(0,8)}</div>
                      </div>
                      <button
                        onClick={() => toggleFollowBack(f)}
                        className={`px-3 py-1 rounded-lg font-medium ${isFollowing ? 'bg-red-600' : 'bg-indigo-600'}`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No followers yet.</p>
            )}
          </div>

          {/* Following list */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Following ({followingList?.length || 0})</h2>

            {followingList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {followingList.map((f) => {
                  const fid = typeof f === "string" ? f : f._id?.toString() || "";
                  const name = typeof f === "string" ? fid.slice(0, 6) : f.name || f.username || fid.slice(0, 6);
                  const avatar = typeof f === "string" ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : (f.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png");

                  return (
                    <div key={fid} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-lg">
                      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="font-semibold">{name}</div>
                        <div className="text-sm text-gray-400">@{(typeof f === 'object' && f.username) || fid.slice(0,8)}</div>
                      </div>
                      <button
                        onClick={() => toggleFollowBack(f)}
                        className={`px-3 py-1 rounded-lg font-medium bg-red-600`}
                      >
                        Unfollow
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">Not following anyone yet.</p>
            )}
          </div>

          {/* PASSWORD SECTION */}
          {showPassword && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-2 border-slate-700/50 shadow-xl p-10 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <Lock size={28} className="text-red-600" />
                Change Password
              </h2>

              <div className="grid gap-5 max-w-md">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                  className="bg-slate-700/50 border-2 border-slate-600/50 focus:border-red-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-500/20 font-medium"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="bg-slate-700/50 border-2 border-slate-600/50 focus:border-red-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-500/20 font-medium"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-slate-700/50 border-2 border-slate-600/50 focus:border-red-500 text-white placeholder-gray-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-500/20 font-medium"
                />

                <button
                  onClick={handleChangePassword}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/40 w-fit border border-red-700 text-lg mt-2"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
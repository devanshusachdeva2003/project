import React, { useEffect, useState } from "react";
import { Lock, Upload } from "lucide-react";

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

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

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
      ? data.avatar
      : `${VITE_API_BASE_URL}${data.avatar}`
    : "",
});
        setPostCount(data.postCount || 0); // ✅ blog count
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 p-6 fixed h-screen hidden md:flex flex-col">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Dashboard
          </h2>

          <nav className="space-y-4 flex-1 text-gray-300">
            <div className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-600/20 hover:text-indigo-300 transition-all duration-300 cursor-pointer">
              <span className="text-xl">📝</span>
              <span>Blogs</span>
            </div>

            <div className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-600/20 hover:text-indigo-300 transition-all duration-300 cursor-pointer">
              <span className="text-xl">🔔</span>
              <span>Notifications</span>
            </div>

            <hr className="border-slate-700/50 my-4" />

            <div className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
              <span className="text-xl">✏️</span>
              <span className="font-semibold">Edit Profile</span>
            </div>

            <div
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-600/20 hover:text-indigo-300 transition-all duration-300 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 md:ml-64 p-8 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Edit Profile
          </h1>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl mb-8">
            {/* AVATAR SECTION */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8 pb-8 border-b border-slate-700/50">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={
                    profile.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500/50 ring-2 ring-indigo-400"
                />

                <p className="text-sm text-gray-400">
                  {postCount} Blogs
                </p>

                <label className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-6 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
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
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Name"
                  className="bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                />

                <input
                  value={profile.email}
                  disabled
                  className="bg-slate-700/50 border border-slate-600/50 text-gray-400 p-3 rounded-lg cursor-not-allowed"
                />

                <input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="Username"
                  className="bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 md:col-span-2"
                />
              </div>
            </div>

            {/* BIO */}
            <div className="mb-8">
              <label className="block text-gray-300 font-semibold mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                className="w-full bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20 min-h-[120px]"
              />
            </div>

            {/* SAVE */}
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/50"
            >
              Save Changes
            </button>
          </div>

          {/* PASSWORD SECTION */}
          {showPassword && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                <Lock size={24} />
                Change Password
              </h2>

              <div className="grid gap-4 max-w-md">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                  className="bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
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
                  className="bg-slate-700/50 border border-slate-600/50 focus:border-indigo-500 text-white placeholder-gray-500 p-3 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-indigo-500/20"
                />

                <button
                  onClick={handleChangePassword}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 w-fit"
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
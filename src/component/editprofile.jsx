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
    ? data.avatar.replace("https//", "https://") // fix broken cloudinary
    : `${VITE_API_BASE_URL}${data.avatar}`       // local image
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-gradient-to-b from-white to-blue-50 backdrop-blur-lg border-r-2 border-blue-200 shadow-lg p-8 fixed h-screen hidden md:flex flex-col">
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

          <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-lg border-2 border-blue-200 shadow-xl p-10 rounded-2xl mb-8">
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

                <label className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg px-6 py-3 rounded-lg cursor-pointer text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-blue-700 shadow-md">
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
                  className="bg-white border-2 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-blue-200/50 font-medium"
                />

                <input
                  value={profile.email}
                  disabled
                  className="bg-gray-100 border-2 border-gray-300 text-gray-600 p-4 rounded-lg cursor-not-allowed font-medium"
                />

                <input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="@username"
                  className="bg-white border-2 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-blue-200/50 font-medium md:col-span-2"
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
                className="w-full bg-white border-2 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-blue-200/50 min-h-[140px] font-medium"
              />
            </div>

            {/* SAVE */}
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/40 border border-blue-700 text-lg"
            >
              Save Changes
            </button>
          </div>

          {/* PASSWORD SECTION */}
          {showPassword && (
            <div className="bg-gradient-to-br from-white to-red-50 backdrop-blur-lg border-2 border-red-200 shadow-xl p-10 rounded-2xl">
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
                  className="bg-white border-2 border-red-200 focus:border-red-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-200/50 font-medium"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="bg-white border-2 border-red-200 focus:border-red-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-200/50 font-medium"
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
                  className="bg-white border-2 border-red-200 focus:border-red-500 text-gray-900 placeholder-gray-400 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-lg focus:shadow-red-200/50 font-medium"
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
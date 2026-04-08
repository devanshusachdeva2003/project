import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !code || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (code.length !== 6) {
      toast.error("Code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("✅ " + data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error("❌ " + (err.message || "Reset failed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-center">🔐 Reset Password</h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter the code sent to your email
        </p>

        <form onSubmit={handleResetPassword}>
          {/* EMAIL */}
          <label className="block text-sm text-gray-400 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 mb-4 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* RESET CODE */}
          <label className="block text-sm text-gray-400 mb-2">Reset Code</label>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength="6"
            className="w-full p-3 mb-4 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500 transition text-center tracking-widest text-lg font-bold"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            disabled={loading}
          />

          {/* NEW PASSWORD */}
          <label className="block text-sm text-gray-400 mb-2">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 mb-4 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500 transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />

          {/* CONFIRM PASSWORD */}
          <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 mb-6 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-indigo-600 py-3 rounded font-semibold hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-400 hover:underline font-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

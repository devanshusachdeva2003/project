import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset code");
      }

      setEmailSubmitted(true);
      toast.success("✅ Reset code sent! Check your email");
      
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (err) {
      toast.error("❌ " + (err.message || "Failed to send reset code"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl w-96 shadow-xl">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">🔐 Forgot Password?</h2>
          <p className="text-gray-400 text-sm">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        {!emailSubmitted ? (
          <form onSubmit={handleForgotPassword}>
            {/* EMAIL INPUT */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-6 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-indigo-600 py-3 rounded font-semibold hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-5xl">📧</div>
            <p className="text-gray-400 mb-6">
              Reset code sent to <strong>{email}</strong>
            </p>
            <p className="text-gray-400 text-sm">
              Redirecting to reset password page...
            </p>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-400 hover:underline font-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
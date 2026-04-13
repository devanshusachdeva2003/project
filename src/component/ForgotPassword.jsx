import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

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

      // If server returned non-OK status, surface the error
      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.message || data.details || "Failed to send reset code");
      }

      // Backend may return emailFailed (dev) when email couldn't be sent but code saved.
      // Treat that as a visible warning so users know the code may not arrive by email.
          if (data.emailFailed) {
            console.warn("Server indicated email sending failed:", data.emailError || data);
            toast.warn(
              "⚠️ Reset request accepted but email delivery failed. Check the server logs or contact support."
            );
            // In development the server may return the code/link for testing — expose it so user can proceed
            if (data.code) {
              toast.info("Dev code: " + data.code, { autoClose: 8000 });
              sessionStorage.setItem("dev_reset_code", data.code);
            }
            if (data.debug && data.debug.resetLink) {
              setDevResetLink(data.debug.resetLink);
              sessionStorage.setItem("dev_reset_link", data.debug.resetLink);
              toast.info("Dev reset link available (dev only).", { autoClose: 8000 });
            }
            // advance UI so user isn't stuck on the form
            setEmailSubmitted(true);
      } else {
        setEmailSubmitted(true);
            toast.success("✅ Reset link sent! Check your email");

        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      const errorMsg = err.message || "Failed to send reset code";
      toast.error("❌ " + errorMsg);
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
                Enter your email and we'll send you a password reset link
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
                  {loading ? "Sending..." : "Send Reset Link"}
            </button>
            {devResetLink && (
              <div className="mt-3 text-center">
                <p className="text-sm text-yellow-300 mb-2">Dev reset link available (dev only):</p>
                <a
                  href={devResetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs px-3 py-2 bg-emerald-600 rounded hover:bg-emerald-500"
                >
                  Open Reset Link
                </a>
              </div>
            )}
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-5xl">📧</div>
            <p className="text-gray-400 mb-6">
                Reset link sent to <strong>{email}</strong>
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
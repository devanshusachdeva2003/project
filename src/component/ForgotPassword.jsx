import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  // ================= STEP 1: GET QUESTION =================
  const getQuestion = async () => {
    if (!email) {
      toast.warning("Please enter email");
      return;
    }

    try {
      console.log("Fetching question for:", email);

      const res = await fetch(`${API}/api/auth/get-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("QUESTION RESPONSE:", data);

      if (!res.ok) throw new Error(data.message);

      setQuestion(data.question);
      toast.success("Security question loaded");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // ================= STEP 2: RESET PASSWORD =================
  const resetPassword = async () => {
    console.log("RESET CLICKED:", { email, answer, newPassword });

    if (!email || !answer || !newPassword) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          answer,
          newPassword,
        }),
      });

      const data = await res.json();
      console.log("RESET RESPONSE:", data);

      if (!res.ok) throw new Error(data.message);

      toast.success("Password reset successful");

      // OPTIONAL: clear form
      setEmail("");
      setAnswer("");
      setNewPassword("");
      setQuestion("");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl w-80 shadow-xl">
        
        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {!question ? (
          <>
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-2 mb-4 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* NEXT BUTTON */}
            <button
              onClick={getQuestion}
              className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition"
            >
              Next
            </button>
          </>
        ) : (
          <>
            {/* QUESTION */}
            <p className="mb-3 text-sm text-gray-300">
              {question}
            </p>

            {/* ANSWER */}
            <input
              type="text"
              placeholder="Your Answer"
              className="w-full p-2 mb-3 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            {/* NEW PASSWORD */}
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-4 bg-slate-700 text-white rounded outline-none border border-slate-600 focus:border-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* RESET BUTTON */}
            <button
              onClick={resetPassword}
              className="w-full bg-green-600 py-2 rounded hover:bg-green-500 transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
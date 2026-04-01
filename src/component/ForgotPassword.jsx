import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  // STEP 1 → GET QUESTION
  const getQuestion = async () => {
    try {
      const res = await fetch(`${API}/api/auth/get-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setQuestion(data.question);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // STEP 2 → RESET PASSWORD
  const resetPassword = async () => {
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answer,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Password reset successful");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-slate-800 p-6 rounded-xl w-80">

        <h2 className="text-xl mb-4">Forgot Password</h2>

        {!question ? (
          <>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-2 mb-4 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={getQuestion}
              className="w-full bg-indigo-600 py-2 rounded"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-300">{question}</p>

            <input
              type="text"
              placeholder="Answer"
              className="w-full p-2 mb-3 text-black"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-4 text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
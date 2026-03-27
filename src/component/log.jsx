import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Log() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ must be inside component
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

  const handleLogin = async () => {
  const res = await fetch(`${VITE_API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok && data.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    // ✅ THIS LINE IS MISSING IN YOUR CODE
    localStorage.setItem("userId", data.user._id);

    navigate("/");
  } else {
    alert(data.message);
  }
};
  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
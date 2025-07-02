import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Status messages
  const [isWaiting, setIsWaiting] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setStatus("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.detail || "Signup failed");
        return;
      }

      setStatus("Waiting for verification. Please check your email.");
      setIsWaiting(true);
    } catch (error) {
      setStatus("Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem", width: "300px" }}
        disabled={isWaiting}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem", width: "300px" }}
        disabled={isWaiting}
      />
      <br />
      <button
        onClick={handleSignup}
        disabled={isWaiting}
        style={{ padding: "0.7rem 2rem", cursor: isWaiting ? "not-allowed" : "pointer" }}
      >
        Create
      </button>
      {status && <p style={{ marginTop: "1rem", color: status.toLowerCase().includes("error") || status.toLowerCase().includes("failed") ? "red" : "green" }}>{status}</p>}
    </div>
  );
}

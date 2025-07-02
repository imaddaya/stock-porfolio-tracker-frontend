import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Status messages
  const [isWaiting, setIsWaiting] = useState(false);

  // Poll verification status every 5 seconds
  useEffect(() => {
    if (!isWaiting) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://your-backend-url/verify-email?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (data.verified) {
          setStatus("Verified! Redirecting to login...");
          clearInterval(interval);
          setTimeout(() => {
            router.push("/"); // Redirect to login page
          }, 3000);
        }
      } catch (error) {
        console.error("Verification check error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isWaiting, email, router]);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("https://your-backend-url/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      setStatus("Waiting for verification. Please check your email.");
      setIsWaiting(true);
    } catch (error) {
      alert("Something went wrong.");
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
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}

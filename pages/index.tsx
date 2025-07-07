// pages/login_page.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    try {
      const response = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.detail || "Login failed");
        return;
      }

      // Once token logic is implemented, store it
      localStorage.setItem("access_token", data.access_token || "mock_token");
      localStorage.setItem("user_email", email);
      router.push("/loggedin");
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setStatus("Please enter your email first.");
      return;
    }

    try {
      const response = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setStatus(data.message || "Check your email for password reset instructions.");
    } catch (error) {
      console.error("Forgot password error:", error);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(stocksphoto.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        style={{
          color: "#89CFF0",
          fontWeight: "bold",
          fontSize: "4rem",
          marginBottom: "3rem",
          textAlign: "center",
        }}
      >
        Stokki
      </h1>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "20px",
          padding: "2rem 3rem",
          minWidth: "320px",
          maxWidth: "400px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem" }}>LOGIN</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <span
            onClick={handleForgotPassword}
            style={{ fontSize: "0.9rem", color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}
          >
            Forgot password?
          </span>
        </div>

        <button
          disabled={!isFormValid}
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.9rem",
            backgroundColor: isFormValid ? "#89CFF0" : "#aaccee",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: isFormValid ? "pointer" : "not-allowed",
            marginBottom: "1.5rem",
          }}
        >
          Login
        </button>

        <div>
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}
          >
            Signup here
          </a>
        </div>

        {status && <p style={{ color: "red", marginTop: "1rem" }}>{status}</p>}
      </div>
    </div>
  );
}

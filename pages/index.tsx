import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Add status state

  // Replace this URL with your downloaded image path or hosted URL
  const backgroundImageUrl = "stocksphoto.jpg";

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    try {
      const response = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.detail || "Login failed");  // replaced alert
        return;
      }

      // Save token
      localStorage.setItem("access_token", data.access_token);
      setStatus("Login successful!");  // replaced alert

      // Optional: redirect
      // window.location.href = "/portfolio";
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Something went wrong. Please try again."); // replaced alert
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setStatus("Please enter your email first."); // replaced alert
      return;
    }

    try {
      const response = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setStatus(data.message || "Check your email for password reset instructions."); // replaced alert
    } catch (error) {
      console.error("Forgot password error:", error);
      setStatus("Something went wrong."); // replaced alert
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImageUrl})`,
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
      {/* Title */}
      <h1
        style={{
          color: "babyblue",
          fontWeight: "bold",
          fontSize: "4rem",
          marginBottom: "3rem",
          textAlign: "center",
        }}
      >
        Stokki
      </h1>

      {/* Login Box */}
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
        {/* email */}
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
        {/* password */}
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
          onClick={handleLogin}
        >
          Login
        </button>

        <div>
          Don't have an account?{" "}
          <a
            href="/Signup"
            style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}
          >
            Signup here
          </a>
        </div>

        {/* Display status messages here */}
        {status && <p style={{ marginTop: "1rem", color: "red" }}>{status}</p>}
      </div>
    </div>
  );
}

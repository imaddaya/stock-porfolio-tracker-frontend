import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Replace this URL with your downloaded image path or hosted URL
  const backgroundImageUrl = "/your-stock-animation.jpg";

  const isFormValid = email.trim() !== "" && password.trim() !== "";

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
        fontFamily: "'Poppins', sans-serif", // Fancy font example
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: "babyblue", // Or "#89CFF0" as hex for baby blue
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
          <a
            href="#"
            style={{ fontSize: "0.9rem", color: "#0070f3", textDecoration: "underline" }}
          >
            Forgot password?
          </a>
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
          onClick={() => alert(`Login with ${email}`)} // Replace with real login handler
        >
          Login
        </button>

        <div>
          Don't have an account?{" "}
          <a
            href="#"
            style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}
          >
            Signup here
          </a>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Status messages
  const [isWaiting, setIsWaiting] = useState(false);
  const [alphaKey, setAlphaKey] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }  
    if (!email.trim() || !password.trim() || !alphaKey.trim()) {
      setStatus("Please enter all fields");
      return;
    }

    try {
      const res = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,confirm_password: confirmPassword, alpha_vantage_api_key: alphaKey }),
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
      <ul style={{ fontSize: "0.8rem", color: "gray", textAlign: "left", maxWidth: "300px", margin: "0 auto", paddingLeft: "1.2rem" }}>
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character (!@#$%^&*)</li>
      </ul>

      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem", width: "300px" }}
        disabled={isWaiting}
      />
      
      <br />
      <label>
        Alpha Vantage API Key:{" "}
        <a
          href="https://www.alphavantage.co/support/#api-key"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          Get your API key here
        </a>
        <br />
        <br />

      </label>
      <input
        type="text"
        name="alpha_vantage_api_key"
        placeholder="Paste your Alpha Vantage API key here"
        value={alphaKey}
        onChange={(e) => setAlphaKey(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem", width: "300px" }}
        disabled={isWaiting}
      />
      <p style={{ fontSize: "0.8rem", color: "gray" }}>
        Please make sure your API key is correct before proceeding.
      </p>
      <br />
      
      <button
        onClick={handleSignup}
        disabled={isWaiting}
        style={{ padding: "0.7rem 2rem", cursor: isWaiting ? "not-allowed" : "pointer" }}
      >
        Create
      </button>
      {typeof status === "string" && (
        <p
          style={{
            marginTop: "1rem",
            color:
              status.toLowerCase().includes("error") ||
              status.toLowerCase().includes("failed")
                ? "red"
                : "green",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

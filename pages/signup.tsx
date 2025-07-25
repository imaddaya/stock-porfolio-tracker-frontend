import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [alphaKey, setAlphaKey] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getPasswordValidation = () => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };
  };

  const validation = getPasswordValidation();

  const handleSignup = async () => {
    setStatus("");

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    if (!email.trim() || !password.trim() || !alphaKey.trim()) {
      setStatus("Please enter all fields");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            confirm_password: confirmPassword,
            alpha_vantage_api_key: alphaKey,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.detail || "Signup failed");
        return;
      }

      setStatus("Waiting for verification. Please check your email.");
      setIsWaiting(true);
    } catch (error) {
      console.error("Signup error:", error);
      setStatus("Something went wrong. Please try again.");
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
      <ul
        style={{
          fontSize: "0.8rem",
          textAlign: "left",
          maxWidth: "300px",
          margin: "0 auto",
          paddingLeft: "1.2rem",
          listStyleType: "none",
        }}
      >
        <li style={{ color: validation.minLength ? "#28a745" : "#dc3545", marginBottom: "0.2rem" }}>
          {validation.minLength ? "✓" : "✗"} At least 8 characters
        </li>
        <li style={{ color: validation.hasUppercase ? "#28a745" : "#dc3545", marginBottom: "0.2rem" }}>
          {validation.hasUppercase ? "✓" : "✗"} At least one uppercase letter
        </li>
        <li style={{ color: validation.hasLowercase ? "#28a745" : "#dc3545", marginBottom: "0.2rem" }}>
          {validation.hasLowercase ? "✓" : "✗"} At least one lowercase letter
        </li>
        <li style={{ color: validation.hasNumber ? "#28a745" : "#dc3545", marginBottom: "0.2rem" }}>
          {validation.hasNumber ? "✓" : "✗"} At least one number
        </li>
        <li style={{ color: validation.hasSpecial ? "#28a745" : "#dc3545", marginBottom: "0.2rem" }}>
          {validation.hasSpecial ? "✓" : "✗"} At least one special character (!@#$%^&*)
        </li>
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
      </label>
      <br />
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
        style={{
          padding: "0.7rem 2rem",
          cursor: isWaiting ? "not-allowed" : "pointer",
        }}
      >
        Create
      </button>
      {status && (
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
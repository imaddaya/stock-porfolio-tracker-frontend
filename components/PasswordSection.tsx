
import { useState } from "react";

interface PasswordSectionProps {
  loading: boolean;
  onChangePassword: () => void;
  showPasswordResetMessage: boolean;
}

export default function PasswordSection({ loading, onChangePassword, showPasswordResetMessage }: PasswordSectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Password:</label>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ flex: 1, fontFamily: "monospace" }}>
          {showPassword ? "current_password_hidden" : "••••••••"}
        </span>
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={{
            padding: "0.3rem 0.8rem",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button
        onClick={onChangePassword}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#fd7e14",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "0.9rem",
          marginBottom: "0.5rem",
        }}
      >
        {loading ? "Sending..." : "Change Password"}
      </button>
      {showPasswordResetMessage && (
        <div
          style={{
            fontSize: "0.9rem",
            color: "#28a745",
            fontStyle: "italic",
            marginTop: "0.5rem",
          }}
        >
          If your email is registered and verified, you'll receive password reset instructions.
        </div>
      )}
    </div>
  );
}

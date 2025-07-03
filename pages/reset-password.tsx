import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      setStatus("Verification token is missing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setStatus("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setStatus(""); // clear previous status

    try {
      const response = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.detail || "Reset failed");
        return;
      }

      setStatus("Password reset successfully. You may now log in.");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setStatus("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const isReadyToSubmit = token && newPassword && confirmPassword;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem" }}
      />
      <br />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ margin: "1rem", padding: "0.5rem" }}
      />
      <br />
      <button
        onClick={handleSubmit}
        style={{ padding: "0.7rem 2rem" }}
        disabled={!isReadyToSubmit || isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      {status && (
        <p style={{ color: status.toLowerCase().includes("success") ? "green" : "red" }}>
          {status}
        </p>
      )}
    </div>
  );
}

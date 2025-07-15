
import { useState } from "react";

interface DeleteAccountSectionProps {
  loading: boolean;
  onDeleteAccount: () => void;
}

export default function DeleteAccountSection({ loading, onDeleteAccount }: DeleteAccountSectionProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1rem",
        border: "2px solid #dc3545",
        borderRadius: "8px",
        backgroundColor: "#fff5f5",
      }}
    >
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem", color: "#dc3545" }}>
        Danger Zone:
      </label>
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Delete Account
        </button>
      ) : (
        <div>
          <p style={{ color: "#dc3545", marginBottom: "1rem", fontWeight: "bold" }}>
            ARE YOU SURE? This action will send a verification email. You have 30 minutes to confirm account deletion.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={onDeleteAccount}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
              }}
            >
              {loading ? "Sending..." : "Yes, Delete My Account"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


import { useState } from "react";

interface ApiKeySectionProps {
  apiKey: string;
  loading: boolean;
  onUpdate: (newKey: string) => void;
}

export default function ApiKeySection({ apiKey, loading, onUpdate }: ApiKeySectionProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [showApiWarning, setShowApiWarning] = useState(false);

  const handleStartEdit = () => {
    setIsEditingApiKey(true);
    setNewApiKey(apiKey);
  };

  const handleCancelEdit = () => {
    setIsEditingApiKey(false);
    setNewApiKey("");
  };

  const handleUpdate = () => {
    onUpdate(newApiKey);
    setIsEditingApiKey(false);
    setNewApiKey("");
  };

  return (
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>
        Alpha Vantage API Key:
      </label>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
        {isEditingApiKey ? (
          <>
            <input
              type="text"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter new API key"
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            <button
              onClick={handleUpdate}
              disabled={loading || !newApiKey.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Update
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontFamily: "monospace", fontSize: "0.9rem" }}>
              {showApiKey ? apiKey : "••••••••••••••••"}
            </span>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
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
              {showApiKey ? "Hide" : "Show"}
            </button>
          </>
        )}
      </div>
      {!isEditingApiKey && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handleStartEdit}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Upgrade API Key
          </button>
          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setShowApiWarning(true)}
            onMouseLeave={() => setShowApiWarning(false)}
          >
            <span
              style={{
                fontSize: "1.2rem",
                cursor: "help",
                color: "#dc3545",
              }}
            >
              ⚠️
            </span>
            {showApiWarning && (
              <div
                style={{
                  position: "absolute",
                  bottom: "130%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#333",
                  color: "white",
                  padding: "0.8rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  width: "300px",
                  maxWidth: "300px",
                  zIndex: 1000,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  lineHeight: "1.4",
                }}
              >
                <div style={{ color: "#ff6b6b", fontWeight: "bold", marginBottom: "0.3rem" }}>⚠️ WARNING</div>
                <div style={{ color: "#ff6b6b" }}>
                  Creating multiple API keys from the same location will cause an IP ban. Change API only when
                  upgrading the key. This can be done once/week.
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid #333",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

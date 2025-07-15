import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { profileAPI } from "../utils/api";
import StatusMessage from "../components/StatusMessage";
import EmailReminderSection from "../components/EmailReminderSection";
import ApiKeySection from "../components/ApiKeySection";
import PasswordSection from "../components/PasswordSection";
import DeleteAccountSection from "../components/DeleteAccountSection";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState("");
  const [emailReminderTime, setEmailReminderTime] = useState("");
  const [emailReminderEnabled, setEmailReminderEnabled] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordResetMessage, setShowPasswordResetMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");

    if (!token) {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
    fetchProfileData();
  }, [router]);

  const fetchProfileData = async () => {
    try {
      const data = await profileAPI.fetchProfile();
      setApiKey(data.alpha_vantage_api_key || "");
      setEmailReminderTime(data.email_reminder_time || "");
      setEmailReminderEnabled(data.email_reminder_enabled || false);
      setSelectedTimezone(data.timezone || "UTC");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setStatus("Error loading profile data");
    }
  };

  const handleSetEmailReminder = async () => {
    setLoading(true);
    try {
      await profileAPI.updateEmailReminder({
        reminder_time: emailReminderEnabled ? emailReminderTime : null,
        enabled: emailReminderEnabled,
        timezone: selectedTimezone,
      });
      setStatus(
        emailReminderEnabled
          ? `Daily email reminder enabled for ${selectedTimezone}!`
          : "Email reminder disabled!"
      );
    } catch (err) {
      setStatus("Error updating email reminder");
    }
    setLoading(false);
  };

  const handleUpdateApiKey = async (newApiKey: string) => {
    if (!newApiKey.trim()) return;

    setLoading(true);
    try {
      await profileAPI.updateApiKey(newApiKey);
      setApiKey(newApiKey);
      setStatus("API key updated successfully!");
    } catch (err) {
      setStatus("Error updating API key");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!userEmail.trim()) {
      setStatus("Email not found");
      return;
    }

    setLoading(true);
    setShowPasswordResetMessage(true);
    try {
      await profileAPI.requestPasswordReset(userEmail);
      setStatus("Password reset email sent!");
    } catch (error) {
      setStatus("Password reset email sent!");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await profileAPI.deleteAccount();
      setStatus("Account deletion email sent. Check your email and confirm within 30 minutes.");
    } catch (err) {
      setStatus("Error initiating account deletion");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push("/loggedin");
          }}
          style={{
            textDecoration: "underline",
            color: "#0070f3",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          &larr; Return to main page
        </a>
      </div>

      <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Profile Settings</h1>

      <StatusMessage message={status} />

      {/* User Email */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>User Email:</label>
        <span style={{ color: "#666", fontSize: "1rem" }}>{userEmail}</span>
      </div>

      <EmailReminderSection
        emailReminderTime={emailReminderTime}
        emailReminderEnabled={emailReminderEnabled}
        selectedTimezone={selectedTimezone}
        loading={loading}
        onTimeChange={setEmailReminderTime}
        onEnabledChange={setEmailReminderEnabled}
        onTimezoneChange={setSelectedTimezone}
        onSave={handleSetEmailReminder}
      />

      <ApiKeySection apiKey={apiKey} loading={loading} onUpdate={handleUpdateApiKey} />

      <PasswordSection
        loading={loading}
        onChangePassword={handleChangePassword}
        showPasswordResetMessage={showPasswordResetMessage}
      />

      <DeleteAccountSection loading={loading} onDeleteAccount={handleDeleteAccount} />
    </div>
  );
}
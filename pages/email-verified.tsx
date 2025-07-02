import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EmailVerified() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) return;

    const tokenStr = Array.isArray(token) ? token[0] : token;

    fetch(`https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/verify-email?token=${encodeURIComponent(tokenStr)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || "Verification failed.");
        }
        return res.json();
      })
      .then(data => {
        if (data.verified) {
          setStatus("Email verified! You will be redirected to the login page shortly.");
          setTimeout(() => {
            router.push("/"); // Redirect to login page after 3 seconds
          }, 3000);
        } else if (data.detail) {
          setStatus(`Error: ${data.detail}`);
        } else {
          setStatus("Verification failed.");
        }
      })
      .catch((error) => setStatus(`Error verifying email: ${error.message}`));
  }, [token, router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
}

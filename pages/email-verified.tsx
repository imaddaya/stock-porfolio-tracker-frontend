import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EmailVerified() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) return;

    const tokenStr = Array.isArray(token) ? token[0] : token;

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email?token=${encodeURIComponent(
        tokenStr
      )}`
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.detail || "Verification failed.");
        }

        setStatus("Email verified successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/"); // go to login page
        }, 3000);
      })
      .catch((err) => {
        setStatus(`Error verifying email: ${err.message}`);
      });
  }, [token, router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
}
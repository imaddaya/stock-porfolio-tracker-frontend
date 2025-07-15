import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function LoggedIn() {
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([]);
  const [offset, setOffset] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email") || "";
    setEmail(storedEmail);

    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length < 1) {
        setSuggestions([]);
        setOffset(0);
        return;
      }

      try {
        const token = localStorage.getItem("access_token") || "";

        const res = await fetch(
          `https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/stocks?keywords=${encodeURIComponent(
            search
          )}&offset=0&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Search API error:", res.status, errorData);
          setSuggestions([]);
          setOffset(0);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array from /stocks but got:", data);
          setSuggestions([]);
          setOffset(0);
          return;
        }

        setSuggestions(data);
        setOffset(50);
      } catch (err) {
        console.error("Search error", err);
        setSuggestions([]);
        setOffset(0);
      }
    }, 750);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const loadMoreStocks = async () => {
    try {
      const token = localStorage.getItem("access_token") || "";

      const res = await fetch(
        `https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/stocks?keywords=${encodeURIComponent(
          search
        )}&offset=${offset}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Load more API error:", res.status, errorData);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return;
      }

      setSuggestions((prev) => [...prev, ...data]);
      setOffset((prev) => prev + 50);
    } catch (err) {
      console.error("Load more error", err);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          padding: "1rem 2rem",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Stokki</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>{email}</span>
          <div style={{ position: "relative" }} ref={settingsRef}>
            <div
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{
                backgroundColor: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              Settings
            </div>
            {settingsOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  zIndex: 10,
                }}
              >
                {["My Stocks", "Profile", "Email Reminder", "Logout"].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "0.8rem 1.2rem",
                      color: "black",
                      backgroundColor: "white",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#89CFF0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                    onClick={() => {
                      switch (item) {
                        case "My Stocks":
                          router.push("/mystocks");
                          break;
                        case "Profile":
                          router.push("/profilepage");
                          break;
                        case "Email Reminder":
                          router.push("/email-reminder");
                          break;
                        case "Logout":
                          handleLogout();
                          break;
                      }
                      setSettingsOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ margin: "2rem auto", width: "400px", position: "relative" }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="type symbol or company name here"
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginTop: "3rem", padding: "0 2rem" }}>
        {suggestions.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>Stock boxes will appear here...</h2>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                maxWidth: "1300px",
                margin: "0 auto",
                gap: "1rem",
                justifyContent: "center",
                padding: "0 1rem",
              }}
            >
              {suggestions.map(({ symbol, name }) => (
                <div
                  key={symbol}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1rem",
                    width: "100%",
                    boxSizing: "border-box",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "160px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={symbol}
                  >
                    <strong>Symbol:</strong> {symbol}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                      maxHeight: "3.6em",
                      overflow: "hidden",
                    }}
                    title={name}
                  >
                    <strong>Company name:</strong> {name}
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("access_token") || "";

                        const res = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/add", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ stock_symbol: symbol }),
                        });

                        if (!res.ok) {
                          const error = await res.json();
                          console.error("Failed to add stock:", error.detail || res.statusText);
                          return;
                        }

                        setSuggestions((prev) => prev.filter((s) => s.symbol !== symbol));
                      } catch (err) {
                        console.error("Add to portfolio error:", err);
                      }
                    }}
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#007bff",
                      border: "none",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                  >
                    Add to my stocks
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                onClick={loadMoreStocks}
                style={{
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "white",
                  padding: "0.5rem 1.2rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Show More Stocks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function LoggedIn() {
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const settingsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email") || "";
    setEmail(storedEmail);

    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Optional: call backend to invalidate token
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSearchOpen(true);

    if (value.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/stocks/search?keywords=${value}`
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();

      const formattedSuggestions = data.slice(0, 15).map(
        (item: { symbol: string; name: string }) => `${item.name} (${item.symbol})`
      );

      setSuggestions(formattedSuggestions);
    } catch (err) {
      console.error("Search error", err);
      setSuggestions([]);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Ribbon */}
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
                          router.push("/profile");
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

      {/* Search */}
      <div
        ref={searchRef}
        style={{ margin: "2rem auto", width: "400px", position: "relative" }}
      >
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="type symbol or company name here"
          onFocus={() => setSearchOpen(true)}
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        {searchOpen && search && (
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginTop: "0.5rem",
              backgroundColor: "white",
              position: "absolute",
              width: "100%",
              zIndex: 1000,
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  padding: "0.7rem 1rem",
                  color: "black",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#89CFF0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placeholder for stock grid */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Stock boxes will appear here...</h2>
      </div>
    </div>
  );
}

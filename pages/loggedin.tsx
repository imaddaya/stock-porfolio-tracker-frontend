import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoggedIn() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
    } else {
      // Extract email from token (in a real app, decode JWT properly)
      const storedEmail = localStorage.getItem("user_email");
      if (storedEmail) setUserEmail(storedEmail);
    }
  }, [router]);

  const dummyStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$190.20", change: "+1.2%", country: "USA" },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$220.45", change: "-0.8%", country: "USA" },
    { symbol: "BMW", name: "BMW AG", price: "€95.10", change: "+0.5%", country: "Germany" },
    { symbol: "SONY", name: "Sony Group", price: "$85.60", change: "-0.3%", country: "Japan" },
  ];

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Top Ribbon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b", color: "white", padding: "1rem 2rem" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Stokki</div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div>{userEmail}</div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{ backgroundColor: "#334155", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}
            >
              Settings
            </button>
            {showSettings && (
              <div style={{ position: "absolute", top: "110%", right: 0, backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", borderRadius: "8px", overflow: "hidden", minWidth: "160px" }}>
                {['Profile', 'Email Reminder', 'Logout'].map((option, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      color: "black",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#3b82f6"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <input
          type="text"
          placeholder="type symbol or company name here"
          style={{ padding: "0.8rem 1.2rem", width: "60%", borderRadius: "10px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
      </div>

      {/* Grid of Stocks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        {dummyStocks.map((stock, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{stock.symbol}</div>
            <div>{stock.name}</div>
            <div>Price: {stock.price}</div>
            <div style={{ color: stock.change.startsWith("+") ? "green" : "red" }}>Change: {stock.change}</div>
            <div>Country: {stock.country}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type StockSummary = {
  ticker: string;
  price: string;
  change_percent: string;
  country?: string;
};

export default function MyStocks() {
  const [stocks, setStocks] = useState<StockSummary[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch portfolio");
        return res.json();
      })
      .then((data) => {
        setStocks(data.summary || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [router]);

  const handleRemove = async (ticker: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticker }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to remove stock: ${errorData.detail || "Unknown error"}`);
        return;
      }

      // Update frontend state to remove the stock immediately
      setStocks((prev) => prev.filter((stock) => stock.ticker !== ticker));
    } catch (err) {
      console.error("Error removing stock:", err);
      alert("An error occurred while removing the stock.");
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem" }}>
      {/* Return link at top left */}
      <div style={{ marginBottom: "1rem" }}>
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

      <h1 style={{ marginBottom: "2rem" }}>My Stocks</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "1.5rem",
        }}
      >
        {stocks.length === 0 && <p>No stocks in your portfolio.</p>}
        {stocks.map(({ ticker, price, change_percent, country }) => (
          <div
            key={ticker}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>{ticker}</h3>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Price:</strong> {price}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Change:</strong> {change_percent}
            </p>
            {country && (
              <p style={{ margin: "0.3rem 0" }}>
                <strong>Country:</strong> {country}
              </p>
            )}
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "#e74c3c",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                }}
                onClick={() => handleRemove(ticker)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

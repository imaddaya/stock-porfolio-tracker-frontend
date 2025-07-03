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

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem" }}>
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
              <button style={{ flex: 1, padding: "0.5rem", cursor: "pointer" }} disabled>
                Add
              </button>
              <button style={{ flex: 1, padding: "0.5rem", cursor: "pointer" }} disabled>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

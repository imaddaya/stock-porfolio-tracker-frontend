import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type StockSummary = {
  symbol: string;
  name: string;           
  open?: number;                     
  high?: number;                      
  low?: number;    
  price?: number;     
  volume?: number;                     
  latest_trading_day?: string;        
  previous_close?: number;         
  change?: number;                   
  change_percent?: string; 
};

type PortfolioEntry = {
  symbol: string;
  quantity: number;
  purchasePrice: number;
};

export default function MyStocks() {
  const [stocks, setStocks] = useState<StockSummary[]>([]);
  const [loadingSymbol, setLoadingSymbol] = useState<string | null>(null);
  const [portfolioEntries, setPortfolioEntries] = useState<{ [symbol: string]: PortfolioEntry }>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    // Load portfolio entries from localStorage
    const savedEntries = localStorage.getItem("portfolioEntries");
    if (savedEntries) {
      setPortfolioEntries(JSON.parse(savedEntries));
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/portfolio/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          console.warn("Unexpected summary format:", data);
        }
      })
      .catch(console.error);
  }, [router]);

  const handleRemove = async (symbol: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/portfolio/remove/${symbol}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to remove stock: ${errorData.detail || "Unknown error"}`);
        return;
      }

      setStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
    } catch (err) {
      console.error("Error removing stock:", err);
      alert("An error occurred while removing the stock.");
    }
  };

  const handleRefresh = async (symbol: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    setLoadingSymbol(symbol);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/portfolio/summary/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to refresh stock: ${errorData.detail || "Unknown error"}`);
        setLoadingSymbol(null);
        return;
      }

      const updatedStock: StockSummary = await res.json();

      setStocks((prev) =>
        prev.map((stock) => (stock.symbol === symbol ? updatedStock : stock))
      );
    } catch (err) {
      console.error("Error refreshing stock:", err);
      alert("An error occurred while refreshing the stock.");
    }
    setLoadingSymbol(null);
  };

  const updatePortfolioEntry = (symbol: string, field: 'quantity' | 'purchasePrice', value: number) => {
    const newEntries = {
      ...portfolioEntries,
      [symbol]: {
        ...portfolioEntries[symbol],
        symbol,
        quantity: field === 'quantity' ? value : (portfolioEntries[symbol]?.quantity || 0),
        purchasePrice: field === 'purchasePrice' ? value : (portfolioEntries[symbol]?.purchasePrice || 0),
      }
    };
    setPortfolioEntries(newEntries);
    localStorage.setItem("portfolioEntries", JSON.stringify(newEntries));
  };

  const calculateProfit = (stock: StockSummary) => {
    const entry = portfolioEntries[stock.symbol];
    if (!entry || !stock.price || entry.quantity <= 0 || entry.purchasePrice <= 0) {
      return null;
    }
    
    const totalPurchaseValue = entry.quantity * entry.purchasePrice;
    const totalCurrentValue = entry.quantity * stock.price;
    return totalCurrentValue - totalPurchaseValue;
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem" }}>
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
        {stocks.map(({ symbol, name, price, change_percent, open, high, low, volume, latest_trading_day, previous_close, change }) => (

          <div
            key={symbol}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* Symbol and buttons container */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>{symbol}</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleRefresh(symbol)}
                  disabled={loadingSymbol === symbol}
                  title="Refresh stock data"
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.15rem 0.5rem",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: "1px solid #0070f3",
                    backgroundColor:
                      loadingSymbol === symbol ? "#cce4ff" : "white",
                    color: "#0070f3",
                  }}
                >
                  {loadingSymbol === symbol ? "Loading..." : "Refresh"}
                </button>
                <button
                  onClick={() => {
                    router.push(`/stock-details?symbol=${symbol}`);
                  }}
                  title="View stock details"
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.15rem 0.5rem",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: "1px solid #28a745",
                    backgroundColor: "white",
                    color: "#28a745",
                  }}
                >
                  Details
                </button>
              </div>
            </div>

            <p style={{ margin: "0.3rem 0" }}>
              <strong>Company:</strong> {name || "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Open:</strong> {typeof open === "number" ? open.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>High:</strong> {typeof high === "number" ? high.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Low:</strong> {typeof low === "number" ? low.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Price:</strong> {typeof price === "number" ? price.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Volume:</strong> {typeof volume === "number" ? volume.toLocaleString() : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Latest Trading Day:</strong> {latest_trading_day || "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Previous Close:</strong> {typeof previous_close === "number" ? previous_close.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Change:</strong> {typeof change === "number" ? change.toFixed(4) : "N/A"}
            </p>
            <p style={{ margin: "0.3rem 0" }}>
              <strong>Change Percent:</strong> {change_percent ?? "N/A"}
            </p>

            {/* Portfolio Tracking Section */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                border: "1px solid #e9ecef"
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "bold" }}>
                My Portfolio
              </h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ minWidth: "80px" }}>Quantity:</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={portfolioEntries[symbol]?.quantity || ""}
                    onChange={(e) => updatePortfolioEntry(symbol, 'quantity', parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: "0.25rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "0.8rem"
                    }}
                    placeholder="0"
                  />
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ minWidth: "80px" }}>Bought at:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={portfolioEntries[symbol]?.purchasePrice || ""}
                    onChange={(e) => updatePortfolioEntry(symbol, 'purchasePrice', parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: "0.25rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "0.8rem"
                    }}
                    placeholder="0.00"
                  />
                </div>

                {(() => {
                  const profit = calculateProfit({ symbol, name, price, change_percent, open, high, low, volume, latest_trading_day, previous_close, change });
                  if (profit !== null) {
                    const isProfit = profit >= 0;
                    return (
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.5rem",
                          padding: "0.25rem",
                          borderRadius: "4px",
                          backgroundColor: isProfit ? "#d4edda" : "#f8d7da",
                          border: `1px solid ${isProfit ? "#c3e6cb" : "#f5c6cb"}`,
                          color: isProfit ? "#155724" : "#721c24"
                        }}
                      >
                        <label style={{ minWidth: "80px", fontWeight: "bold" }}>
                          {isProfit ? "Profit:" : "Loss:"}
                        </label>
                        <span style={{ fontWeight: "bold" }}>
                          ${Math.abs(profit).toFixed(2)}
                        </span>
                        <span style={{ fontSize: "0.75rem" }}>
                          ({isProfit ? "+" : "-"}{((Math.abs(profit) / (portfolioEntries[symbol].quantity * portfolioEntries[symbol].purchasePrice)) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            <div
              style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
            >
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
                onClick={() => handleRemove(symbol)}
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


import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type StockDataPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
  dividend_amount: number;
};

type StockDetails = {
  symbol: string;
  name: string;
  metadata?: any;
  weekly_data?: StockDataPoint[];
};

type MonthlyData = {
  symbol: string;
  name: string;
  metadata?: any;
  weekly_data?: StockDataPoint[]; // Note: backend uses same field name for monthly data
};

export default function StockDetails() {
  const [weeklyData, setWeeklyData] = useState<StockDetails | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { symbol } = router.query;

  useEffect(() => {
    if (!symbol) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    fetchStockDetails();
  }, [symbol, router]);

  const fetchStockDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Fetch weekly data
      const weeklyRes = await fetch(
        `https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/weekly-data/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch monthly data
      const monthlyRes = await fetch(
        `https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/monthly-data/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!weeklyRes.ok && !monthlyRes.ok) {
        const weeklyError = await weeklyRes.json().catch(() => ({ detail: "Unknown error" }));
        const monthlyError = await monthlyRes.json().catch(() => ({ detail: "Unknown error" }));
        setError(`Failed to fetch stock data: ${weeklyError.detail || monthlyError.detail}`);
        setLoading(false);
        return;
      }

      // Process weekly data
      if (weeklyRes.ok) {
        const weeklyResult = await weeklyRes.json();
        setWeeklyData(weeklyResult);
      }

      // Process monthly data
      if (monthlyRes.ok) {
        const monthlyResult = await monthlyRes.json();
        setMonthlyData(monthlyResult);
      }

    } catch (err) {
      console.error("Error fetching stock details:", err);
      setError("An error occurred while fetching stock details.");
    }
    setLoading(false);
  };

  const renderGraph = (data: StockDataPoint[] | undefined, title: string, color: string) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ marginBottom: "2rem", textAlign: "center", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h3>
          <div style={{ color: "#666" }}>No data available</div>
        </div>
      );
    }

    const entries = data.slice(0, 12); // Show last 12 data points
    const maxValue = Math.max(...entries.map(item => item.high));
    const minValue = Math.min(...entries.map(item => item.low));
    const range = maxValue - minValue;

    return (
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>{title}</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            height: "300px",
            position: "relative",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40"
                y1={50 + i * 40}
                x2="380"
                y2={50 + i * 40}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => (
              <text
                key={i}
                x="35"
                y={55 + i * 40}
                fill="#666"
                fontSize="10"
                textAnchor="end"
              >
                {(maxValue - (range * i) / 4).toFixed(2)}
              </text>
            ))}

            {/* Data points and lines */}
            {entries.reverse().map((item, index) => {
              const x = 60 + (index * 300) / (entries.length - 1);
              const closePrice = item.close;
              const y = 50 + ((maxValue - closePrice) / range) * 160;
              
              return (
                <g key={item.date}>
                  <circle cx={x} cy={y} r="3" fill={color} />
                  {index > 0 && (
                    <line
                      x1={60 + ((index - 1) * 300) / (entries.length - 1)}
                      y1={50 + ((maxValue - entries[index - 1].close) / range) * 160}
                      x2={x}
                      y2={y}
                      stroke={color}
                      strokeWidth="2"
                    />
                  )}
                  <text
                    x={x}
                    y="240"
                    fill="#666"
                    fontSize="8"
                    textAnchor="middle"
                    transform={`rotate(-45, ${x}, 240)`}
                  >
                    {item.date.slice(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Data table */}
        <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            <div>Date</div>
            <div>Open</div>
            <div>High</div>
            <div>Low</div>
            <div>Close</div>
            <div>Volume</div>
          </div>
          {data.slice(0, 5).map((item) => (
            <div key={item.date} style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem", padding: "0.25rem 0", borderBottom: "1px solid #eee" }}>
              <div>{item.date}</div>
              <div>${item.open.toFixed(2)}</div>
              <div>${item.high.toFixed(2)}</div>
              <div>${item.low.toFixed(2)}</div>
              <div>${item.close.toFixed(2)}</div>
              <div>{item.volume.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem", textAlign: "center" }}>
        <h2>Loading stock details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push("/mystocks");
            }}
            style={{
              textDecoration: "underline",
              color: "#0070f3",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            &larr; Back to My Stocks
          </a>
        </div>
        <div style={{ textAlign: "center", color: "red" }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const stockName = weeklyData?.name || monthlyData?.name;
  const displaySymbol = weeklyData?.symbol || monthlyData?.symbol || symbol;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem" }}>
      {/* Back button */}
      <div style={{ marginBottom: "2rem" }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push("/mystocks");
          }}
          style={{
            textDecoration: "underline",
            color: "#0070f3",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          &larr; Back to My Stocks
        </a>
      </div>

      {/* Stock name header */}
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        {stockName || displaySymbol} ({displaySymbol})
      </h1>

      {/* Graphs container */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            {renderGraph(weeklyData?.weekly_data, "Weekly Data", "#0070f3")}
          </div>
          <div>
            {renderGraph(monthlyData?.weekly_data, "Monthly Data", "#28a745")}
          </div>
        </div>
      </div>
    </div>
  );
}

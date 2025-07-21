
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
  const [selectedWeeklyPoint, setSelectedWeeklyPoint] = useState<StockDataPoint | null>(null);
  const [selectedMonthlyPoint, setSelectedMonthlyPoint] = useState<StockDataPoint | null>(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  };

  const getYAxisValues = (data: StockDataPoint[]) => {
    const allValues = data.flatMap(item => [item.high, item.low, item.close, item.open]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue;
    const padding = range * 0.1;
    
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedMax = maxValue + padding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    // Create values in multiples of 10
    const step = Math.ceil(adjustedRange / 50) * 10; // Approximately 5 grid lines
    const startValue = Math.floor(adjustedMin / 10) * 10;
    
    const values = [];
    for (let i = startValue; i <= adjustedMax; i += step) {
      values.push(i);
    }
    
    return { values: values.reverse(), min: adjustedMin, max: adjustedMax };
  };

  const renderGraph = (
    data: StockDataPoint[] | undefined, 
    title: string, 
    color: string, 
    selectedPoint: StockDataPoint | null,
    onPointClick: (point: StockDataPoint) => void
  ) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ marginBottom: "2rem", textAlign: "center", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h3>
          <div style={{ color: "#666" }}>No data available</div>
        </div>
      );
    }

    const entries = data.slice().reverse(); // Show chronologically
    const { values: yAxisValues, min: minValue, max: maxValue } = getYAxisValues(entries);
    const range = maxValue - minValue;
    const graphWidth = Math.max(800, entries.length * 60); // Minimum 800px, 60px per data point

    return (
      <div style={{ marginBottom: "3rem" }}>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>{title}</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            overflowX: "auto",
            height: "500px",
          }}
        >
          <svg width={graphWidth} height="450" style={{ minWidth: "100%" }}>
            {/* Grid lines */}
            {yAxisValues.map((value, i) => (
              <line
                key={i}
                x1="60"
                y1={50 + i * (350 / (yAxisValues.length - 1))}
                x2={graphWidth - 40}
                y2={50 + i * (350 / (yAxisValues.length - 1))}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {yAxisValues.map((value, i) => (
              <text
                key={i}
                x="55"
                y={55 + i * (350 / (yAxisValues.length - 1))}
                fill="#000"
                fontSize="14"
                fontWeight="bold"
                textAnchor="end"
              >
                ${value.toFixed(0)}
              </text>
            ))}

            {/* Data points and lines */}
            {entries.map((item, index) => {
              const x = 80 + (index * (graphWidth - 120)) / (entries.length - 1);
              const closePrice = item.close;
              const y = 50 + ((maxValue - closePrice) / range) * 350;
              
              return (
                <g key={item.date}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="8" 
                    fill={selectedPoint?.date === item.date ? "#ff6b6b" : color}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: "pointer" }}
                    onClick={() => onPointClick(item)}
                  />
                  {index > 0 && (
                    <line
                      x1={80 + ((index - 1) * (graphWidth - 120)) / (entries.length - 1)}
                      y1={50 + ((maxValue - entries[index - 1].close) / range) * 350}
                      x2={x}
                      y2={y}
                      stroke={color}
                      strokeWidth="3"
                    />
                  )}
                  <text
                    x={x}
                    y="425"
                    fill="#000"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(-45, ${x}, 425)`}
                  >
                    {formatDate(item.date)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Selected point details */}
        {selectedPoint && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            backgroundColor: "#fff", 
            border: "1px solid #ddd", 
            borderRadius: "8px" 
          }}>
            <h4 style={{ marginBottom: "0.5rem", color: "#000" }}>
              Details for {formatDate(selectedPoint.date)}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", fontSize: "0.9rem", color: "#000" }}>
              <div><strong>Date:</strong> {selectedPoint.date}</div>
              <div><strong>Open:</strong> ${selectedPoint.open.toFixed(4)}</div>
              <div><strong>High:</strong> ${selectedPoint.high.toFixed(4)}</div>
              <div><strong>Low:</strong> ${selectedPoint.low.toFixed(4)}</div>
              <div><strong>Close:</strong> ${selectedPoint.close.toFixed(4)}</div>
              <div><strong>Adjusted Close:</strong> ${selectedPoint.adjusted_close.toFixed(4)}</div>
              <div><strong>Volume:</strong> {selectedPoint.volume.toLocaleString()}</div>
              <div><strong>Dividend:</strong> ${selectedPoint.dividend_amount.toFixed(4)}</div>
            </div>
          </div>
        )}
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

      {/* Graphs container - vertical layout */}
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* Weekly graph first */}
        {renderGraph(
          weeklyData?.weekly_data, 
          "Weekly Data", 
          "#0070f3",
          selectedWeeklyPoint,
          setSelectedWeeklyPoint
        )}
        
        {/* Monthly graph second */}
        {renderGraph(
          monthlyData?.weekly_data, 
          "Monthly Data", 
          "#28a745",
          selectedMonthlyPoint,
          setSelectedMonthlyPoint
        )}
      </div>
    </div>
  );
}

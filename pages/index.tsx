import React, { useEffect, useState } from "react";

type StockSummary = {
  ticker: string;
  price: string;
  change_percent: string;
  error?: string;
};

export default function Home() {
  const [data, setData] = useState<StockSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://a1a01c3c-3efd-4dbc-b944-2de7bec0d5c1-00-b7jcjcvwjg4y.pike.replit.dev/portfolio/summary")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (json.summary) {
          setData(json.summary);
          setError(null);
        } else if (json.message) {
          setError(json.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Stock Portfolio Summary</h1>
      <table border={1} cellPadding={6} cellSpacing={0}>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Change %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.price}</td>
              <td>{stock.change_percent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

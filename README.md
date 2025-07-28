# 📈 Stock App

A user-friendly **FastAPI-based stock portfolio management system** that helps you **track your stocks**, monitor **real-time prices**, calculate **profit and loss**, and receive **email notifications** — all with efficient real-time stock data caching.

## 🛠️ Prerequisites

- Node.js and npm
- VS Code installed  
- Git
  
---

## ✅ Features

### 🔐 User Authentication

- **User Registration & Login**: Secure account creation and authentication  
- **Password Reset**: Email-based password recovery system  
- **Account Management**: Profile settings and account deletion  

### 📊 Stock Management

- **Stock Search**: Search for stocks by symbol or company name with autocomplete  
- **Portfolio Tracking**: Add stocks to your personal portfolio  
- **Real-time Data**: Fetch current stock prices and market data  
- **Data Visualization**: Interactive weekly and monthly stock charts  

### 💰 Portfolio Analytics

- **Quantity Tracking**: Record how many shares you own  
- **Purchase Price Tracking**: Log your buy-in prices  
- **Profit/Loss Calculation**: Automatic calculation of gains and losses  
- **Color-coded Performance**: Visual indicators for profitable vs losing positions  

### 📈 Advanced Charts

- **Weekly & Monthly Views**: Separate charts for different time periods  
- **Interactive Data Points**: Click on chart points for detailed information  
- **Horizontal Scrolling**: Handle large datasets with smooth scrolling  
- **Custom Scaling**: Smart Y-axis scaling in multiples of 10  

### ⚙️ User Settings

- **API Key Management**: Configure your Alpha Vantage API key  
- **Email Reminders**: Set up daily portfolio update emails  
- **Timezone Support**: Customize timezone for notifications  
- **Profile Management**: Update personal information  

---

## ⚙️ Installation / Setup

### 📁 Clone the Repository

```bash
git clone https://github.com/your-username/stock-portfolio-tracker-frontend.git
```

🖥️ In **Terminal**, run:

```bash
cd stock-portfolio-tracker-frontend
```

📥 Install dependencies:

```bash
npm install
```

▶️ Start the frontend server:

```bash
npm run dev
```
---

## 🌐 Environment Variables
🌍 Frontend `.env.local` file

Create a `.env.local` file inside the frontend folder with:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
Frontend will be available at:  
👉 `http://localhost:3000`



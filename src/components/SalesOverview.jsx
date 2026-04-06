import '../styles/SalesOverview.css';
import { useState, useEffect } from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="sales__tooltip">
        <p className="sales__tooltip-label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: <strong>${entry.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinanceOverview({ isLoggedIn, transactionsData }) {
  const [timeLabel, setTimeLabel] = useState('1 Month');
  const [chartData, setChartData] = useState([]);

  const handleClick = () => {
    setTimeLabel((prev) => (prev === '1 Month' ? '7 Days' : '1 Month'));
  };

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/month_comparison/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      const formatted = [
        {
          period: 'Last Month',
          income: json.income.last,
          expenses: json.expenses.last,
          investments: json.investments.last,
        },
        {
          period: 'This Month',
          income: json.income.current,
          expenses: json.expenses.current,
          investments: json.investments.current,
        },
      ];

      setChartData(formatted);
    } catch (err) {
      console.error('API error:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    } else {
      setChartData([]); 
    }
  }, [isLoggedIn, transactionsData]); 


  return (
    <div className="sales">
      <div className="sales__header">
        <p className="sales__title">Finance overview</p>

        <button className="timestamp-button" onClick={handleClick}>
          {timeLabel}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
            </linearGradient>

            <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="period"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
            tickFormatter={(v) => `€${v / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />

          {}
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="rgba(239,68,68,0.6)"
            strokeWidth={1.5}
            fill="url(#expensesGrad)"
          />

          {}
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#incomeGrad)"
          />

          {}
          <Area
            type="monotone"
            dataKey="investments"
            name="Investments"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#investGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
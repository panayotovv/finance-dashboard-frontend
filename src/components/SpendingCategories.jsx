import '../styles/SpendingCategories.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="scat__tooltip">
      <span style={{ color: d.payload.color }}>{d.name}</span>: <strong>€{d.value}</strong>
    </div>
  );
};

export default function SpendingCategories({ data = []}) {
  const filtered = data.filter(d => d.value !== 0);
  const total = filtered.reduce((s, d) => s + d.value, 0);
  return (
    <div className="scat">
      <div className="scat__header">
        <p className="scat__title">Top Spending Categories</p>
        <p className="scat__sub">This month's breakdown</p>
      </div>

      <div className="scat__body">
        <div className="scat__chart">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={filtered}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {filtered.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          { data?.length > 0 && (
          <div className="scat__total">
            <span className="scat__total-value">€{total}</span>
            <span className="scat__total-label">spent</span>
          </div>
          )
          }

        </div>

        <div className="scat__legend">
          {[...data]
            .filter(d => d.value !== 0)
            .sort((a, b) => b.value - a.value)
            .map((d, i) => (
              <div key={i} className="scat__legend-item">
                <div className="scat__legend-left">
                  <span className="scat__dot" style={{ background: d.color }} />
                  <span className="scat__legend-name">{d.name}</span>
                </div>
                <div className="scat__legend-right">
                  <span className="scat__legend-value">- €{d.value}</span>
                  <span className="scat__legend-pct">
                    {((d.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
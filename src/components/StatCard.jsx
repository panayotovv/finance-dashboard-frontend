import '../styles/StatCard.css';

export default function StatCard({ label, value, change, positive, icon, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <p className="stat-card__label">{label}</p>
        <div className="stat-card__icon" style={{ background: accent || 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          {icon}
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      {change && (
        <div className={`stat-card__change ${positive ? 'stat-card__change--up' : 'stat-card__change--down'}`}>
          <span>{positive ? '▲' : '▼'}</span>
          {change} vs last month
        </div>
      )}
    </div>
  );
}
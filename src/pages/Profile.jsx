import { useEffect, useState } from "react";
import "./Profile.css";
import { useOutletContext } from 'react-router-dom';

const avatarUrl =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=financedash&backgroundColor=b6e3f4";

const mockUser = {
  username: "Alex Morgan",
  email: "alex.morgan@email.com",
  joined: "January 2023",
  plan: "Pro",
  avatar: avatarUrl,
  stats: {
    totalTransactions: 312,
    savedThisMonth: 1240,
    streak: 27,
    netWorth: 48500,
  },
  recentActivity: [
    { id: 1, label: "Added income: Salary", time: "2h ago", type: "income",  icon: "↑" },
    { id: 2, label: "Expense: Groceries",   time: "5h ago", type: "expense", icon: "↓" },
    { id: 3, label: "Updated budget plan",  time: "Yesterday", type: "update", icon: "✦" },
    { id: 4, label: "Expense: Netflix",     time: "2 days ago", type: "expense", icon: "↓" },
    { id: 5, label: "Added income: Freelance", time: "Last week", type: "income", icon: "↑" },
  ],
  preferences: {
    currency: "USD",
    notifications: true,
    darkMode: true,
    twoFactor: false,
  },
};

export default function Profile() {
  const [prefs, setPrefs] = useState(mockUser.preferences);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { isLoggedIn } = useOutletContext();

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const setCurrency = (currency) => setPrefs((p) => ({ ...p, currency }));

  const fetchUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/user/",{
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })  

      if (response.status === 401) {
        console.warn("Unauthorized. Please log in again.");
        return;
      }

      const user_data = await response.json();

      setFormData(user_data);
    }
      catch (error) { console.error("Error fetching user data:", error); }
  
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setFormData({}); 
    } else {
      fetchUser();    
    }
  }, [isLoggedIn]);  


  return (
    <div className="prof">

      {/* ── Page Body ── */}
      <main className="prof__body">

        {/* ── Hero ── */}
        <div className="prof__hero">
          <div className="prof__hero-left">
            <div className="prof__avatar-wrap">
              <div className="prof__avatar-ring">
                <img src={mockUser.avatar} alt="" className="prof__avatar" />
              </div>
            </div>
            <div className="prof__hero-info">
              <h1 className="prof__hero-name">{formData.username}</h1>
              <div className="prof__hero-meta">
                <span className="prof__hero-email">{formData.email}</span>
              </div>
            </div>
          </div>
          <div className="prof__hero-actions">
            <button
              type="button"
              className="prof__btn prof__btn--ghost"
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
            {editing && (
              <button
                type="button"
                className="prof__btn prof__btn--primary"
                onClick={() => setEditing(false)}
              >
                Save changes
              </button>
            )}
          </div>
        </div>

        <div className="prof__divider" />

        {/* ── Stats Row ── */}
        <div className="prof__stats" role="list" aria-label="Key statistics">
          <div className="prof__stat" role="listitem">
            <span className="prof__stat-icon">💳</span>
            <span className="prof__stat-val prof__stat-val--accent">
              {formData.total_transactions}
            </span>
            <span className="prof__stat-label">Total transactions</span>
          </div>
          <div className="prof__stat" role="listitem">
            <span className="prof__stat-icon">💰</span>
            <span className="prof__stat-val prof__stat-val--green">
              ${mockUser.stats.savedThisMonth.toLocaleString()}
            </span>
            <span className="prof__stat-label">Saved this month</span>
            <span className="prof__stat-delta">+12%</span>
          </div>
          <div className="prof__stat" role="listitem">
            <span className="prof__stat-icon">🔥</span>
            <span className="prof__stat-val prof__stat-val--gold">
              {mockUser.stats.streak}
            </span>
            <span className="prof__stat-label">Day streak</span>
          </div>
          <div className="prof__stat" role="listitem">
            <span className="prof__stat-icon">📈</span>
            <span className="prof__stat-val">
              ${(mockUser.stats.netWorth / 1000).toFixed(1)}k
            </span>
            <span className="prof__stat-label">Net worth tracked</span>
            <span className="prof__stat-delta">+3.2%</span>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="prof__grid">

          {/* Account Details */}
          <section className="prof__card prof__card--account" aria-labelledby="acct-heading">
            <div className="prof__card-head">
              <h2 id="acct-heading" className="prof__card-title">Account details</h2>
            </div>
            {editing ? (
              <div className="prof__form">
                <label className="prof__field">
                  <span className="prof__field-label">Display name</span>
                  <input
                    className="prof__input"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    autoComplete="name"
                  />
                </label>
                <label className="prof__field">
                  <span className="prof__field-label">Email address</span>
                  <input
                    className="prof__input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                  />
                </label>
                <label className="prof__field">
                  <span className="prof__field-label">Plan</span>
                  <div className="prof__field-static">
                    {mockUser.plan} — Billed annually
                  </div>
                </label>
                <div className="prof__field">
                  <span className="prof__field-label">Member since</span>
                  <div className="prof__field-static">{mockUser.joined}</div>
                </div>
              </div>
            ) : (
              <div className="prof__form">
                <div className="prof__field">
                  <span className="prof__field-label">Display name</span>
                  <div className="prof__field-static">{formData.username}</div>
                </div>
                <div className="prof__field">
                  <span className="prof__field-label">Email address</span>
                  <div className="prof__field-static">{formData.email}</div>
                </div>
                <div className="prof__field">
                  <span className="prof__field-label">Plan</span>
                  <div className="prof__field-static">
                    {mockUser.plan} — Billed annually
                  </div>
                </div>
                <div className="prof__field">
                  <span className="prof__field-label">Member since</span>
                  <div className="prof__field-static">{mockUser.joined}</div>
                </div>
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section className="prof__card prof__card--activity" aria-labelledby="activity-heading">
            <div className="prof__card-head">
              <h2 id="activity-heading" className="prof__card-title">Recent activity</h2>
            </div>
            <ol className="prof__timeline">
              {mockUser.recentActivity.map((a) => (
                <li key={a.id} className="prof__timeline-item">
                  <div className={`prof__timeline-icon prof__timeline-icon--${a.type}`}>
                    {a.icon}
                  </div>
                  <div className="prof__timeline-body">
                    <span className="prof__timeline-label">{a.label}</span>
                    <time className="prof__timeline-time">{a.time}</time>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Preferences — spans full height */}
          <section className="prof__card prof__card--prefs" aria-labelledby="prefs-heading">
            <div className="prof__card-head">
              <h2 id="prefs-heading" className="prof__card-title">Preferences</h2>
            </div>
            <ul className="prof__settings">
              {[
                { key: "notifications", label: "Push notifications",       hint: "Alerts for spends and budgets" },
                { key: "darkMode",      label: "Dark mode",                hint: "Matches your dashboard theme"  },
                { key: "twoFactor",     label: "Two-factor authentication",hint: "Extra sign-in protection"      },
              ].map(({ key, label, hint }) => (
                <li key={key} className="prof__setting-row">
                  <div className="prof__setting-copy">
                    <span className="prof__setting-label">{label}</span>
                    <span className="prof__setting-hint">{hint}</span>
                  </div>
                  <button
                    type="button"
                    className={`prof__switch ${prefs[key] ? "prof__switch--on" : ""}`}
                    role="switch"
                    aria-checked={prefs[key]}
                    aria-label={label}
                    onClick={() => toggle(key)}
                  >
                    <span className="prof__switch-thumb" />
                  </button>
                </li>
              ))}
              <li className="prof__setting-row">
                <div className="prof__setting-copy">
                  <span className="prof__setting-label">Default currency</span>
                  <span className="prof__setting-hint">Used for totals and exports</span>
                </div>
                <select
                  className="prof__select"
                  value={prefs.currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  aria-label="Default currency"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="BGN">BGN</option>
                </select>
              </li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
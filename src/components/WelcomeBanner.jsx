import '../styles/WelcomeBanner.css';

export default function WelcomeBanner({ name, subtitle, onRecord }) {
  return (
    <div className="welcome-banner">
      <div className="welcome-banner__text">
        <p className="welcome-banner__greeting">Welcome back,</p>
        <h2 className="welcome-banner__name">{name}</h2>
        <p className="welcome-banner__subtitle">{subtitle}</p>
        <button className="welcome-banner__cta" onClick={onRecord}>Tap to record →</button>
      </div>
      <svg
        className="welcome-banner__rings"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="220" cy="80" r="140" fill="none" stroke="rgba(99,102,241,0.45)" strokeWidth="0.8"/>
        <circle cx="220" cy="80" r="95"  fill="none" stroke="rgba(112,72,232,0.45)"  strokeWidth="0.8"/>
        <circle cx="220" cy="80" r="52"  fill="none" stroke="rgba(99,102,241,0.4)"   strokeWidth="0.8"/>
        <line x1="220" y1="0"   x2="80"  y2="200" stroke="rgba(99,102,241,0.2)"  strokeWidth="0.6"/>
        <line x1="60"  y1="80"  x2="290" y2="160" stroke="rgba(112,72,232,0.2)" strokeWidth="0.6"/>
        <line x1="100" y1="0"   x2="240" y2="220" stroke="rgba(99,102,241,0.15)" strokeWidth="0.6"/>
        <radialGradient id="ringGlow" cx="73%" cy="27%" r="55%">
          <stop offset="0%"   stopColor="rgba(99,102,241,1)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="rgba(99,102,241,0)" stopOpacity="0"/>
        </radialGradient>
        <rect x="0" y="0" width="300" height="300" fill="url(#ringGlow)"/>
      </svg>
    </div>
  );
}
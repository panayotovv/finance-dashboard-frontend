import { useState } from 'react';
import '../styles/Login.css';

function Login({ onSuccess, onClose, onSwitchToRegister}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) return setError('Please enter your username.');
    if (!password) return setError('Please enter your password.');

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>

        <div className="login-header">
          <div>
            <p className="login-eyebrow">Welcome back</p>
            <h2 className="login-title">Sign in</h2>
          </div>
          {onClose && (
            <button className="login-close" onClick={onClose} type="button">✕</button>
          )}
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Username</label>
          <input
            type="text"
            autoComplete='off'
            spellCheck="false"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            className="login-field-input"
          />
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Password</label>
          <input
            type="password"
            autoComplete='off'
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="login-field-input"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="login-actions">
          {onClose && (
            <button className="login-btn-cancel" onClick={onClose} type="button">Cancel</button>
          )}
          <button
            className="login-btn-submit"
            onClick={handleSubmit}
            type="button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="login-footer">
            Don't have an account?{" "}
            <a href='#'
                onClick={onSwitchToRegister}
            >
                Sign up
            </a>
        </p>

      </div>
    </div>
  );
}

export default Login;
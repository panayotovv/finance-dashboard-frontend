import { useState } from 'react';
import '../styles/Login.css';

function Register({ onSuccess, onClose, onSwitchToLogin  }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) return setError('Please enter your username.');
    if (!email) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');
    if (password !== confirmPassword)
      return setError('Passwords do not match.');

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
      });
        const data = await response.json();
        
      if (!response.ok) {
        setError(data?.detail || 'Registration failed. Try different credentials.');
        return;
      }

      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Registration failed. Try different credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>

        <div className="login-header">
          <div>
            <p className="login-eyebrow">Get started</p>
            <h2 className="login-title">Create account</h2>
          </div>
          <button className="login-close" onClick={onClose}>✕</button>
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Username</label>
          <input
            className="login-field-input"
            type='text'
            spellCheck="false"
            autoComplete='off'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Email</label>
          <input
            className="login-field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Password</label>
          <input
            type="password"
            className="login-field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div className="login-field-group">
          <label className="login-field-label">Confirm Password</label>
          <input
            type="password"
            className="login-field-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="login-actions">
          <button className="login-btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="login-btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </div>


        <p className="login-footer">
            Already have an account?{" "}
            <a href='#'
                onClick={onSwitchToLogin}
            >
                Sign in
            </a>
        </p>

      </div>
    </div>
  );
}

export default Register;
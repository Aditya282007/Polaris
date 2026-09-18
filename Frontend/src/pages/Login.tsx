import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      localStorage.setItem('polaris_token', 'demo-token');
      localStorage.setItem('polaris_user', username);
      navigate('/');
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 login-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-ui font-bold text-3xl text-primary tracking-tight mb-1">POLARIS</h1>
          <p className="text-muted text-sm uppercase tracking-wider">MISSION CONTROL LOGIN</p>
        </div>

        <div className="liquid-glass">
          {error && (
            <div className="mb-6 p-4 liquid-glass border" style={{ borderColor: 'rgba(192, 57, 43, 0.3)' }} text-critical text-sm font-ui>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-2">
                OPERATOR ID
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter operator ID"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS MISSION CONTROL'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
            <p className="text-xs text-muted text-center">
              Demo credentials: <span className="font-mono text-primary">OPS-CTR-DELHI</span>, <span className="font-mono text-primary">HIMADRI-OPS</span>, <span className="font-mono text-primary">BHARATI-MED</span>
            </p>
            <p className="text-xs text-muted text-center mt-1">
              SIH 2026 PS26062 — NCPOR Polar Expedition Logistics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
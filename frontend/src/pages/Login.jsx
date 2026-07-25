import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setLoading(true); setError('');
    try {
      await login('demo@stockdashboard.com', 'demo123');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '11px',
    paddingBottom: '11px',
    background: '#0a0e17',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0e17', padding: '1rem', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '1rem' }}>
            <TrendingUp size={28} color="#6366f1" />
          </div>
          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>StockMarket</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Professional Trading Dashboard</p>
        </div>

        {/* Demo notice */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#6366f1" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ color: '#a5b4fc', fontSize: '0.8rem', fontWeight: '600', margin: 0 }}>Quick Demo Access</p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Email: <strong style={{ color: '#94a3b8' }}>demo@stockdashboard.com</strong> &nbsp;·&nbsp; Password: <strong style={{ color: '#94a3b8' }}>demo123</strong></p>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Welcome back</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>Email or Username</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email or username" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, marginTop: '0.25rem', transition: 'opacity 0.2s' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Demo button */}
          <button onClick={loginAsDemo} disabled={loading} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '10px', padding: '11px', fontSize: '0.875rem', fontWeight: '600', color: '#818cf8', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Zap size={15} /> Login with Demo Account
          </button>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Sign up free</Link>
            </p>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.7rem', textAlign: 'center', marginTop: '1.5rem' }}>
          100% local — no server required · Data saved in your browser
        </p>
      </div>
    </div>
  );
};

export default Login;

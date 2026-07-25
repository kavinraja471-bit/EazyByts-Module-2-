import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || err.response?.data?.msg || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

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
  };

  const perks = ['No credit card required', 'All data stored locally', 'Full dashboard access'];

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

        {/* Perks */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {perks.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Check size={12} color="#10b981" />
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Create your account</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start tracking your portfolio today</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Username', key: 'username', type: 'text', icon: User, placeholder: 'Choose a username' },
              { label: 'Email Address', key: 'email', type: 'email', icon: Mail, placeholder: 'Enter your email' },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type={type} value={form[key]} onChange={e => setF(key, e.target.value)} placeholder={placeholder} required style={inputStyle} />
                </div>
              </div>
            ))}

            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setF('password', e.target.value)} placeholder="Create a password (min 4 chars)" required style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, marginTop: '0.25rem', transition: 'opacity 0.2s' }}>
              {loading ? 'Creating account...' : 'Create Account — It\'s Free'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.7rem', textAlign: 'center', marginTop: '1.5rem' }}>
          100% local · No server required · Your data never leaves your device
        </p>
      </div>
    </div>
  );
};

export default Register;

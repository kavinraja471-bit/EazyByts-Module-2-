import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, User, Bell, Palette, Globe, RefreshCw, Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { settings, setSettings, user, setUser } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localUser, setLocalUser] = useState(user);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    setUser(localUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, icon: Icon, children }) => (
    <div className="rounded-xl border border-white/5 p-6" style={{ background: '#111827' }}>
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
        <Icon size={18} className="text-indigo-400" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, desc, children }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-slate-500 text-xs mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={22} className="text-indigo-400" />
          <div><h1 className="text-white text-xl font-bold">Settings</h1><p className="text-slate-400 text-sm">Manage your preferences</p></div>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'text-white hover:opacity-90'}`} style={!saved ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="space-y-0">
          <Field label="Full Name" desc="Your display name across the platform">
            <input value={localUser.name} onChange={e => setLocalUser(p => ({ ...p, name: e.target.value }))}
              className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none focus:border-indigo-500/50 w-48"
              style={{ background: '#1a2235' }} />
          </Field>
          <Field label="Email Address" desc="Your account email">
            <input value={localUser.email} onChange={e => setLocalUser(p => ({ ...p, email: e.target.value }))} type="email"
              className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none focus:border-indigo-500/50 w-48"
              style={{ background: '#1a2235' }} />
          </Field>
          <Field label="Current Plan" desc="Your subscription tier">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-indigo-400 bg-indigo-500/10">{localUser.plan} Plan</span>
          </Field>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <Field label="Theme" desc="Choose your preferred color scheme">
          <div className="flex gap-2">
            {['dark', 'light', 'system'].map(t => (
              <button key={t} onClick={() => setLocalSettings(p => ({ ...p, theme: t }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${localSettings.theme === t ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {t}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Field label="Price Alerts" desc="Get notified when your price alerts are triggered">
          <Toggle checked={localSettings.notifications} onChange={v => setLocalSettings(p => ({ ...p, notifications: v }))} />
        </Field>
        <Field label="Email Alerts" desc="Receive alerts via email">
          <Toggle checked={localSettings.emailAlerts} onChange={v => setLocalSettings(p => ({ ...p, emailAlerts: v }))} />
        </Field>
        <Field label="Market Updates" desc="Daily market summary notifications">
          <Toggle checked={localSettings.marketUpdates || false} onChange={v => setLocalSettings(p => ({ ...p, marketUpdates: v }))} />
        </Field>
      </Section>

      {/* Market Preferences */}
      <Section title="Market & Data" icon={Globe}>
        <Field label="Currency" desc="Display currency for prices and values">
          <select value={localSettings.currency} onChange={e => setLocalSettings(p => ({ ...p, currency: e.target.value }))}
            className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
            style={{ background: '#1a2235' }}>
            {['USD', 'INR', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Data Refresh Interval" desc="How often to refresh live market data">
          <select value={localSettings.refreshInterval} onChange={e => setLocalSettings(p => ({ ...p, refreshInterval: Number(e.target.value) }))}
            className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
            style={{ background: '#1a2235' }}>
            {[5, 10, 15, 30, 60].map(s => <option key={s} value={s}>{s}s</option>)}
          </select>
        </Field>
        <Field label="Market Preference" desc="Default market to show on dashboard">
          <select value={localSettings.market || 'NSE'} onChange={e => setLocalSettings(p => ({ ...p, market: e.target.value }))}
            className="px-3 py-1.5 rounded-lg text-white text-sm border border-white/10 outline-none"
            style={{ background: '#1a2235' }}>
            {['NSE', 'BSE', 'NASDAQ', 'NYSE'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
      </Section>
    </div>
  );
};

export default SettingsPage;

import React, { useRef, useEffect } from 'react';
import { User, Settings, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onClose, onLogout, onUpgrade }) => {
  const { user } = useApp();
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const items = [
    { icon: User, label: 'My Profile', action: () => { navigate('/settings'); onClose(); } },
    { icon: Settings, label: 'Settings', action: () => { navigate('/settings'); onClose(); } },
    { icon: CreditCard, label: 'Subscription', action: () => { onUpgrade(); onClose(); } },
  ];

  return (
    <div ref={ref} className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden" style={{ background: '#1a2235' }}>
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-white text-sm font-semibold">{user?.name}</p>
        <p className="text-slate-400 text-xs">{user?.email}</p>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-400 bg-indigo-500/10">{user?.plan} Plan</span>
      </div>
      {items.map(({ icon: Icon, label, action }) => (
        <button key={label} onClick={action} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
          <Icon size={14} className="text-slate-400" />
          <span className="text-slate-300 text-sm flex-1">{label}</span>
          <ChevronRight size={12} className="text-slate-600" />
        </button>
      ))}
      <div className="border-t border-white/5">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left">
          <LogOut size={14} className="text-red-400" />
          <span className="text-red-400 text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;

import React, { useEffect, useRef } from 'react';
import { Bell, CheckCheck, Trash2, TrendingUp, AlertCircle, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const iconMap = { alert: AlertCircle, market: TrendingUp, portfolio: Briefcase };

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markRead, markAllRead, deleteNotification } = useApp();
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden" style={{ background: '#1a2235' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Notifications</h3>
        <button onClick={markAllRead} className="text-indigo-400 text-xs hover:text-indigo-300 flex items-center gap-1">
          <CheckCheck size={12} /> Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-slate-500">
            <Bell size={28} className="mb-2 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map(n => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                  <Icon size={14} className={!n.read ? 'text-indigo-400' : 'text-slate-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">{n.message}</p>
                  <p className="text-slate-600 text-[10px] mt-1">{n.time}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {!n.read && <button onClick={() => markRead(n.id)} className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white"><CheckCheck size={12} /></button>}
                  <button onClick={() => deleteNotification(n.id)} className="p-1 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

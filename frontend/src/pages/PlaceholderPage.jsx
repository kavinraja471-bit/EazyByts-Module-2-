import React from 'react';

const PlaceholderPage = ({ title, icon: Icon, description }) => {
  return (
    <div className="flex-col items-center justify-center h-full w-full" style={{ minHeight: '60vh' }}>
      <div className="glass-card flex-col items-center justify-center p-8 text-center" style={{ maxWidth: '400px' }}>
        <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
          {Icon && <Icon size={48} className="text-accent" />}
        </div>
        <h2 className="mb-2" style={{ fontSize: '1.5rem' }}>{title}</h2>
        <p className="text-muted mb-6">{description}</p>
        <button className="btn btn-primary w-full">Coming Soon</button>
      </div>
    </div>
  );
};

export default PlaceholderPage;

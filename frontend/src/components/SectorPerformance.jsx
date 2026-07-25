import React from 'react';
import { Info } from 'lucide-react';
import { sectorPerformance } from '../data/mockData';

const SectorPerformance = () => {
  return (
    <div className="panel">
      <div className="panel-title">
        Sector Performance <Info size={16} className="text-muted" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {sectorPerformance.map((sector, idx) => (
          <div 
            key={idx} 
            style={{
              background: sector.positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '12px 8px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sector.name}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: sector.positive ? 'var(--success)' : 'var(--danger)' }}>
              {sector.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorPerformance;

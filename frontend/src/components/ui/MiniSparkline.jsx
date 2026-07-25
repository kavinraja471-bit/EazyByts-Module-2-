import React from 'react';

const MiniSparkline = ({ positive = true, width = 48, height = 24 }) => {
  const points = positive
    ? [20, 18, 15, 19, 12, 16, 8, 14, 4, 10, 2]
    : [2, 4, 8, 3, 10, 5, 12, 6, 14, 8, 18];

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const svgPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const color = positive ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline points={svgPoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default MiniSparkline;

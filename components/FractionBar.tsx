// FractionBar React component
'use client';

import React from 'react';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  fillRole?: 'A' | 'B' | 'sum' | 'neutral';
  width?: number;
  height?: number;
}

const FILL_COLORS = {
  A: '#2563EB',
  B: '#EA580C',
  sum: '#7C3AED',
  neutral: '#E5E7EB',
};

export function FractionBar({ 
  numerator, 
  denominator, 
  fillRole = 'neutral',
  width = 312,
  height = 48 
}: FractionBarProps) {
  const partWidth = width / denominator;
  const fillColor = FILL_COLORS[fillRole];
  const emptyColor = '#F3F4F6';
  const strokeColor = '#9CA3AF';

  return (
    <div className="fraction-bar" style={{ width, height }}>
      <svg width={width} height={height} className="border border-gray-300 rounded">
        {Array.from({ length: denominator }).map((_, i) => {
          const isShaded = i < numerator;
          return (
            <rect
              key={i}
              x={i * partWidth}
              y={0}
              width={partWidth}
              height={height}
              fill={isShaded ? fillColor : emptyColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
          );
        })}
      </svg>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Wind, 
  Flame, 
  Layers, 
  Compass, 
  CloudFog,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { AQICategory, MetricSummary } from '../types';
import { getAqiTheme } from '../utils/aqiUtils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusBadge?: {
    text: string;
    variant: 'good' | 'moderate' | 'poor' | 'severe' | 'neutral' | 'inversion';
  };
  changePercent?: number;
  changeLabel?: string;
  sparklineData: number[];
  sparklineColor?: string;
  icon: React.ElementType;
  tooltipText: string;
  scientificContext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  statusBadge,
  changePercent,
  changeLabel = 'vs 24h ago',
  sparklineData,
  sparklineColor = '#166534',
  icon: Icon,
  tooltipText,
  scientificContext,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate SVG sparkline points
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 120;
  const height = 36;
  const padding = 4;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const isPositiveChange = (changePercent ?? 0) > 0;

  // Status badge styling
  const getBadgeStyle = () => {
    if (!statusBadge) return '';
    switch (statusBadge.variant) {
      case 'good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'poor':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'severe':
        return 'bg-rose-100 text-rose-950 border-rose-400 font-bold';
      case 'inversion':
        return 'bg-rust-100 text-rust-900 border-rust-300';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="relative bg-[#ffffff] border border-[#dce3d8] rounded-xl p-4.5 shadow-subtle hover:shadow-panel transition-all duration-200 group flex flex-col justify-between">
      
      {/* Top row: Icon + Title + Info Tooltip */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#eff4eb] border border-[#d0ddcb] flex items-center justify-center text-[#244331] group-hover:scale-105 transition-transform">
            <Icon className="w-4 h-4 text-forest-800" />
          </div>
          <span className="text-xs font-semibold text-graphite-700 tracking-wide uppercase font-mono">
            {title}
          </span>
        </div>

        {/* Tooltip button */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-graphite-400 hover:text-graphite-700 p-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Hover Tooltip Popup */}
          {showTooltip && (
            <div className="absolute right-0 top-6 w-60 p-2.5 bg-[#141d18] text-ivory-100 text-[11px] rounded-lg shadow-elevation border border-[#2b3c30] z-50 pointer-events-none leading-relaxed">
              <div className="font-semibold text-emerald-400 font-mono mb-1">{title}</div>
              <p className="text-graphite-200">{tooltipText}</p>
              {scientificContext && (
                <div className="mt-1.5 pt-1.5 border-t border-[#26372d] text-[10px] text-graphite-400 font-mono">
                  {scientificContext}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Main Value & Unit & Status Badge */}
      <div className="my-1.5">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-graphite-900 tracking-tight font-sans">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono text-graphite-500 font-medium">
              {unit}
            </span>
          )}
        </div>

        {statusBadge && (
          <div className="mt-1.5">
            <span className={`inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
              {statusBadge.text}
            </span>
          </div>
        )}
      </div>

      {/* Bottom: Sparkline + Trend Indicator */}
      <div className="mt-3 pt-2.5 border-t border-[#eaf0e6] flex items-end justify-between">
        
        {/* Trend Indicator */}
        {changePercent !== undefined && (
          <div className="flex items-center space-x-1 text-[11px] font-mono">
            {isPositiveChange ? (
              <TrendingUp className="w-3.5 h-3.5 text-rust-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-forest-700" />
            )}
            <span className={`font-semibold ${isPositiveChange ? 'text-rust-700' : 'text-forest-700'}`}>
              {isPositiveChange ? `+${changePercent}%` : `${changePercent}%`}
            </span>
            <span className="text-graphite-400 text-[10px] hidden sm:inline">{changeLabel}</span>
          </div>
        )}

        {/* SVG Sparkline */}
        <div className="shrink-0 ml-2">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* Last dot */}
            {points.split(' ').length > 0 && (
              <circle
                cx={points.split(' ').slice(-1)[0].split(',')[0]}
                cy={points.split(' ').slice(-1)[0].split(',')[1]}
                r="3"
                fill={sparklineColor}
                className="animate-ping opacity-75"
              />
            )}
            {points.split(' ').length > 0 && (
              <circle
                cx={points.split(' ').slice(-1)[0].split(',')[0]}
                cy={points.split(' ').slice(-1)[0].split(',')[1]}
                r="2.5"
                fill={sparklineColor}
              />
            )}
          </svg>
        </div>

      </div>

    </div>
  );
};

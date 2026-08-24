import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Calendar, Info, Layers, Orbit, Sparkles } from 'lucide-react';
import { PollutionTimeSeriesPoint, TimeWindow } from '../types';

interface PollutionChartProps {
  data7D: PollutionTimeSeriesPoint[];
  data30D: PollutionTimeSeriesPoint[];
  dataMonthly: PollutionTimeSeriesPoint[];
  selectedWindow: TimeWindow;
  onWindowChange: (window: TimeWindow) => void;
}

// Custom Scientific Tooltip Component
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141d18] border border-[#273a2e] p-3 rounded-lg shadow-elevation text-xs font-mono text-ivory-100 min-w-[200px]">
        <div className="font-bold text-emerald-400 border-b border-[#233229] pb-1 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-graphite-400">S5P Pass Collocated</span>
        </div>
        
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => (
            <div key={`tooltip-item-${idx}`} className="flex items-center justify-between">
              <span className="text-graphite-300 text-[11px]" style={{ color: item.color }}>
                ● {item.name}:
              </span>
              <span className="font-bold text-ivory-50">
                {item.value} {item.unit || ''}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-1.5 border-t border-[#233229] text-[9px] text-graphite-400">
          Source: Ground CAAQMS & TROPOMI L2 DOAS
        </div>
      </div>
    );
  }
  return null;
};

export const PollutionChart: React.FC<PollutionChartProps> = ({
  data7D,
  data30D,
  dataMonthly,
  selectedWindow,
  onWindowChange,
}) => {
  const [activeSeries, setActiveSeries] = useState({
    surfaceNo2: true,
    predictedAqi: true,
    tropomiNo2: true,
  });

  const currentData = 
    selectedWindow === '7D' 
      ? data7D 
      : selectedWindow === '30D' 
        ? data30D 
        : dataMonthly;

  const toggleSeries = (key: keyof typeof activeSeries) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#edf1e8]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              Atmospheric Pollution Trend
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#f0f4ed] text-forest-800 px-2 py-0.5 rounded border border-[#d2decb]">
              Ground vs Satellite
            </span>
          </div>
          <p className="text-xs text-graphite-500 mt-0.5">
            Collocated surface NO₂ concentrations, AI-predicted AQI, and Sentinel-5P tropospheric column
          </p>
        </div>

        {/* Time Window Switcher (7 Days | 30 Days | Monthly) */}
        <div className="flex items-center space-x-1 bg-[#f0f4ed] p-1 rounded-lg border border-[#d6e0d0] shrink-0 self-start sm:self-auto">
          {(['7D', '30D', 'Monthly'] as TimeWindow[]).map((win) => {
            const isSelected = selectedWindow === win;
            return (
              <button
                key={win}
                onClick={() => onWindowChange(win)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                  isSelected
                    ? 'bg-[#1b2b21] text-emerald-300 font-bold shadow-sm'
                    : 'text-graphite-600 hover:text-graphite-900 hover:bg-[#e4ecdf]'
                }`}
              >
                {win === '7D' ? '7 Days' : win === '30D' ? '30 Days' : 'Monthly'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorNo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803d" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#15803d" stopOpacity={0.0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e8ede3" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#cbd5cb' }}
              tickLine={{ stroke: '#cbd5cb' }}
            />
            
            {/* Left Y Axis for Surface NO2 and AQI */}
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#cbd5cb' }}
              tickLine={{ stroke: '#cbd5cb' }}
              domain={[0, 'dataMax + 40']}
            />

            {/* Right Y Axis for TROPOMI Column NO2 */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#b45309', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#fef3c7' }}
              tickLine={false}
              domain={[0, 8]}
              unit=" ×10¹⁵"
            />

            <Tooltip content={<CustomChartTooltip />} />

            {/* Area for Predicted AQI */}
            {activeSeries.predictedAqi && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="predictedAqi"
                name="Predicted Surface AQI"
                unit=""
                stroke="#c2410c"
                strokeWidth={2.5}
                fill="url(#colorAqi)"
              />
            )}

            {/* Line for Surface NO2 */}
            {activeSeries.surfaceNo2 && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="surfaceNo2"
                name="Surface NO₂ (Ground)"
                unit="µg/m³"
                stroke="#15803d"
                strokeWidth={2.2}
                dot={{ fill: '#15803d', r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {/* Dash Line for TROPOMI Column NO2 */}
            {activeSeries.tropomiNo2 && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tropomiNo2"
                name="TROPOMI NO₂ Column"
                unit="×10¹⁵ mol/cm²"
                stroke="#b45309"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#b45309', r: 2.5 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Series Filter Legend */}
      <div className="mt-3 pt-2.5 border-t border-[#edf1e8] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleSeries('predictedAqi')}
            className={`flex items-center space-x-1.5 transition-opacity ${
              activeSeries.predictedAqi ? 'opacity-100 font-semibold' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-3 rounded-sm bg-rust-600 inline-block"></span>
            <span className="text-graphite-800">Predicted AQI (Surface)</span>
          </button>

          <button
            onClick={() => toggleSeries('surfaceNo2')}
            className={`flex items-center space-x-1.5 transition-opacity ${
              activeSeries.surfaceNo2 ? 'opacity-100 font-semibold' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-3 rounded-sm bg-forest-700 inline-block"></span>
            <span className="text-graphite-800">Surface NO₂ (µg/m³)</span>
          </button>

          <button
            onClick={() => toggleSeries('tropomiNo2')}
            className={`flex items-center space-x-1.5 transition-opacity ${
              activeSeries.tropomiNo2 ? 'opacity-100 font-semibold' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-1 border-t-2 border-dashed border-amber-600 inline-block"></span>
            <span className="text-graphite-800">TROPOMI NO₂ Column</span>
          </button>
        </div>

        <div className="text-[11px] text-graphite-400">
          Click series to toggle visibility
        </div>
      </div>

    </div>
  );
};

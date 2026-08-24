import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Flame, 
  ArrowRight, 
  Orbit, 
  Wind, 
  Info, 
  ShieldAlert, 
  Sparkles,
  Activity
} from 'lucide-react';
import { FireBiomassInfluencePoint } from '../types';

interface FireAnalysisProps {
  biomassData: FireBiomassInfluencePoint[];
}

const CustomBiomassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141d18] border border-[#273a2e] p-3 rounded-lg shadow-elevation text-xs font-mono text-ivory-100 min-w-[210px]">
        <div className="font-bold text-orange-400 border-b border-[#233229] pb-1 mb-2">
          {label} — Atmospheric Telemetry
        </div>
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => (
            <div key={`biomass-tip-${idx}`} className="flex items-center justify-between">
              <span className="text-graphite-300 text-[11px]" style={{ color: item.color }}>
                ● {item.name}:
              </span>
              <span className="font-bold text-ivory-50">
                {item.value} {item.unit || ''}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-1 border-t border-[#233229] text-[9px] text-graphite-400">
          Coupled MODIS FRP + TROPOMI HCHO DOAS
        </div>
      </div>
    );
  }
  return null;
};

export const FireAnalysis: React.FC<FireAnalysisProps> = ({ biomassData }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="pb-3 border-b border-[#edf1e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rust-100 border border-rust-300 flex items-center justify-center text-rust-700">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              Biomass Burning Influence
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-rust-50 text-rust-800 border border-rust-200 px-2 py-0.5 rounded">
            MODIS / VIIRS → TROPOMI
          </span>
        </div>
        <p className="text-xs text-graphite-500 mt-1">
          Coupled satellite observation of crop residue combustion, pyrogenic formaldehyde precursor, and downwind NO₂ plume lag
        </p>
      </div>

      {/* Physical Mechanism Flowchart */}
      <div className="my-4 bg-[#f6f8f4] p-3 rounded-lg border border-[#dce4d6]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-graphite-500 mb-2 font-semibold flex items-center space-x-1.5">
          <Activity className="w-3 h-3 text-forest-700" />
          <span>Atmospheric Physics Chain</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          
          {/* Step 1 */}
          <div className="bg-white p-2.5 rounded-md border border-[#d0ddca] flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-rust-700 font-mono text-xs font-bold">
              <span>🔥</span>
              <span>1. Fire Activity</span>
            </div>
            <p className="text-[10px] text-graphite-600 mt-1 leading-tight">
              MODIS / VIIRS detects agricultural stubble combustion & FRP.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-2.5 rounded-md border border-[#d0ddca] flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-purple-700 font-mono text-xs font-bold">
              <span>🔬</span>
              <span>2. HCHO Enhancement</span>
            </div>
            <p className="text-[10px] text-graphite-600 mt-1 leading-tight">
              TROPOMI detects formaldehyde as reactive biomass VOC oxidation proxy.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-2.5 rounded-md border border-[#d0ddca] flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-forest-800 font-mono text-xs font-bold">
              <span>🧪</span>
              <span>3. NO₂ Formation</span>
            </div>
            <p className="text-[10px] text-graphite-600 mt-1 leading-tight">
              High-temperature combustion and plume photochemistry yield elevated NO₂.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-2.5 rounded-md border border-[#d0ddca] flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-teal-800 font-mono text-xs font-bold">
              <span>💨</span>
              <span>4. Downwind Plume</span>
            </div>
            <p className="text-[10px] text-graphite-600 mt-1 leading-tight">
              ERA5 wind fields advect pyrogenic smoke across Delhi NCR & UP.
            </p>
          </div>

        </div>
      </div>

      {/* Multi-axis Synchronized Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={biomassData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ede3" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#cbd5cb' }}
              tickLine={{ stroke: '#cbd5cb' }}
            />
            
            {/* Left Axis: Active Fire Count */}
            <YAxis 
              yAxisId="fire"
              tick={{ fill: '#c2410c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#fed7aa' }}
              tickLine={false}
              domain={[0, 1600]}
              unit=" fires"
            />

            {/* Right Axis: HCHO Column & Downwind NO2 */}
            <YAxis 
              yAxisId="traceGas"
              orientation="right"
              tick={{ fill: '#6b21a8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#e9d5ff' }}
              tickLine={false}
              domain={[0, 100]}
            />

            <Tooltip content={<CustomBiomassTooltip />} />

            {/* Bars for Fire Count */}
            <Bar
              yAxisId="fire"
              dataKey="fireCount"
              name="Active Fire Count"
              unit=" Detections"
              fill="#ea580c"
              opacity={0.85}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />

            {/* Line for HCHO */}
            <Line
              yAxisId="traceGas"
              type="monotone"
              dataKey="hchoColumn"
              name="HCHO Column (scaled)"
              unit=" ×10¹⁵ molec/cm²"
              stroke="#9333ea"
              strokeWidth={2.5}
              dot={{ fill: '#9333ea', r: 3 }}
            />

            {/* Line for Downwind NO2 */}
            <Line
              yAxisId="traceGas"
              type="monotone"
              dataKey="downwindNo2"
              name="Downwind Surface NO₂"
              unit=" µg/m³"
              stroke="#15803d"
              strokeWidth={2.5}
              dot={{ fill: '#15803d', r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Scientific Card */}
      <div className="mt-3 p-3 bg-[#fafbf9] rounded-lg border border-[#e0e7dc] text-xs text-graphite-600 space-y-1">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-graphite-900">Scientific Context:</strong> Potential source influence is estimated using fire activity, atmospheric composition, and wind transport. Formaldehyde (HCHO) acts as an atmospheric tracer of pyrogenic volatile organic compounds emitted during stubble combustion.
          </p>
        </div>
        <div className="text-[10px] font-mono text-graphite-400 pl-6">
          * Notice: Prototype mock telemetry visualized for frontend validation prior to Google Earth Engine FIRMS pipeline integration.
        </div>
      </div>

    </div>
  );
};

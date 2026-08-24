import React from 'react';
import { 
  X, 
  MapPin, 
  Wind, 
  Flame, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight, 
  Gauge, 
  Layers, 
  CloudSun,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RegionTelemetry } from '../types';
import { getAqiTheme, getFireInfluenceBadge } from '../utils/aqiUtils';

interface RegionDetailDrawerProps {
  region: RegionTelemetry | null;
  onClose: () => void;
  onViewDetailedAnalysis?: (region: RegionTelemetry) => void;
}

export const RegionDetailDrawer: React.FC<RegionDetailDrawerProps> = ({
  region,
  onClose,
  onViewDetailedAnalysis,
}) => {
  if (!region) return null;

  const aqiTheme = getAqiTheme(region.aqiCategory);
  const fireBadge = getFireInfluenceBadge(region.fireInfluence);

  return (
    <div className="fixed sm:absolute right-4 bottom-4 top-auto sm:top-20 z-40 w-[calc(100%-2rem)] sm:w-96 bg-[#131d17]/95 backdrop-blur-md border border-[#273a2e] rounded-xl shadow-elevation text-ivory-100 overflow-hidden transition-all duration-300 font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-[#233229] flex items-start justify-between bg-[#0e1612]">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-graphite-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{region.state}</span>
          </div>
          <h3 className="text-lg font-bold text-ivory-50 tracking-tight mt-0.5">
            {region.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-graphite-400 hover:text-ivory-50 hover:bg-[#1a2920] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main AQI Status Callout */}
      <div className="p-4 bg-gradient-to-b from-[#18261e] to-[#121c16] border-b border-[#233229]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase text-graphite-300">
              Surface AQI Prediction
            </div>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-4xl font-extrabold text-ivory-50 font-sans">
                {region.aqi}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${aqiTheme.badge}`}>
                {region.aqiCategory}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-graphite-400">Prediction Confidence</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {region.predictionConfidence}%
            </div>
          </div>
        </div>

        <p className="text-xs text-graphite-300 mt-2.5 leading-relaxed bg-[#0c130f] p-2 rounded-lg border border-[#202d24]">
          {region.overviewSummary}
        </p>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="p-4 grid grid-cols-2 gap-2.5 text-xs font-mono">
        
        {/* NO2 */}
        <div className="bg-[#0e1612] p-2.5 rounded-lg border border-[#223328]">
          <span className="text-[10px] text-graphite-400 uppercase block">Surface NO₂</span>
          <span className="text-sm font-bold text-ivory-100">{region.no2} µg/m³</span>
          <span className="text-[10px] text-graphite-400 block mt-0.5">Ground-Calibrated</span>
        </div>

        {/* HCHO */}
        <div className="bg-[#0e1612] p-2.5 rounded-lg border border-[#223328]">
          <span className="text-[10px] text-graphite-400 uppercase block">HCHO Column</span>
          <span className="text-sm font-bold text-purple-300">{region.hcho}</span>
          <span className="text-[10px] text-graphite-400 block mt-0.5">molecules/cm²</span>
        </div>

        {/* Fire Influence */}
        <div className="bg-[#0e1612] p-2.5 rounded-lg border border-[#223328]">
          <span className="text-[10px] text-graphite-400 uppercase block">Fire Influence</span>
          <div className="flex items-center space-x-1 mt-0.5">
            <Flame className="w-3.5 h-3.5 text-rust-500" />
            <span className="text-sm font-bold text-rust-400">{region.fireInfluence}</span>
          </div>
          <span className="text-[10px] text-graphite-400 block mt-0.5">MODIS FRP Tracer</span>
        </div>

        {/* BLH */}
        <div className="bg-[#0e1612] p-2.5 rounded-lg border border-[#223328]">
          <span className="text-[10px] text-graphite-400 uppercase block">Boundary Layer</span>
          <span className="text-sm font-bold text-amber-300">{region.blh} m</span>
          <span className="text-[10px] text-graphite-400 block mt-0.5">ERA5 Inversion</span>
        </div>

        {/* Wind Vector */}
        <div className="bg-[#0e1612] p-2.5 rounded-lg border border-[#223328] col-span-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-graphite-400 uppercase block">Wind Vector (10m)</span>
            <span className="text-xs font-bold text-teal-300">{region.wind}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-ivory-100">{region.windSpeed} m/s</span>
            <span className="text-[10px] text-graphite-400 block">Advection speed</span>
          </div>
        </div>

      </div>

      {/* Footer Action Button */}
      <div className="p-3.5 bg-[#0e1612] border-t border-[#233229]">
        <button
          onClick={() => {
            if (onViewDetailedAnalysis) onViewDetailedAnalysis(region);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-forest-800 hover:bg-forest-700 text-ivory-50 text-xs font-semibold rounded-lg transition-colors border border-forest-600 shadow-sm"
        >
          <span>View Detailed Analysis</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Sliders, 
  Play, 
  RotateCcw, 
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { PredictionModelDiagnostics, PipelineStageInfo, HourlyForecastPoint, ActiveLocation } from '../types';
import { PredictionCard } from '../components/PredictionCard';
import { Pipeline } from '../components/Pipeline';
import { getAqiTheme, getAqiCategory } from '../utils/aqiUtils';

interface PredictionViewProps {
  diagnostics: PredictionModelDiagnostics;
  pipelineStages: PipelineStageInfo[];
  hourlyForecast?: HourlyForecastPoint[];
  currentLocation?: ActiveLocation;
  liveAqi?: number;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  diagnostics,
  pipelineStages,
  hourlyForecast = [],
  currentLocation = { name: 'Delhi', state: 'Delhi NCT', country: 'India', lat: 28.65, lng: 77.23 },
  liveAqi = 185
}) => {
  // Interactive What-If Scenario Simulation
  const [simFireReduction, setSimFireReduction] = useState<number>(30);
  const [simWindSpeed, setSimWindSpeed] = useState<number>(4.2);
  const [simBLH, setSimBLH] = useState<number>(850);

  // Dynamic baseline AQI from real-time active location
  const baselineAQI = liveAqi || diagnostics.currentPrediction || 185;
  const fireBonus = (simFireReduction / 100) * (baselineAQI * 0.2); // up to -20% pts
  const windBonus = ((simWindSpeed - 3.4) / 3.4) * 25; // positive if wind > 3.4
  const blhBonus = ((simBLH - 800) / 800) * 30; // positive if higher boundary layer
  const simulatedAQI = Math.max(30, Math.round(baselineAQI - fireBonus - windBonus - blhBonus));

  // Extract next 6 day daily predictions from hourly forecast if available
  const dailyPredictions = [];
  if (hourlyForecast.length > 0) {
    const step = 24;
    for (let i = 0; i < Math.min(6, Math.floor(hourlyForecast.length / step)); i++) {
      const point = hourlyForecast[i * step];
      const d = new Date(point.time);
      dailyPredictions.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        aqi: point.usAqi,
        pm25: point.pm25,
        no2: point.no2,
        temp: point.temperature,
        wind: point.windSpeed,
      });
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-graphite-950 font-sans">
              AI Prediction Studio & 7-Day Atmospheric Forecast ({currentLocation.name})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            Real-time physics-informed Random Forest Regressor coupling multi-satellite columns with ECMWF boundary layer thermodynamics for <strong className="text-graphite-900">{currentLocation.name}</strong>.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-graphite-500 bg-[#f4f7f2] p-2.5 rounded-lg border border-[#d4decb]">
          <span>R² = {diagnostics.r2}</span>
          <span className="text-graphite-300">|</span>
          <span className="text-emerald-700 font-semibold">Model Confidence {diagnostics.confidence}%</span>
        </div>
      </div>

      {/* Main Diagnostic Cards */}
      <PredictionCard diagnostics={diagnostics} />

      {/* 7-Day Future Predicted Forecast Breakdown */}
      {dailyPredictions.length > 0 && (
        <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-forest-800" />
              <h3 className="font-bold text-base text-graphite-900 font-sans">
                7-Day Real-Time Atmospheric Prediction Matrix ({currentLocation.name})
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Open-Meteo Ensemble
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            {dailyPredictions.map((pred, idx) => {
              const cat = getAqiCategory(pred.aqi);
              const theme = getAqiTheme(cat);
              return (
                <div key={idx} className="bg-[#f8faf7] p-3.5 rounded-xl border border-[#e2e8dc] flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-graphite-700 font-sans">{pred.day}</div>
                  <div className="my-2">
                    <span className="text-2xl font-black text-graphite-900 font-sans">{pred.aqi}</span>
                    <span className="text-[10px] block font-mono text-graphite-400">AQI Predicted</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-graphite-600 border-t border-[#e2e8dc] pt-2">
                    <div className="flex justify-between">
                      <span>PM2.5:</span>
                      <strong>{pred.pm25} µg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Temp / Wind:</span>
                      <strong>{pred.temp}°C, {pred.wind}m/s</strong>
                    </div>
                    <div className="mt-1">
                      <span className={`inline-block w-full text-center py-0.5 rounded text-[9px] font-bold border ${theme.badge}`}>
                        {cat}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Scenario Simulator ("What-If" Analysis) */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-forest-800" />
            <h3 className="font-bold text-base text-graphite-900 font-sans">
              Atmospheric & Source Intervention Simulator (What-If Analysis for {currentLocation.name})
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-[#edf4ee] text-forest-800 px-2 py-0.5 rounded border border-[#d0ddca]">
            Live Baseline: AQI {baselineAQI}
          </span>
        </div>

        <p className="text-xs text-graphite-600">
          Simulate environmental policy interventions (curtailment of stubble burning, increased convective mixing, wind speeds) for <strong className="text-graphite-900">{currentLocation.name}</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 bg-[#f8faf7] rounded-xl border border-[#dce4d6] font-mono text-xs">
          
          {/* Slider 1: Agricultural Fire Reduction */}
          <div>
            <div className="flex justify-between mb-1 text-graphite-800">
              <span>Biomass Fire Curtailment:</span>
              <strong className="text-rust-700">-{simFireReduction}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simFireReduction}
              onChange={(e) => setSimFireReduction(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#d4decb] rounded-lg appearance-none cursor-pointer accent-forest-700"
            />
            <span className="text-[10px] text-graphite-400 mt-1 block">Simulates stubble burning control policy</span>
          </div>

          {/* Slider 2: Wind Speed */}
          <div>
            <div className="flex justify-between mb-1 text-graphite-800">
              <span>10m Surface Wind Speed:</span>
              <strong className="text-teal-700">{simWindSpeed} m/s</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.2"
              value={simWindSpeed}
              onChange={(e) => setSimWindSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#d4decb] rounded-lg appearance-none cursor-pointer accent-forest-700"
            />
            <span className="text-[10px] text-graphite-400 mt-1 block">Higher ventilation clears stagnant air</span>
          </div>

          {/* Slider 3: Boundary Layer Height */}
          <div>
            <div className="flex justify-between mb-1 text-graphite-800">
              <span>Boundary Layer Height (BLH):</span>
              <strong className="text-amber-700">{simBLH} m</strong>
            </div>
            <input
              type="range"
              min="400"
              max="1800"
              step="25"
              value={simBLH}
              onChange={(e) => setSimBLH(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#d4decb] rounded-lg appearance-none cursor-pointer accent-forest-700"
            />
            <span className="text-[10px] text-graphite-400 mt-1 block">Daytime thermal convection elevation</span>
          </div>

        </div>

        {/* Simulator Output Box */}
        <div className="p-4 bg-[#141d18] text-ivory-100 rounded-xl border border-[#273a2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-[10px] text-graphite-400 uppercase tracking-wider block">
              Simulated Forecast Outcome ({currentLocation.name})
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-emerald-400 font-sans">{simulatedAQI}</span>
              <span className="text-xs text-graphite-300">
                (Baseline: <span className="line-through text-graphite-400">{baselineAQI}</span>, Net Δ: <strong className="text-emerald-400">-{baselineAQI - simulatedAQI} pts</strong>)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-graphite-400 block">Forecast Category</span>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${
              simulatedAQI <= 50 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : simulatedAQI <= 100 
                  ? 'bg-lime-950 text-lime-300 border border-lime-800' 
                  : simulatedAQI <= 200 
                    ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                    : 'bg-orange-950 text-orange-300 border border-orange-800'
            }`}>
              {getAqiCategory(simulatedAQI)}
            </span>
          </div>
        </div>
      </div>

      {/* Model Pipeline Flowchart */}
      <Pipeline stages={pipelineStages} />

    </div>
  );
};

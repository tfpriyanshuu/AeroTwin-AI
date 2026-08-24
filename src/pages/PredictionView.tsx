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
  CheckCircle2
} from 'lucide-react';
import { PredictionModelDiagnostics, PipelineStageInfo } from '../types';
import { PredictionCard } from '../components/PredictionCard';
import { Pipeline } from '../components/Pipeline';

interface PredictionViewProps {
  diagnostics: PredictionModelDiagnostics;
  pipelineStages: PipelineStageInfo[];
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  diagnostics,
  pipelineStages,
}) => {
  // Interactive What-If Scenario Simulation
  const [simFireReduction, setSimFireReduction] = useState<number>(30);
  const [simWindSpeed, setSimWindSpeed] = useState<number>(4.2);
  const [simBLH, setSimBLH] = useState<number>(850);

  // Compute simulated predicted AQI based on physics heuristics
  const baselineAQI = 287;
  const fireBonus = (simFireReduction / 100) * 45; // up to -45 pts
  const windBonus = ((simWindSpeed - 3.7) / 3.7) * 35; // positive if wind > 3.7
  const blhBonus = ((simBLH - 742) / 742) * 40; // positive if higher boundary layer
  const simulatedAQI = Math.max(50, Math.round(baselineAQI - fireBonus - windBonus - blhBonus));

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
              AI Prediction Studio & Model Diagnostics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            Physics-informed Random Forest regressor coupling multi-satellite columns with boundary layer thermodynamics.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-graphite-500 bg-[#f4f7f2] p-2.5 rounded-lg border border-[#d4decb]">
          <span>R² = 0.82</span>
          <span className="text-graphite-300">|</span>
          <span className="text-emerald-700 font-semibold">Validation Accuracy 91%</span>
        </div>
      </div>

      {/* Main Diagnostic Cards */}
      <PredictionCard diagnostics={diagnostics} />

      {/* Interactive Scenario Simulator ("What-If" Analysis) */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-forest-800" />
            <h3 className="font-bold text-base text-graphite-900 font-sans">
              Atmospheric & Source Intervention Simulator (What-If Analysis)
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-[#edf4ee] text-forest-800 px-2 py-0.5 rounded border border-[#d0ddca]">
            Interactive Policy Testbed
          </span>
        </div>

        <p className="text-xs text-graphite-600">
          Adjust environmental variables to simulate predicted surface AQI outcomes across the Delhi NCR / Indo-Gangetic airshed:
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
            <span className="text-[10px] text-graphite-400 mt-1 block">Baseline: 3.7 m/s (Calm winds trap smog)</span>
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
            <span className="text-[10px] text-graphite-400 mt-1 block">Baseline: 742 m (Inversion layer height)</span>
          </div>

        </div>

        {/* Simulator Output Box */}
        <div className="p-4 bg-[#141d18] text-ivory-100 rounded-xl border border-[#273a2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-[10px] text-graphite-400 uppercase tracking-wider block">
              Simulated Forecast Outcome (Delhi NCR)
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-emerald-400 font-sans">{simulatedAQI}</span>
              <span className="text-xs text-graphite-300">
                (Baseline: <span className="line-through text-graphite-400">287</span>, Net Δ: <strong className="text-emerald-400">-{287 - simulatedAQI} pts</strong>)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-graphite-400 block">Forecast Category</span>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${
              simulatedAQI <= 100 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : simulatedAQI <= 200 
                  ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                  : 'bg-orange-950 text-orange-300 border border-orange-800'
            }`}>
              {simulatedAQI <= 100 ? 'Satisfactory' : simulatedAQI <= 200 ? 'Moderate' : 'Poor'}
            </span>
          </div>
        </div>
      </div>

      {/* Model Pipeline Flowchart */}
      <Pipeline stages={pipelineStages} />

    </div>
  );
};

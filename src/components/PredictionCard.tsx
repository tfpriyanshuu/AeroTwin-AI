import React from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Activity, 
  BarChart2, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { PredictionModelDiagnostics } from '../types';

interface PredictionCardProps {
  diagnostics: PredictionModelDiagnostics;
}

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#141d18] border border-[#273a2e] p-2.5 rounded-lg text-xs font-mono text-ivory-100 shadow-elevation">
        <div className="font-bold text-emerald-400">{data.station}</div>
        <div className="text-graphite-300 mt-0.5">Actual CPCB AQI: <strong>{data.actual}</strong></div>
        <div className="text-graphite-300">Model Predicted: <strong>{data.predicted}</strong></div>
        <div className="text-[10px] text-teal-400 mt-1">Error: {Math.abs(data.actual - data.predicted)} AQI pts</div>
      </div>
    );
  }
  return null;
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ diagnostics }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edf1e8]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              AI Surface Pollution Prediction
            </h3>
            <p className="text-xs text-graphite-500">
              Satellite-to-Surface Regressor • Spatiotemporal Ensemble Model
            </p>
          </div>
        </div>

        {/* Prototype Label Badge */}
        <span className="self-start sm:self-auto text-[11px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
          <span>Prototype / Mock Model Output</span>
        </span>
      </div>

      {/* Model Overview & Evaluation Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 font-mono">
        
        {/* Active Prediction */}
        <div className="bg-[#f4f7f2] p-3 rounded-lg border border-[#d6e0d0] col-span-2 sm:col-span-1">
          <span className="text-[10px] text-graphite-500 uppercase block">Inferred Surface AQI</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-black text-orange-600 font-sans">{diagnostics.currentPrediction}</span>
            <span className="text-xs text-orange-700 font-bold">{diagnostics.predictedCategory}</span>
          </div>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confidence: {diagnostics.confidence}%</span>
          </div>
        </div>

        {/* R² Score */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc]">
          <span className="text-[10px] text-graphite-500 uppercase block">R² Coefficient</span>
          <div className="text-2xl font-bold text-graphite-900 font-sans mt-1">
            {diagnostics.r2}
          </div>
          <span className="text-[10px] text-forest-700 font-semibold block mt-1">High Correlation</span>
        </div>

        {/* RMSE */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc]">
          <span className="text-[10px] text-graphite-500 uppercase block">RMSE Error</span>
          <div className="text-2xl font-bold text-graphite-900 font-sans mt-1">
            {diagnostics.rmse}
          </div>
          <span className="text-[10px] text-graphite-400 block mt-1">AQI Points</span>
        </div>

        {/* MAE */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc]">
          <span className="text-[10px] text-graphite-500 uppercase block">MAE Error</span>
          <div className="text-2xl font-bold text-graphite-900 font-sans mt-1">
            {diagnostics.mae}
          </div>
          <span className="text-[10px] text-graphite-400 block mt-1">Mean Absolute</span>
        </div>

      </div>

      {/* Visual Diagnostic Split: Actual vs Predicted Scatter + Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-2">
        
        {/* Left: Actual vs Predicted Scatter Chart */}
        <div className="bg-[#fbfcfb] p-3.5 rounded-lg border border-[#e2e8dc]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-graphite-800 uppercase">
              Actual vs Predicted (CPCB Collocated)
            </span>
            <span className="text-[10px] font-mono text-graphite-400">1:1 Validation Line</span>
          </div>

          <div className="w-full h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ede3" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual AQI" 
                  domain={[50, 350]} 
                  unit=""
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted AQI" 
                  domain={[50, 350]} 
                  unit=""
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Stations" 
                  data={diagnostics.actualVsPredictedScatter} 
                  fill="#15803d" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Feature Importance Breakdown */}
        <div className="bg-[#fbfcfb] p-3.5 rounded-lg border border-[#e2e8dc]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-graphite-800 uppercase">
              Feature Importance Weights
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">Random Forest Splits</span>
          </div>

          <div className="space-y-2 mt-2 font-mono text-xs">
            {diagnostics.featureImportance.map((feat, idx) => (
              <div key={`feat-${idx}`}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-graphite-800 font-medium truncate max-w-[200px]">
                    {feat.feature}
                  </span>
                  <span className="text-graphite-500 font-semibold">
                    {feat.importance}% <span className="text-[9px] text-graphite-400">({feat.source})</span>
                  </span>
                </div>
                <div className="w-full bg-[#e8efe4] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-forest-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${feat.importance * 2.5}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Model Spec Context Tag */}
      <div className="mt-3 p-2.5 bg-[#f5f8f3] rounded-lg border border-[#d8e3d3] flex items-center justify-between text-xs text-graphite-600 font-mono">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-forest-700 shrink-0" />
          <span className="text-[11px]">
            Model: <strong>Random Forest Ensemble (300 Trees)</strong> trained on {diagnostics.trainingSamplesCount}
          </span>
        </div>
        <span className="text-[10px] text-graphite-400 hidden sm:inline">
          {diagnostics.lastTrainedDate}
        </span>
      </div>

    </div>
  );
};

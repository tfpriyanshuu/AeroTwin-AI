import React from 'react';
import { Layers, Flame, Wind, Eye, Sliders, MapPin, Orbit } from 'lucide-react';
import { ActiveMapLayers } from '../types';

interface LayerControlProps {
  layers: ActiveMapLayers;
  setLayers: React.Dispatch<React.SetStateAction<ActiveMapLayers>>;
  overlayOpacity: number;
  setOverlayOpacity: (val: number) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  setLayers,
  overlayOpacity,
  setOverlayOpacity,
}) => {
  const toggleLayer = (key: keyof ActiveMapLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#141e18]/95 backdrop-blur-md border border-[#273a2e] rounded-xl p-3.5 shadow-elevation text-ivory-100 w-64 text-xs font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#233229]">
        <div className="flex items-center space-x-2 text-ivory-50 font-semibold font-mono">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>MAP LAYERS</span>
        </div>
        <span className="text-[10px] font-mono bg-[#1d2c23] text-emerald-300 px-1.5 py-0.5 rounded border border-[#2e4537]">
          GIS Engine
        </span>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2">
        
        {/* Surface AQI Prediction */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded bg-gradient-to-r from-orange-500 to-rose-700 inline-block"></span>
            <span className="font-medium text-ivory-100">Predicted Surface AQI</span>
          </div>
          <input
            type="checkbox"
            checked={layers.predictedAqi}
            onChange={() => toggleLayer('predictedAqi')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>

        {/* TROPOMI NO2 */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-graphite-200">TROPOMI NO₂ Column</span>
          </div>
          <input
            type="checkbox"
            checked={layers.tropomiNo2}
            onChange={() => toggleLayer('tropomiNo2')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>

        {/* TROPOMI HCHO */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <Orbit className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-graphite-200">TROPOMI HCHO Column</span>
          </div>
          <input
            type="checkbox"
            checked={layers.tropomiHcho}
            onChange={() => toggleLayer('tropomiHcho')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>

        {/* MODIS Fire */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <Flame className="w-3.5 h-3.5 text-rust-500" />
            <span className="text-graphite-200">MODIS Fire Hotspots</span>
          </div>
          <input
            type="checkbox"
            checked={layers.modisFire}
            onChange={() => toggleLayer('modisFire')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>

        {/* Wind Vectors */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-graphite-200">ERA5 Wind Vectors</span>
          </div>
          <input
            type="checkbox"
            checked={layers.windVectors}
            onChange={() => toggleLayer('windVectors')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>

        {/* Ground Stations */}
        <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1a2920] cursor-pointer transition-colors">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-graphite-200">CAAQMS Ground Stations</span>
          </div>
          <input
            type="checkbox"
            checked={layers.groundStations}
            onChange={() => toggleLayer('groundStations')}
            className="w-4 h-4 accent-emerald-500 rounded bg-[#0e1712] border-[#293d31]"
          />
        </label>
      </div>

      {/* Layer Opacity Slider */}
      <div className="mt-3 pt-2.5 border-t border-[#233229]">
        <div className="flex items-center justify-between text-[11px] text-graphite-300 mb-1 font-mono">
          <span>Satellite Layer Opacity</span>
          <span className="text-emerald-400">{Math.round(overlayOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="1.0"
          step="0.05"
          value={overlayOpacity}
          onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#0e1712] rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Scientific Legend Bar */}
      <div className="mt-3 pt-2 border-t border-[#233229]">
        <div className="text-[10px] font-mono text-graphite-400 uppercase mb-1">
          AQI Scale Index
        </div>
        <div className="h-2 rounded w-full bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-600 via-red-600 to-rose-950"></div>
        <div className="flex justify-between text-[9px] font-mono text-graphite-400 mt-1">
          <span>0 (Good)</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>500+ (Severe)</span>
        </div>
      </div>

    </div>
  );
};

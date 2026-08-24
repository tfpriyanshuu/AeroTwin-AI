import React from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Layers, 
  Compass, 
  Thermometer, 
  Gauge, 
  AlertTriangle,
  ArrowUp,
  Activity
} from 'lucide-react';
import { WeatherTelemetry } from '../types';

interface WeatherPanelProps {
  weather: WeatherTelemetry;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather }) => {
  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              Atmospheric Conditions
            </h3>
            <p className="text-xs text-graphite-500">
              ECMWF ERA5 Reanalysis • Dispersion & Ventilation Drivers
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#edf4ee] text-forest-800 px-2 py-0.5 rounded border border-[#d0ddca]">
          0.25° Resolution
        </span>
      </div>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-4 font-mono">
        
        {/* Temperature */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc] flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-500 text-[11px]">
            <span>Temperature</span>
            <Thermometer className="w-3.5 h-3.5 text-rust-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-graphite-900 font-sans">{weather.temperature}</span>
            <span className="text-xs text-graphite-500 ml-1">°C</span>
          </div>
          <span className="text-[10px] text-graphite-400 mt-1">2m Surface Air</span>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc] flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-500 text-[11px]">
            <span>Wind Speed</span>
            <Wind className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-graphite-900 font-sans">{weather.windSpeed}</span>
            <span className="text-xs text-graphite-500 ml-1">m/s</span>
          </div>
          <span className="text-[10px] text-graphite-400 mt-1">10m Neutral Wind</span>
        </div>

        {/* Wind Direction with Compass */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc] flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-500 text-[11px]">
            <span>Wind Direction</span>
            <Compass className="w-3.5 h-3.5 text-teal-700" />
          </div>
          <div className="mt-1 flex items-center space-x-2">
            {/* Dynamic rotating SVG compass needle */}
            <div 
              className="w-7 h-7 rounded-full bg-[#e8efe4] border border-[#cbd8c6] flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${weather.windDegrees}deg)` }}
              title={`${weather.windDegrees}°`}
            >
              <ArrowUp className="w-4 h-4 text-teal-800" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-sm font-bold text-graphite-900">{weather.windDirection}</span>
              <span className="text-[10px] text-graphite-400 block">{weather.windDegrees}° (Southwest)</span>
            </div>
          </div>
          <span className="text-[10px] text-graphite-400 mt-1">Advection axis</span>
        </div>

        {/* Relative Humidity */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc] flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-500 text-[11px]">
            <span>Relative Humidity</span>
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-graphite-900 font-sans">{weather.relativeHumidity}</span>
            <span className="text-xs text-graphite-500 ml-1">%</span>
          </div>
          <span className="text-[10px] text-graphite-400 mt-1">Dew Point {weather.dewPoint}°C</span>
        </div>

        {/* Boundary Layer Height */}
        <div className="bg-[#f8faf7] p-3 rounded-lg border border-[#e2e8dc] flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-graphite-500 text-[11px]">
            <span>Boundary Layer</span>
            <Layers className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-graphite-900 font-sans">{weather.boundaryLayerHeight}</span>
            <span className="text-xs text-graphite-500 ml-1">m</span>
          </div>
          <span className="text-[10px] text-rust-700 font-semibold mt-1">Shallow Inversion</span>
        </div>

      </div>

      {/* Atmospheric Dispersion & Inversion Assessment Bar */}
      <div className="p-3 bg-[#fdfaf6] rounded-lg border border-[#eddcd0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rust-600 shrink-0" />
          <div>
            <span className="font-bold text-rust-900">Inversion Trapping Risk: {weather.inversionRisk}</span>
            <span className="text-graphite-600 block sm:inline sm:ml-2 text-[11px]">
              Ventilation Coefficient: <strong>{weather.ventilationCoefficient} m²/s</strong> (Threshold: &lt; 3,000 m²/s implies severe stagnation)
            </span>
          </div>
        </div>

        <div className="text-[10px] text-graphite-500 shrink-0">
          Source: ECMWF Integrated Forecasting System
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { 
  Flame, 
  Orbit, 
  Wind, 
  MapPin, 
  Activity, 
  Layers, 
  AlertTriangle,
  Info,
  Calendar
} from 'lucide-react';
import { FireHotspot, FireBiomassInfluencePoint } from '../types';
import { FireAnalysis } from '../components/FireAnalysis';

interface SourcesViewProps {
  fireHotspots: FireHotspot[];
  biomassData: FireBiomassInfluencePoint[];
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  fireHotspots,
  biomassData,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rust-100 border border-rust-300 flex items-center justify-center text-rust-800">
              <Flame className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-graphite-950 font-sans">
              Fire Sources & Biomass Combustion Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            NASA MODIS (Terra/Aqua) and VIIRS (Suomi-NPP) active fire detection tracking agricultural residue combustion and downwind advection.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-graphite-500 bg-[#f4f7f2] p-2.5 rounded-lg border border-[#d4decb]">
          <span>1,284 Active Detections</span>
          <span className="text-graphite-300">|</span>
          <span className="text-rust-700 font-semibold">Punjab / Haryana Corridor</span>
        </div>
      </div>

      {/* Biomass Burning Analysis Chart Component */}
      <FireAnalysis biomassData={biomassData} />

      {/* Active Thermal Anomalies Table */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-graphite-900 font-sans">
              Recent MODIS & VIIRS Thermal Anomaly Clusters
            </h3>
            <span className="text-[10px] font-mono bg-rust-100 text-rust-900 px-2 py-0.5 rounded border border-rust-300">
              FRP Radiance &gt; 35 MW
            </span>
          </div>
          <span className="text-xs font-mono text-graphite-400">
            NASA LANCE FIRMS Feed
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8dc] text-graphite-500 text-[11px] bg-[#fafbf9]">
                <th className="py-2.5 px-3 font-semibold">DISTRICT / CLUSTER</th>
                <th className="py-2.5 px-3 font-semibold">STATE</th>
                <th className="py-2.5 px-3 font-semibold">COORDINATES</th>
                <th className="py-2.5 px-3 font-semibold">FRP (RADIATIVE POWER)</th>
                <th className="py-2.5 px-3 font-semibold">BRIGHTNESS TEMP</th>
                <th className="py-2.5 px-3 font-semibold">CONFIDENCE</th>
                <th className="py-2.5 px-3 font-semibold">SATELLITE SENSOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1e8]">
              {fireHotspots.map((hotspot) => (
                <tr key={hotspot.id} className="hover:bg-[#f8faf7] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-graphite-900 flex items-center space-x-1.5">
                      <span>🔥</span>
                      <span>{hotspot.district}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-graphite-700">{hotspot.state}</td>
                  <td className="py-3 px-3 text-graphite-500">{hotspot.lat.toFixed(2)}°N, {hotspot.lng.toFixed(2)}°E</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-rust-700">{hotspot.frp} MW</span>
                  </td>
                  <td className="py-3 px-3 text-graphite-700">{hotspot.brightness} K</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-300">
                      {hotspot.confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-graphite-500">{hotspot.satellite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

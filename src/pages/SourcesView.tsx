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
  Calendar,
  Factory,
  Car,
  Trees,
  CloudFog,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { FireHotspot, FireBiomassInfluencePoint, PollutantBreakdown, ActiveLocation } from '../types';
import { FireAnalysis } from '../components/FireAnalysis';

interface SourcesViewProps {
  fireHotspots: FireHotspot[];
  biomassData: FireBiomassInfluencePoint[];
  pollutantBreakdown?: PollutantBreakdown;
  currentLocation?: ActiveLocation;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  fireHotspots,
  biomassData,
  pollutantBreakdown,
  currentLocation = { name: 'Delhi', state: 'Delhi NCT', country: 'India', lat: 28.65, lng: 77.23 }
}) => {
  const defaultPollutants: PollutantBreakdown = {
    pm25: { value: 45.2, unit: 'µg/m³', safeLimit: 30, sharePercent: 32 },
    pm10: { value: 88.4, unit: 'µg/m³', safeLimit: 60, sharePercent: 24 },
    no2: { value: 34.8, unit: 'µg/m³', safeLimit: 40, sharePercent: 18 },
    so2: { value: 12.5, unit: 'µg/m³', safeLimit: 50, sharePercent: 10 },
    co: { value: 480, unit: 'µg/m³', safeLimit: 2000, sharePercent: 6 },
    o3: { value: 38.0, unit: 'µg/m³', safeLimit: 100, sharePercent: 10 },
    dust: { value: 52.0, unit: 'µg/m³', safeLimit: 50, sharePercent: 15 },
    aod: { value: 0.65, unit: 'optical depth', safeLimit: 0.3, sharePercent: 20 },
    uvIndex: { value: 2.5, unit: 'UV Index' },
    dominantPollutant: 'PM2.5',
    sourceAttribution: [
      { source: 'Vehicular Emissions', percentage: 38, description: 'Traffic NOx, CO, and ultra-fine carbon exhaust', color: '#16a34a' },
      { source: 'Industrial & Thermal Power', percentage: 26, description: 'Point-source SO₂, NO2 and industrial combustion', color: '#0284c7' },
      { source: 'Biomass & Agri Residue', percentage: 22, description: 'Stubble burn plumes, pyrogenic smoke, organic carbon', color: '#ea580c' },
      { source: 'Road & Construction Dust', percentage: 14, description: 'Resuspended particulate crustal matter (PM10/PM2.5)', color: '#d97706' },
    ],
  };

  const pData = pollutantBreakdown || defaultPollutants;

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
              Pollutant Sources & Emission Apportionment ({currentLocation.name})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            Real-time trace gas retrievals, particulate spectroscopy, and NASA MODIS/VIIRS thermal anomaly tracking for <strong className="text-graphite-900">{currentLocation.name}</strong>.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-graphite-500 bg-[#f4f7f2] p-2.5 rounded-lg border border-[#d4decb]">
          <span className="text-emerald-700 font-semibold">● Live Sensor Feed</span>
          <span className="text-graphite-300">|</span>
          <span>Dominant: <strong className="text-graphite-900">{pData.dominantPollutant}</strong></span>
        </div>
      </div>

      {/* 1. Real-Time Pollutant Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* PM2.5 */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">PM2.5 (Fine Particles)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              pData.pm25.value > 60 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pData.pm25.value > pData.pm25.safeLimit ? 'Exceeding Limit' : 'Acceptable'}
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.pm25.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>WHO 24h Guideline:</span>
            <strong className="text-graphite-800">{pData.pm25.safeLimit} µg/m³</strong>
          </div>
        </div>

        {/* PM10 */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">PM10 (Coarse Dust)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              pData.pm10.value > 100 ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pData.pm10.value > pData.pm10.safeLimit ? 'Exceeding Limit' : 'Acceptable'}
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.pm10.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>NAAQS 24h Standard:</span>
            <strong className="text-graphite-800">{pData.pm10.safeLimit} µg/m³</strong>
          </div>
        </div>

        {/* NO2 */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">NO₂ (Nitrogen Dioxide)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              pData.no2.value > 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pData.no2.value > pData.no2.safeLimit ? 'Elevated' : 'Safe'}
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.no2.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>Vehicular Tracer • Limit:</span>
            <strong className="text-graphite-800">{pData.no2.safeLimit} µg/m³</strong>
          </div>
        </div>

        {/* SO2 */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">SO₂ (Sulphur Dioxide)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Industrial Trace
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.so2.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>Thermal Plant Standard:</span>
            <strong className="text-graphite-800">{pData.so2.safeLimit} µg/m³</strong>
          </div>
        </div>

        {/* Carbon Monoxide */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">CO (Carbon Monoxide)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Nominal
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.co.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>Combustion Incomplete:</span>
            <strong className="text-graphite-800">&lt; 2000 µg/m³</strong>
          </div>
        </div>

        {/* Ozone */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">O₃ (Ground Ozone)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Photochemical
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.o3.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>8h Exposure Limit:</span>
            <strong className="text-graphite-800">{pData.o3.safeLimit} µg/m³</strong>
          </div>
        </div>

        {/* Dust */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">Dust Concentration</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              Mineral / Soil
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-graphite-900 font-sans">{pData.dust.value}</span>
            <span className="text-xs text-graphite-500 ml-1">µg/m³</span>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>Suspended Crustal:</span>
            <strong className="text-graphite-800">Aerosol Model</strong>
          </div>
        </div>

        {/* Aerosol Optical Depth & UV */}
        <div className="bg-white p-4.5 rounded-xl border border-[#dce3d8] shadow-subtle flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-graphite-900 font-sans">AOD & UV Index</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
              Satellite DOAS
            </span>
          </div>
          <div className="my-2 flex items-baseline space-x-3">
            <div>
              <span className="text-2xl font-black text-graphite-900 font-sans">{pData.aod.value}</span>
              <span className="text-[10px] text-graphite-500 block">AOD (550nm)</span>
            </div>
            <div>
              <span className="text-xl font-bold text-purple-800 font-sans">{pData.uvIndex.value}</span>
              <span className="text-[10px] text-graphite-500 block">UV Index</span>
            </div>
          </div>
          <div className="text-[10px] text-graphite-500 border-t border-[#edf1e8] pt-1.5 flex justify-between">
            <span>Atmospheric Haziness:</span>
            <strong className="text-graphite-800">{pData.aod.value > 0.6 ? 'High Haze' : 'Clear'}</strong>
          </div>
        </div>

      </div>

      {/* 2. Source Apportionment Breakdown Card */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-forest-800" />
            <h3 className="font-bold text-base text-graphite-900 font-sans">
              Estimated Emission Source Apportionment ({currentLocation.name})
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-[#edf4ee] text-forest-800 px-2 py-0.5 rounded border border-[#d0ddca]">
            ML Chemical Mass Balance
          </span>
        </div>

        <p className="text-xs text-graphite-600">
          Source contributions calculated dynamically by combining near-surface gas ratios (NO₂/CO, SO₂/NO₂), satellite aerosol optical depth, and MODIS fire thermal anomalies:
        </p>

        {/* Stacked Progress Bar */}
        <div className="h-4 rounded-full overflow-hidden flex shadow-inner bg-gray-100">
          {pData.sourceAttribution.map((src, idx) => (
            <div 
              key={idx}
              style={{ width: `${src.percentage}%`, backgroundColor: src.color }}
              title={`${src.source}: ${src.percentage}%`}
              className="transition-all duration-500 hover:opacity-90"
            />
          ))}
        </div>

        {/* Source Legend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {pData.sourceAttribution.map((src, idx) => (
            <div key={idx} className="p-3 bg-[#f8faf7] rounded-lg border border-[#e2e8dc] font-mono text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: src.color }}></span>
                  <strong className="text-graphite-900 text-xs font-sans">{src.source}</strong>
                </div>
                <span className="text-base font-black text-graphite-900 font-sans">{src.percentage}%</span>
              </div>
              <p className="text-[10px] text-graphite-500 leading-tight mt-1">
                {src.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Biomass Burning Analysis Chart Component */}
      <FireAnalysis biomassData={biomassData} />

      {/* Active Thermal Anomalies Table */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-graphite-900 font-sans">
              MODIS & VIIRS Thermal Anomaly Clusters Near {currentLocation.name}
            </h3>
            <span className="text-[10px] font-mono bg-rust-100 text-rust-900 px-2 py-0.5 rounded border border-rust-300">
              Active FRP Detections
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
                <th className="py-2.5 px-3 font-semibold">STATE / REGION</th>
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

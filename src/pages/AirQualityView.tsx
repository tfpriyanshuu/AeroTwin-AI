import React from 'react';
import { 
  Wind, 
  Orbit, 
  Layers, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Sliders, 
  Info,
  Building2
} from 'lucide-react';
import { RegionTelemetry, StationData, MetricSummary } from '../types';
import { getAqiTheme } from '../utils/aqiUtils';

interface AirQualityViewProps {
  metrics: MetricSummary;
  regions: RegionTelemetry[];
  stations: StationData[];
  onSelectRegion: (r: RegionTelemetry) => void;
}

export const AirQualityView: React.FC<AirQualityViewProps> = ({
  metrics,
  regions,
  stations,
  onSelectRegion,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <Wind className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-graphite-950 font-sans">
              Air Quality & Trace Gas Chemistry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            Detailed tropospheric column versus ground-level concentration modeling across Indian airsheds.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-graphite-500 bg-[#f4f7f2] p-2.5 rounded-lg border border-[#d4decb]">
          <span>Sentinel-5P L2 DOAS</span>
          <span className="text-graphite-300">|</span>
          <span className="text-emerald-700 font-semibold">Calibrated</span>
        </div>
      </div>

      {/* Regional Air Quality Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((reg) => {
          const theme = getAqiTheme(reg.aqiCategory);
          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(reg)}
              className="bg-white border border-[#dce3d8] rounded-xl p-4.5 shadow-subtle hover:shadow-panel hover:border-forest-600 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-graphite-500">{reg.state}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    {reg.aqiCategory}
                  </span>
                </div>
                
                <h3 className="font-bold text-base text-graphite-950 mt-1">{reg.name}</h3>

                <div className="my-3 p-2.5 bg-[#f7f9f6] rounded-lg border border-[#e2e8dc] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-graphite-500 uppercase block">Surface AQI</span>
                    <span className="text-2xl font-extrabold text-graphite-900">{reg.aqi}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-graphite-500 uppercase block">Surface NO₂</span>
                    <span className="text-sm font-bold text-emerald-800">{reg.no2} µg/m³</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono text-graphite-600">
                  <div className="flex justify-between">
                    <span>HCHO Column:</span>
                    <span className="font-semibold text-purple-800">{reg.hcho}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fire Influence:</span>
                    <span className="font-semibold text-rust-700">{reg.fireInfluence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dominant Pollutant:</span>
                    <span className="font-semibold text-graphite-900">{reg.dominantPollutant}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#edf1e8] flex items-center justify-between text-[11px] text-forest-800 font-semibold">
                <span>Inspect Airshed Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Physics Deep Dive: Column-to-Surface Regressor */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle space-y-4">
        <h3 className="font-bold text-base text-graphite-900">
          Column-to-Surface Vertical Profile Estimation
        </h3>
        <p className="text-xs text-graphite-600 leading-relaxed">
          Spaceborne spectrometers measure vertical column densities (mol/m²) representing the total molecules in a column of air from surface to space. To estimate the breathable ground-level concentration (µg/m³), AeroTwin couples Sentinel-5P DOAS retrievals with planetary boundary layer height (PBLH), 10m wind speed, and relative humidity via non-linear machine learning:
        </p>

        <div className="bg-[#141d18] text-ivory-100 p-4 rounded-lg font-mono text-xs space-y-2 border border-[#273a2e]">
          <div className="text-emerald-400 font-bold text-sm tracking-wide">
            {"Surface_NO2 ≈ f(VCD_TROPOMI, BLH_ERA5, Wind_10m, Temp_2m, FRP_MODIS)"}
          </div>
          <div className="text-graphite-400 text-[11px]">
            Where f(·) is the physics-regularized Random Forest ensemble trained over collocated CPCB CAAQMS reference stations.
          </div>
        </div>
      </div>

    </div>
  );
};

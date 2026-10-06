import React, { useState } from 'react';
import { 
  Satellite, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Wind, 
  Activity, 
  Sparkles, 
  CloudFog,
  Cpu,
  ChevronDown,
  RefreshCw,
  Navigation,
  Globe2
} from 'lucide-react';
import { 
  MetricSummary, 
  RegionTelemetry, 
  StationData, 
  FireHotspot, 
  WeatherTelemetry, 
  PollutionTimeSeriesPoint, 
  FireBiomassInfluencePoint, 
  PredictionModelDiagnostics, 
  PipelineStageInfo, 
  AtmosphericAlert, 
  DataSourceItem, 
  TimeWindow,
  ActiveLocation,
  LocationSearchResult
} from '../types';
import { MetricCard } from '../components/MetricCard';
import { PollutionMap } from '../components/PollutionMap';
import { RegionDetailDrawer } from '../components/RegionDetailDrawer';
import { PollutionChart } from '../components/PollutionChart';
import { FireAnalysis } from '../components/FireAnalysis';
import { WeatherPanel } from '../components/WeatherPanel';
import { PredictionCard } from '../components/PredictionCard';
import { Pipeline } from '../components/Pipeline';
import { StationTable } from '../components/StationTable';
import { AlertPanel } from '../components/AlertPanel';
import { DataSources } from '../components/DataSources';
import { POPULAR_LOCATIONS } from '../services/realtimeAqiService';

interface DashboardViewProps {
  metrics: MetricSummary;
  regions: RegionTelemetry[];
  stations: StationData[];
  fireHotspots: FireHotspot[];
  weather: WeatherTelemetry;
  trend7D: PollutionTimeSeriesPoint[];
  trend30D: PollutionTimeSeriesPoint[];
  trendMonthly: PollutionTimeSeriesPoint[];
  biomassData: FireBiomassInfluencePoint[];
  predictionDiagnostics: PredictionModelDiagnostics;
  pipelineStages: PipelineStageInfo[];
  alerts: AtmosphericAlert[];
  dataSources: DataSourceItem[];
  timeWindow: TimeWindow;
  setTimeWindow: (w: TimeWindow) => void;
  selectedRegion: RegionTelemetry | null;
  setSelectedRegion: (reg: RegionTelemetry | null) => void;
  currentLocation: ActiveLocation;
  onSelectLocation: (loc: LocationSearchResult) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  lastUpdatedTime?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  regions,
  stations,
  fireHotspots,
  weather,
  trend7D,
  trend30D,
  trendMonthly,
  biomassData,
  predictionDiagnostics,
  pipelineStages,
  alerts,
  dataSources,
  timeWindow,
  setTimeWindow,
  selectedRegion,
  setSelectedRegion,
  currentLocation,
  onSelectLocation,
  onMapClickCoordinates,
  lastUpdatedTime,
  onNavigateToTab,
}) => {
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  const handleStationClick = (st: StationData) => {
    setSelectedStation(st);
    const matchedRegion = regions.find(r => r.state === st.state || r.name.includes(st.city));
    if (matchedRegion) {
      setSelectedRegion({
        ...matchedRegion,
        name: st.name,
        aqi: st.aqi,
        aqiCategory: st.aqiCategory,
        no2: st.no2,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 2. HERO / ACTIVE LOCATION INTELLIGENCE BAR */}
      <section className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Title & Context */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                <MapPin className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-graphite-950 tracking-tight font-sans">
                {currentLocation.name} Atmospheric Intelligence
              </h1>
            </div>
            
            <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>REAL-TIME LIVE</span>
            </span>

            {currentLocation.state && (
              <span className="text-[11px] font-mono bg-[#f4f7f2] text-graphite-700 border border-[#d4decb] px-2 py-0.5 rounded-full">
                {currentLocation.state}, {currentLocation.country}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-graphite-600 max-w-2xl leading-relaxed">
            Real-time multi-spectral satellite retrievals (Sentinel-5P DOAS) coupled with ERA5 boundary layer physics and CPCB ground stations for <strong className="text-graphite-900">{currentLocation.name}</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-graphite-500">
            <div className="flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-forest-700" />
              <span>Coordinates: <strong className="text-graphite-900">{currentLocation.lat.toFixed(3)}°N, {currentLocation.lng.toFixed(3)}°E</strong></span>
            </div>
            <span className="text-graphite-300">|</span>
            <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <span>● Last Synchronized: <strong>{lastUpdatedTime || 'Just now'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Location Selector & Quick Chips */}
        <div className="flex flex-col items-start md:items-end space-y-2 shrink-0">
          <div className="text-[10px] font-mono text-graphite-500 uppercase tracking-wider">
            Quick Airshed Switcher:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_LOCATIONS.slice(0, 5).map((city) => {
              const isSelected = 
                Math.abs(city.latitude - currentLocation.lat) < 0.05 && 
                Math.abs(city.longitude - currentLocation.lng) < 0.05;

              return (
                <button
                  key={city.id}
                  onClick={() => onSelectLocation(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'bg-forest-900 text-emerald-300 border border-forest-700 font-bold shadow-sm'
                      : 'bg-[#f4f7f2] hover:bg-[#e9efe6] text-graphite-700 border border-[#d4decb]'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. KEY METRIC CARDS (5 Dynamic Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Surface AQI */}
        <MetricCard
          title="Surface AQI"
          value={metrics.surfaceAqi.value}
          statusBadge={{
            text: metrics.surfaceAqi.status,
            variant: metrics.surfaceAqi.value <= 100 ? 'good' : metrics.surfaceAqi.value <= 200 ? 'moderate' : metrics.surfaceAqi.value <= 300 ? 'poor' : 'severe',
          }}
          changePercent={metrics.surfaceAqi.change24h}
          sparklineData={metrics.surfaceAqi.sparkline}
          sparklineColor="#ea580c"
          icon={Activity}
          tooltipText={`Real-time Air Quality Index in ${currentLocation.name} estimated by combining satellite tropospheric columns with ground calibrations.`}
          scientificContext="Live Open-Meteo & CPCB Collocated Scale • 24h Weighted"
        />

        {/* 2. Surface NO₂ */}
        <MetricCard
          title="Surface NO₂"
          value={metrics.surfaceNo2.value}
          unit={metrics.surfaceNo2.unit}
          statusBadge={{
            text: metrics.surfaceNo2.value > 40 ? 'Elevated NO₂' : 'Acceptable Level',
            variant: metrics.surfaceNo2.value > 40 ? 'poor' : 'good',
          }}
          changePercent={metrics.surfaceNo2.change24h}
          sparklineData={metrics.surfaceNo2.sparkline}
          sparklineColor="#15803d"
          icon={Wind}
          tooltipText="Near-surface nitrogen dioxide concentration derived from Sentinel-5P DOAS tropospheric column and boundary layer height."
          scientificContext="Calibrated against 400+ CAAQMS chemiluminescence analyzers"
        />

        {/* 3. HCHO Column */}
        <MetricCard
          title="HCHO Column"
          value={metrics.hchoColumn.value}
          unit={metrics.hchoColumn.unit}
          statusBadge={{
            text: 'Biomass VOC Tracer',
            variant: 'moderate',
          }}
          changePercent={metrics.hchoColumn.change24h}
          sparklineData={metrics.hchoColumn.sparkline}
          sparklineColor="#9333ea"
          icon={Satellite}
          tooltipText="Total tropospheric formaldehyde vertical column density from TROPOMI UV spectrometer serving as pyrogenic VOC tracer."
          scientificContext="Resolution: 5.5 × 3.5 km • DOAS Spectral Fit"
        />

        {/* 4. Fire Activity */}
        <MetricCard
          title="Fire & Particulate"
          value={`${metrics.fireActivity.count.toLocaleString('en-IN')}`}
          unit="anomalies"
          statusBadge={{
            text: metrics.fireActivity.count > 300 ? 'Severe Biomass Burn' : 'Moderate Activity',
            variant: metrics.fireActivity.count > 300 ? 'severe' : 'moderate',
          }}
          changePercent={metrics.fireActivity.change24h}
          sparklineData={metrics.fireActivity.sparkline}
          sparklineColor="#dc2626"
          icon={Flame}
          tooltipText="Active thermal anomaly detections and Fire Radiative Power (FRP) across surrounding regional corridors."
          scientificContext="NASA FIRMS NRT • 1km Thermal Band Anomaly"
        />

        {/* 5. Boundary Layer Height */}
        <MetricCard
          title="Boundary Layer"
          value={metrics.boundaryLayerHeight.value}
          unit={metrics.boundaryLayerHeight.unit}
          statusBadge={{
            text: metrics.boundaryLayerHeight.status,
            variant: metrics.boundaryLayerHeight.value < 800 ? 'inversion' : 'good',
          }}
          changePercent={metrics.boundaryLayerHeight.change24h}
          sparklineData={metrics.boundaryLayerHeight.sparkline}
          sparklineColor="#b45309"
          icon={CloudFog}
          tooltipText="Planetary Boundary Layer Height from ECMWF ERA5 reanalysis. Low values severely restrict vertical pollutant dispersion."
          scientificContext="ERA5 0.25° Assimilation • Inversion Threshold < 800m"
        />

      </section>

      {/* 4. MAIN INTERACTIVE MAP & 5. MAP DETAIL DRAWER */}
      <section className="relative">
        <PollutionMap
          regions={regions}
          stations={stations}
          fireHotspots={fireHotspots}
          selectedRegion={selectedRegion}
          currentLocation={currentLocation}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
          onSelectStation={handleStationClick}
          onMapClickCoordinates={onMapClickCoordinates}
        />

        {/* Region / Hotspot Detail Slideout */}
        <RegionDetailDrawer
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          onViewDetailedAnalysis={(reg) => {
            if (onNavigateToTab) onNavigateToTab('air-quality');
          }}
        />
      </section>

      {/* 6. POLLUTION TREND & 7. BIOMASS BURNING INFLUENCE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Atmospheric Pollution Trend Chart */}
        <PollutionChart
          data7D={trend7D}
          data30D={trend30D}
          dataMonthly={trendMonthly}
          selectedWindow={timeWindow}
          onWindowChange={setTimeWindow}
        />

        {/* Fire -> HCHO -> NO2 Biomass Burning Influence */}
        <FireAnalysis biomassData={biomassData} />

      </section>

      {/* 8. METEOROLOGICAL CONDITIONS (ERA5) */}
      <section>
        <WeatherPanel weather={weather} />
      </section>

      {/* 9. AI PREDICTION & 10. MODEL PIPELINE */}
      <section className="space-y-5">
        <PredictionCard diagnostics={predictionDiagnostics} />
        <Pipeline stages={pipelineStages} />
      </section>

      {/* 11. GROUND STATION NETWORK */}
      <section>
        <StationTable
          stations={stations}
          onSelectStation={handleStationClick}
          selectedStationId={selectedStation?.id}
        />
      </section>

      {/* 12. ALERTS PANEL & 13. DATA SOURCES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertPanel alerts={alerts} />
        <DataSources sources={dataSources} />
      </section>

    </div>
  );
};

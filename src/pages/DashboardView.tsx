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
  RefreshCw
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
  TimeWindow 
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
  onNavigateToTab,
}) => {
  const [locationFocus, setLocationFocus] = useState<string>('India');
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  const handleLocationSelect = (loc: string) => {
    setLocationFocus(loc);
    if (loc === 'Delhi NCR') {
      const match = regions.find(r => r.id === 'delhi-ncr');
      if (match) setSelectedRegion(match);
    } else if (loc === 'Punjab & Haryana') {
      const match = regions.find(r => r.id === 'punjab-agri');
      if (match) setSelectedRegion(match);
    } else if (loc === 'Mumbai MMR') {
      const match = regions.find(r => r.id === 'mumbai-mmr');
      if (match) setSelectedRegion(match);
    } else {
      setSelectedRegion(null);
    }
  };

  const handleStationClick = (st: StationData) => {
    setSelectedStation(st);
    // Find matching region or synthesise region telemetry
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
      
      {/* 2. HERO / OVERVIEW SECTION */}
      <section className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Title & Context */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-graphite-950 tracking-tight font-sans">
              India Atmospheric Intelligence
            </h1>
            <span className="text-[11px] font-mono bg-forest-100 text-forest-900 border border-forest-300 px-2 py-0.5 rounded-full font-bold">
              ISRO / SIH 2024
            </span>
          </div>

          <p className="text-xs sm:text-sm text-graphite-600 max-w-2xl leading-relaxed">
            Satellite-driven monitoring and AI-assisted prediction of surface-level air pollution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-graphite-500">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-forest-700" />
              <span>Data period: <strong className="text-graphite-900">October 2024</strong></span>
            </div>
            <span className="text-graphite-300">|</span>
            <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>● Data Pipeline Operational</span>
            </div>
          </div>
        </div>

        {/* Right Location Selector & Quick Stats */}
        <div className="flex items-center space-x-3 shrink-0 self-start md:self-auto">
          <div className="flex items-center space-x-2 bg-[#f4f7f2] px-3 py-2 rounded-lg border border-[#d4decb]">
            <MapPin className="w-4 h-4 text-forest-800 shrink-0" />
            <select
              value={locationFocus}
              onChange={(e) => handleLocationSelect(e.target.value)}
              aria-label="Filter Airshed Location"
              className="bg-transparent text-xs font-mono font-bold text-graphite-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="India">All India Airshed</option>
              <option value="Delhi NCR">Delhi NCR Corridor</option>
              <option value="Punjab & Haryana">Punjab & Haryana Agri-Zone</option>
              <option value="Indo-Gangetic Plain">Indo-Gangetic Basin</option>
              <option value="Mumbai MMR">Mumbai MMR Coastal</option>
            </select>
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
            variant: 'poor',
          }}
          changePercent={metrics.surfaceAqi.change24h}
          sparklineData={metrics.surfaceAqi.sparkline}
          sparklineColor="#ea580c"
          icon={Activity}
          tooltipText="Composite surface Air Quality Index estimated by combining satellite tropospheric columns with ground calibrations."
          scientificContext="CPCB Standard Calculation • 24h Weighted Sub-index"
        />

        {/* 2. Surface NO₂ */}
        <MetricCard
          title="Surface NO₂"
          value={metrics.surfaceNo2.value}
          unit={metrics.surfaceNo2.unit}
          statusBadge={{
            text: 'Elevated Level',
            variant: 'poor',
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
          title="Fire Activity"
          value={`${metrics.fireActivity.count.toLocaleString('en-IN')}`}
          unit="detections"
          statusBadge={{
            text: 'Severe Agri Burn',
            variant: 'severe',
          }}
          changePercent={metrics.fireActivity.change24h}
          sparklineData={metrics.fireActivity.sparkline}
          sparklineColor="#dc2626"
          icon={Flame}
          tooltipText="Active thermal anomaly detections and Fire Radiative Power (FRP) across Punjab, Haryana, and Western UP from MODIS & VIIRS."
          scientificContext="NASA FIRMS NRT • 1km Thermal Band Anomaly"
        />

        {/* 5. Boundary Layer Height */}
        <MetricCard
          title="Boundary Layer"
          value={metrics.boundaryLayerHeight.value}
          unit={metrics.boundaryLayerHeight.unit}
          statusBadge={{
            text: metrics.boundaryLayerHeight.status,
            variant: 'inversion',
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
          onSelectRegion={(reg) => setSelectedRegion(reg)}
          onSelectStation={handleStationClick}
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

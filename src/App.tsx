import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { AirQualityView } from './pages/AirQualityView';
import { SourcesView } from './pages/SourcesView';
import { PredictionView } from './pages/PredictionView';
import { AnalyticsView } from './pages/AnalyticsView';
import { WeatherPanel } from './components/WeatherPanel';
import { Pipeline } from './components/Pipeline';
import { PredictionCard } from './components/PredictionCard';
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
} from './types';
import { pollutionService } from './services/pollutionService';
import { weatherService } from './services/weatherService';
import { fireService } from './services/fireService';
import { predictionService } from './services/predictionService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('7D');
  const [selectedRegion, setSelectedRegion] = useState<RegionTelemetry | null>(null);

  // Application Data States (Loaded from Service Layer)
  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [regions, setRegions] = useState<RegionTelemetry[]>([]);
  const [stations, setStations] = useState<StationData[]>([]);
  const [fireHotspots, setFireHotspots] = useState<FireHotspot[]>([]);
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);
  const [trend7D, setTrend7D] = useState<PollutionTimeSeriesPoint[]>([]);
  const [trend30D, setTrend30D] = useState<PollutionTimeSeriesPoint[]>([]);
  const [trendMonthly, setTrendMonthly] = useState<PollutionTimeSeriesPoint[]>([]);
  const [biomassData, setBiomassData] = useState<FireBiomassInfluencePoint[]>([]);
  const [predictionDiagnostics, setPredictionDiagnostics] = useState<PredictionModelDiagnostics | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageInfo[]>([]);
  const [alerts, setAlerts] = useState<AtmosphericAlert[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial Data Ingestion
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [
          metricRes,
          regionRes,
          stationRes,
          fireRes,
          weatherRes,
          t7Res,
          t30Res,
          tMonthRes,
          bioRes,
          diagRes,
          pipeRes,
          alertRes,
          srcRes,
        ] = await Promise.all([
          pollutionService.getMetricSummary(),
          pollutionService.getRegions(),
          pollutionService.getStations(),
          fireService.getActiveFireHotspots(),
          weatherService.getCurrentWeather(),
          pollutionService.getPollutionTrend('7D'),
          pollutionService.getPollutionTrend('30D'),
          pollutionService.getPollutionTrend('Monthly'),
          fireService.getBiomassInfluenceSeries(),
          predictionService.getModelDiagnostics(),
          predictionService.getPipelineStages(),
          pollutionService.getAlerts(),
          pollutionService.getDataSources(),
        ]);

        setMetrics(metricRes);
        setRegions(regionRes);
        setStations(stationRes);
        setFireHotspots(fireRes);
        setWeather(weatherRes);
        setTrend7D(t7Res);
        setTrend30D(t30Res);
        setTrendMonthly(tMonthRes);
        setBiomassData(bioRes);
        setPredictionDiagnostics(diagRes);
        setPipelineStages(pipeRes);
        setAlerts(alertRes);
        setDataSources(srcRes);
      } catch (err) {
        console.error('Error loading AeroTwin telemetry:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Trigger Satellite Telemetry Refresh Simulation
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      const [metricRes, fireRes, weatherRes] = await Promise.all([
        pollutionService.getMetricSummary(),
        fireService.getActiveFireHotspots(),
        weatherService.getCurrentWeather(),
      ]);
      setMetrics(metricRes);
      setFireHotspots(fireRes);
      setWeather(weatherRes);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  if (isLoading || !metrics || !weather || !predictionDiagnostics) {
    return (
      <div className="min-h-screen bg-[#121a15] flex flex-col items-center justify-center text-ivory-50 p-4 font-mono">
        <div className="w-12 h-12 rounded-xl bg-forest-900 border border-forest-600 flex items-center justify-center animate-pulse mb-4 text-emerald-400">
          🛰
        </div>
        <div className="text-sm font-bold tracking-widest uppercase text-emerald-400 mb-1">
          AeroTwin Intelligence Engine
        </div>
        <p className="text-xs text-graphite-400 font-sans">
          Synchronizing Sentinel-5P DOAS swath & ERA5 meteorology...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f1] text-graphite-900 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full">
          {activeTab === 'overview' && (
            <DashboardView
              metrics={metrics}
              regions={regions}
              stations={stations}
              fireHotspots={fireHotspots}
              weather={weather}
              trend7D={trend7D}
              trend30D={trend30D}
              trendMonthly={trendMonthly}
              biomassData={biomassData}
              predictionDiagnostics={predictionDiagnostics}
              pipelineStages={pipelineStages}
              alerts={alerts}
              dataSources={dataSources}
              timeWindow={timeWindow}
              setTimeWindow={setTimeWindow}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'air-quality' && (
            <AirQualityView
              metrics={metrics}
              regions={regions}
              stations={stations}
              onSelectRegion={(reg) => {
                setSelectedRegion(reg);
                setActiveTab('overview');
              }}
            />
          )}

          {activeTab === 'sources' && (
            <SourcesView
              fireHotspots={fireHotspots}
              biomassData={biomassData}
            />
          )}

          {activeTab === 'meteorology' && (
            <div className="space-y-6">
              <WeatherPanel weather={weather} />
              <div className="bg-white p-5 rounded-xl border border-[#dce3d8] shadow-subtle">
                <h3 className="font-bold text-base text-graphite-900 mb-2">
                  ERA5 Atmospheric Dispersion Modeling
                </h3>
                <p className="text-xs text-graphite-600 leading-relaxed">
                  Planetary Boundary Layer Height (PBLH) combined with horizontal wind vectors governs the volume of air available for dispersing surface emissions. In North India during post-monsoon (October–November), nocturnal radiation cooling leads to intense temperature inversions compressing the boundary layer below 800m, trapping pyrogenic stubble burning aerosols close to the ground.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <PredictionView
              diagnostics={predictionDiagnostics}
              pipelineStages={pipelineStages}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView stations={stations} />
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <Pipeline stages={pipelineStages} />
              <PredictionCard diagnostics={predictionDiagnostics} />
            </div>
          )}
        </main>

      </div>

    </div>
  );
}

export default App;

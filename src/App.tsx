import React, { useState, useEffect, useCallback } from 'react';
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
  TimeWindow,
  ActiveLocation,
  LocationSearchResult,
  PollutantBreakdown,
  HourlyForecastPoint
} from './types';
import { pollutionService } from './services/pollutionService';
import { weatherService } from './services/weatherService';
import { fireService } from './services/fireService';
import { predictionService } from './services/predictionService';
import { realtimeAqiService } from './services/realtimeAqiService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('7D');
  const [selectedRegion, setSelectedRegion] = useState<RegionTelemetry | null>(null);

  // Active Selected Location State (Default: Delhi, India)
  const [currentLocation, setCurrentLocation] = useState<ActiveLocation>({
    name: 'Delhi',
    state: 'NCT of Delhi',
    country: 'India',
    lat: 28.65195,
    lng: 77.23149,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Application Data States (Live Telemetry & Ingestion)
  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [regions, setRegions] = useState<RegionTelemetry[]>([]);
  const [stations, setStations] = useState<StationData[]>([]);
  const [fireHotspots, setFireHotspots] = useState<FireHotspot[]>([]);
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);
  const [pollutantBreakdown, setPollutantBreakdown] = useState<PollutantBreakdown | undefined>(undefined);
  const [trend7D, setTrend7D] = useState<PollutionTimeSeriesPoint[]>([]);
  const [trend30D, setTrend30D] = useState<PollutionTimeSeriesPoint[]>([]);
  const [trendMonthly, setTrendMonthly] = useState<PollutionTimeSeriesPoint[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastPoint[]>([]);
  const [biomassData, setBiomassData] = useState<FireBiomassInfluencePoint[]>([]);
  const [predictionDiagnostics, setPredictionDiagnostics] = useState<PredictionModelDiagnostics | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageInfo[]>([]);
  const [alerts, setAlerts] = useState<AtmosphericAlert[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Function to load Live Real-Time Telemetry for a target location
  const loadLocationData = useCallback(async (loc: ActiveLocation) => {
    setIsLoadingLocation(true);
    try {
      const [bundle, pipeRes, srcRes] = await Promise.all([
        realtimeAqiService.fetchCompleteTelemetryForLocation(loc),
        predictionService.getPipelineStages(),
        pollutionService.getDataSources(),
      ]);

      setMetrics(bundle.metrics);
      setSelectedRegion(bundle.selectedRegion);
      setRegions(bundle.regions);
      setWeather(bundle.weather);
      setPollutantBreakdown(bundle.pollutantBreakdown);
      setTrend7D(bundle.trend7D);
      setTrend30D(bundle.trend30D);
      setTrendMonthly(bundle.trendMonthly);
      setHourlyForecast(bundle.hourlyForecast);
      setStations(bundle.stations);
      setAlerts(bundle.alerts);
      setPredictionDiagnostics(bundle.predictionDiagnostics);
      setBiomassData(bundle.biomassData);
      setFireHotspots(bundle.fireHotspots);
      setPipelineStages(pipeRes);
      setDataSources(srcRes);
      setLastUpdatedTime(bundle.fetchedAt);
    } catch (err) {
      console.error('Error fetching real-time location telemetry:', err);
    } finally {
      setIsLoadingLocation(false);
      setIsLoading(false);
    }
  }, []);

  // Initial Real-time Data Ingestion
  useEffect(() => {
    loadLocationData(currentLocation);
  }, [loadLocationData, currentLocation]);

  // Handler when user searches or clicks a location from the autocomplete dropdown / presets
  const handleSelectLocation = async (locResult: LocationSearchResult) => {
    const nextLoc: ActiveLocation = {
      name: locResult.name,
      state: locResult.admin1 || locResult.country || '',
      country: locResult.country || 'India',
      lat: locResult.latitude,
      lng: locResult.longitude,
    };
    setCurrentLocation(nextLoc);
    await loadLocationData(nextLoc);
  };

  // Handler when user clicks anywhere on the Leaflet map to inspect custom coordinates
  const handleMapClickCoordinates = async (lat: number, lng: number) => {
    setIsLoadingLocation(true);
    try {
      const revGeocoded = await realtimeAqiService.reverseGeocode(lat, lng);
      const nextLoc: ActiveLocation = {
        name: revGeocoded.name,
        state: revGeocoded.admin1 || '',
        country: revGeocoded.country || '',
        lat,
        lng,
        isCustomCoordinates: true,
      };
      setCurrentLocation(nextLoc);
      await loadLocationData(nextLoc);
    } catch (err) {
      console.error('Error reverse geocoding map point:', err);
      setIsLoadingLocation(false);
    }
  };

  // Trigger Real-Time Feed Refresh
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      await loadLocationData(currentLocation);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  if (isLoading || !metrics || !weather || !predictionDiagnostics) {
    return (
      <div className="min-h-screen bg-[#121a15] flex flex-col items-center justify-center text-ivory-50 p-4 font-mono">
        <div className="w-12 h-12 rounded-xl bg-forest-900 border border-forest-600 flex items-center justify-center animate-pulse mb-4 text-emerald-400">
          🛰
        </div>
        <div className="text-sm font-bold tracking-widest uppercase text-emerald-400 mb-1">
          AeroTwin Real-Time Intelligence Engine
        </div>
        <p className="text-xs text-graphite-400 font-sans">
          Fetching live Open-Meteo Air Quality, Sentinel-5P DOAS & ERA5 meteorology...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f1] text-graphite-900 font-sans">
      
      {/* Top Navbar with Real-Time Location Search */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        isLoadingLocation={isLoadingLocation}
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
              currentLocation={currentLocation}
              onSelectLocation={handleSelectLocation}
              onMapClickCoordinates={handleMapClickCoordinates}
              lastUpdatedTime={lastUpdatedTime}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'air-quality' && (
            <AirQualityView
              metrics={metrics}
              regions={regions}
              stations={stations}
              currentLocation={currentLocation}
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
              pollutantBreakdown={pollutantBreakdown}
              currentLocation={currentLocation}
            />
          )}

          {activeTab === 'meteorology' && (
            <div className="space-y-6">
              <WeatherPanel weather={weather} />
              <div className="bg-white p-5 rounded-xl border border-[#dce3d8] shadow-subtle">
                <h3 className="font-bold text-base text-graphite-900 mb-2 font-sans">
                  ERA5 Atmospheric Dispersion Modeling ({currentLocation.name})
                </h3>
                <p className="text-xs text-graphite-600 leading-relaxed">
                  Planetary Boundary Layer Height (PBLH: {weather.boundaryLayerHeight}m) combined with surface wind speed ({weather.windSpeed} m/s along {weather.windDirection}) governs atmospheric ventilation (Ventilation Coefficient: {weather.ventilationCoefficient} m²/s). During temperature inversions, nocturnal radiation cooling traps surface emissions close to the ground.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <PredictionView
              diagnostics={predictionDiagnostics}
              pipelineStages={pipelineStages}
              hourlyForecast={hourlyForecast}
              currentLocation={currentLocation}
              liveAqi={metrics.surfaceAqi.value}
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

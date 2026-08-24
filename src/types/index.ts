export type AQICategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe';

export type TimeWindow = '7D' | '30D' | 'Monthly';

export type SimulationEpisode = 'oct2024_peak' | 'post_monsoon' | 'winter_inversion';

export interface MetricSummary {
  surfaceAqi: {
    value: number;
    status: AQICategory;
    change24h: number;
    sparkline: number[];
  };
  surfaceNo2: {
    value: number;
    unit: string;
    change24h: number;
    sparkline: number[];
  };
  hchoColumn: {
    value: string;
    unit: string;
    change24h: number;
    sparkline: number[];
  };
  fireActivity: {
    count: number;
    unit: string;
    change24h: number;
    sparkline: number[];
    regionFocus: string;
  };
  boundaryLayerHeight: {
    value: number;
    unit: string;
    change24h: number;
    status: 'Inversion Trapping' | 'Moderate Dispersion' | 'Favorable';
    sparkline: number[];
  };
}

export interface RegionTelemetry {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  aqiCategory: AQICategory;
  no2: number; // µg/m³
  hcho: string; // molecules/cm²
  fireInfluence: 'Low' | 'Moderate' | 'High' | 'Severe';
  blh: number; // meters
  wind: string;
  windSpeed: number;
  predictionConfidence: number; // e.g. 91%
  dominantPollutant: 'PM2.5' | 'NO2' | 'PM10' | 'O3';
  stubbleBurnPlumeImpact: number; // 0 - 100 %
  groundStationsActive: number;
  overviewSummary: string;
}

export interface StationData {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  aqiCategory: AQICategory;
  no2: number; // µg/m³
  pm25: number;
  pm10: number;
  predictedAqi: number;
  modelDelta: number; // predicted - actual
  status: 'Operational' | 'Calibrating' | 'Maintenance';
  lastPing: string;
}

export interface FireHotspot {
  id: string;
  lat: number;
  lng: number;
  frp: number; // Fire Radiative Power (MW)
  brightness: number; // Kelvin
  confidence: number; // 0-100%
  district: string;
  state: string;
  satellite: 'MODIS (Aqua/Terra)' | 'VIIRS (Suomi-NPP)';
  timestamp: string;
}

export interface WeatherTelemetry {
  temperature: number; // °C
  windSpeed: number; // m/s
  windDirection: string; // SW → NE
  windDegrees: number; // 225 deg
  relativeHumidity: number; // %
  boundaryLayerHeight: number; // m
  surfacePressure: number; // hPa
  dewPoint: number; // °C
  inversionRisk: 'Extreme' | 'High' | 'Moderate' | 'Low';
  ventilationCoefficient: number; // m²/s
}

export interface PollutionTimeSeriesPoint {
  date: string;
  surfaceNo2: number; // µg/m³
  predictedAqi: number; // AQI
  tropomiNo2: number; // 10^15 molec/cm²
  actualAqi?: number;
}

export interface FireBiomassInfluencePoint {
  date: string;
  fireCount: number;
  hchoColumn: number; // scaled 10^15 molec/cm²
  downwindNo2: number; // µg/m³
  windSpeedAvg: number; // m/s
}

export interface PredictionModelDiagnostics {
  modelName: string;
  algorithm: string;
  version: string;
  targetVariable: string;
  currentPrediction: number;
  predictedCategory: AQICategory;
  confidence: number;
  r2: number;
  rmse: number;
  mae: number;
  lastTrainedDate: string;
  trainingSamplesCount: string;
  actualVsPredictedScatter: {
    actual: number;
    predicted: number;
    station: string;
  }[];
  featureImportance: {
    feature: string;
    importance: number; // percentage
    source: string;
  }[];
}

export interface PipelineStageInfo {
  id: string;
  stepNumber: number;
  name: string;
  codeName: string;
  category: 'satellite' | 'meteorology' | 'preprocessing' | 'machine-learning' | 'output';
  role: string;
  sensor: string;
  spatialResolution: string;
  temporalResolution: string;
  description: string;
  physicalBasis: string;
  keyParameters: string[];
}

export interface AtmosphericAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'advisory' | 'info';
  title: string;
  location: string;
  category: 'Air Quality' | 'Biomass Fire' | 'Meteorology' | 'Inversion';
  message: string;
  impactRadius: string;
  advisory: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  satelliteOrNetwork: string;
  parameters: string[];
  spatialResolution: string;
  latency: string;
  status: 'ONLINE' | 'PROCESSING' | 'NOMINAL' | 'DELAYED';
  description: string;
  provider: string;
  lastIngestTime: string;
}

export interface ActiveMapLayers {
  predictedAqi: boolean;
  tropomiNo2: boolean;
  tropomiHcho: boolean;
  modisFire: boolean;
  windVectors: boolean;
  groundStations: boolean;
}

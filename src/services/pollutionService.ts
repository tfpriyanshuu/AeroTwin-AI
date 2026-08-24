import { mockMetricSummary, mockRegions, mock7DayTrend, mock30DayTrend, mockMonthlyTrend } from '../data/mockPollution';
import { mockStations } from '../data/mockStations';
import { mockAlerts, mockDataSources } from '../data/mockAlerts';
import { MetricSummary, RegionTelemetry, StationData, TimeWindow, AtmosphericAlert, DataSourceItem, PollutionTimeSeriesPoint } from '../types';

/**
 * Pollution Service
 * 
 * BACKEND INTEGRATION NOTE:
 * When connecting real backend APIs:
 * 1. Replace mock returns with fetch / axios requests to your backend (e.g., `api/v1/pollution/summary`, `api/v1/gee/tropomi-no2`)
 * 2. Connect Google Earth Engine API or Copernicus Open Access Data Hub for Sentinel-5P L2 data.
 * 3. Ingest real-time CPCB CAAQMS ground station feeds via Central Pollution Control Board API.
 */

export const pollutionService = {
  // Fetch high-level 5 metric cards summary
  async getMetricSummary(): Promise<MetricSummary> {
    // In production: return (await apiClient.get('/api/v1/metrics/summary')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMetricSummary), 120);
    });
  },

  // Fetch regional pollution breakdown
  async getRegions(): Promise<RegionTelemetry[]> {
    // In production: return (await apiClient.get('/api/v1/regions')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRegions), 150);
    });
  },

  // Fetch ground monitoring stations list
  async getStations(): Promise<StationData[]> {
    // In production: return (await apiClient.get('/api/v1/stations/cpcb')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStations), 180);
    });
  },

  // Fetch pollution historical trend by time window (7D, 30D, Monthly)
  async getPollutionTrend(window: TimeWindow = '7D'): Promise<PollutionTimeSeriesPoint[]> {
    // In production: return (await apiClient.get(`/api/v1/pollution/trend?range=${window}`)).data;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (window === '7D') resolve(mock7DayTrend);
        else if (window === '30D') resolve(mock30DayTrend);
        else resolve(mockMonthlyTrend);
      }, 140);
    });
  },

  // Fetch real-time atmospheric alerts
  async getAlerts(): Promise<AtmosphericAlert[]> {
    // In production: return (await apiClient.get('/api/v1/alerts')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAlerts), 100);
    });
  },

  // Fetch data sources status
  async getDataSources(): Promise<DataSourceItem[]> {
    // In production: return (await apiClient.get('/api/v1/datasources/telemetry')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataSources), 110);
    });
  }
};

import { mockMetricSummary, mockRegions, mock7DayTrend, mock30DayTrend, mockMonthlyTrend } from '../data/mockPollution';
import { mockStations } from '../data/mockStations';
import { mockAlerts, mockDataSources } from '../data/mockAlerts';
import { MetricSummary, RegionTelemetry, StationData, TimeWindow, AtmosphericAlert, DataSourceItem, PollutionTimeSeriesPoint, ActiveLocation } from '../types';
import { realtimeAqiService } from './realtimeAqiService';

/**
 * Pollution Service
 * Backed by live Open-Meteo Air Quality API with fallback to high-fidelity Sentinel-5P mock datasets.
 */

export const pollutionService = {
  // Fetch high-level 5 metric cards summary for active location
  async getMetricSummary(location?: ActiveLocation): Promise<MetricSummary> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.metrics;
      } catch (err) {
        console.warn('Real-time API error in getMetricSummary, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMetricSummary), 60);
    });
  },

  // Fetch regional pollution breakdown
  async getRegions(location?: ActiveLocation): Promise<RegionTelemetry[]> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.regions;
      } catch (err) {
        console.warn('Real-time API error in getRegions, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRegions), 60);
    });
  },

  // Fetch ground monitoring stations list around active location
  async getStations(location?: ActiveLocation): Promise<StationData[]> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.stations;
      } catch (err) {
        console.warn('Real-time API error in getStations, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStations), 60);
    });
  },

  // Fetch pollution historical trend by time window (7D, 30D, Monthly)
  async getPollutionTrend(window: TimeWindow = '7D', location?: ActiveLocation): Promise<PollutionTimeSeriesPoint[]> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        if (window === '7D') return bundle.trend7D;
        if (window === '30D') return bundle.trend30D;
        return bundle.trendMonthly;
      } catch (err) {
        console.warn('Real-time API error in getPollutionTrend, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        if (window === '7D') resolve(mock7DayTrend);
        else if (window === '30D') resolve(mock30DayTrend);
        else resolve(mockMonthlyTrend);
      }, 60);
    });
  },

  // Fetch real-time atmospheric alerts for active location
  async getAlerts(location?: ActiveLocation): Promise<AtmosphericAlert[]> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.alerts;
      } catch (err) {
        console.warn('Real-time API error in getAlerts, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAlerts), 50);
    });
  },

  // Fetch data sources status
  async getDataSources(): Promise<DataSourceItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataSources), 50);
    });
  }
};

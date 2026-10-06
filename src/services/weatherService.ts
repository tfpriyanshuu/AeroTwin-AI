import { mockWeatherTelemetry, mockRegionalWeather } from '../data/mockWeather';
import { WeatherTelemetry, ActiveLocation } from '../types';
import { realtimeAqiService } from './realtimeAqiService';

/**
 * Weather & ERA5 Reanalysis Service
 * Backed by live Open-Meteo Meteorology & Boundary Layer Height API
 */

export const weatherService = {
  async getCurrentWeather(location?: ActiveLocation | string): Promise<WeatherTelemetry> {
    if (location && typeof location === 'object') {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.weather;
      } catch (err) {
        console.warn('Real-time weather API error, falling back:', err);
      }
    } else if (typeof location === 'string' && location in mockRegionalWeather) {
      const reg = mockRegionalWeather[location as keyof typeof mockRegionalWeather];
      return {
        ...mockWeatherTelemetry,
        ...reg,
        ventilationCoefficient: Math.round(reg.boundaryLayerHeight * reg.windSpeed),
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWeatherTelemetry), 60);
    });
  }
};

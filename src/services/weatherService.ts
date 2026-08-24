import { mockWeatherTelemetry, mockRegionalWeather } from '../data/mockWeather';
import { WeatherTelemetry } from '../types';

/**
 * Weather & ERA5 Reanalysis Service
 * 
 * BACKEND INTEGRATION NOTE:
 * When connecting real backend APIs:
 * 1. Fetch ECMWF ERA5 hourly single levels (BLH, 10m u/v wind, 2m temp, surface solar radiation).
 * 2. Process wind vectors using GRIB2/NetCDF loaders or CDS API python sidecar.
 * 3. Calculate ventilation coefficient dynamically: (BLH * sqrt(u^2 + v^2)).
 */

export const weatherService = {
  async getCurrentWeather(regionId?: string): Promise<WeatherTelemetry> {
    // In production: return (await apiClient.get(`/api/v1/weather/era5?region=${regionId || 'default'}`)).data;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (regionId && regionId in mockRegionalWeather) {
          const reg = mockRegionalWeather[regionId as keyof typeof mockRegionalWeather];
          resolve({
            ...mockWeatherTelemetry,
            ...reg,
            ventilationCoefficient: Math.round(reg.boundaryLayerHeight * reg.windSpeed),
          });
        } else {
          resolve(mockWeatherTelemetry);
        }
      }, 130);
    });
  }
};

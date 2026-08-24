import { WeatherTelemetry } from '../types';

export const mockWeatherTelemetry: WeatherTelemetry = {
  temperature: 24.8,
  windSpeed: 3.7,
  windDirection: 'SW → NE',
  windDegrees: 225,
  relativeHumidity: 62,
  boundaryLayerHeight: 742,
  surfacePressure: 1012.4,
  dewPoint: 17.2,
  inversionRisk: 'High',
  ventilationCoefficient: 2745, // m²/s (Wind Speed * BLH)
};

export const mockRegionalWeather = {
  'delhi-ncr': {
    temperature: 24.8,
    windSpeed: 3.7,
    windDirection: 'SW → NE',
    windDegrees: 225,
    relativeHumidity: 62,
    boundaryLayerHeight: 742,
    inversionRisk: 'High' as const,
  },
  'punjab-agri': {
    temperature: 23.2,
    windSpeed: 4.1,
    windDirection: 'NW → SE',
    windDegrees: 315,
    relativeHumidity: 58,
    boundaryLayerHeight: 810,
    inversionRisk: 'Moderate' as const,
  },
  'haryana-belt': {
    temperature: 24.0,
    windSpeed: 3.9,
    windDirection: 'WNW → ESE',
    windDegrees: 290,
    relativeHumidity: 60,
    boundaryLayerHeight: 790,
    inversionRisk: 'High' as const,
  },
  'mumbai-mmr': {
    temperature: 29.5,
    windSpeed: 5.2,
    windDirection: 'NW → SE',
    windDegrees: 310,
    relativeHumidity: 74,
    boundaryLayerHeight: 1120,
    inversionRisk: 'Low' as const,
  },
};

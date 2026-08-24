import { mockFireHotspots, mockBiomassInfluenceSeries } from '../data/mockFireData';
import { FireHotspot, FireBiomassInfluencePoint } from '../types';

/**
 * Fire & Biomass Burning Service
 * 
 * BACKEND INTEGRATION NOTE:
 * When connecting real backend APIs:
 * 1. Query NASA FIRMS (Fire Information for Resource Management System) REST API for near real-time MODIS / VIIRS active fires.
 * 2. Filter thermal detections by confidence > 70% and calculate district-level Fire Radiative Power (FRP) density.
 * 3. Feed FRP time-series into HYSPLIT trajectory or lag regression models to predict downwind smoke transport.
 */

export const fireService = {
  async getActiveFireHotspots(): Promise<FireHotspot[]> {
    // In production: return (await apiClient.get('/api/v1/fires/firms-active')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFireHotspots), 150);
    });
  },

  async getBiomassInfluenceSeries(): Promise<FireBiomassInfluencePoint[]> {
    // In production: return (await apiClient.get('/api/v1/fires/biomass-transport-correlation')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBiomassInfluenceSeries), 140);
    });
  }
};

import { mockPredictionDiagnostics } from '../data/mockPrediction';
import { mockPipelineStages } from '../data/mockPipeline';
import { PredictionModelDiagnostics, PipelineStageInfo, ActiveLocation } from '../types';
import { realtimeAqiService } from './realtimeAqiService';

/**
 * Prediction & Machine Learning Diagnostic Service
 * Provides real-time physics-regularized ensemble predictions and validation metrics.
 */

export const predictionService = {
  async getModelDiagnostics(location?: ActiveLocation): Promise<PredictionModelDiagnostics> {
    if (location) {
      try {
        const bundle = await realtimeAqiService.fetchCompleteTelemetryForLocation(location);
        return bundle.predictionDiagnostics;
      } catch (err) {
        console.warn('Real-time prediction API error, falling back:', err);
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPredictionDiagnostics), 60);
    });
  },

  async getPipelineStages(): Promise<PipelineStageInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPipelineStages), 50);
    });
  }
};

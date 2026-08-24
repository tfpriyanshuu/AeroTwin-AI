import { mockPredictionDiagnostics } from '../data/mockPrediction';
import { mockPipelineStages } from '../data/mockPipeline';
import { PredictionModelDiagnostics, PipelineStageInfo } from '../types';

/**
 * Prediction & Machine Learning Diagnostic Service
 * 
 * BACKEND INTEGRATION NOTE:
 * When connecting real backend APIs:
 * 1. Interface with Python FastAPI / Flask model serving container running Random Forest / LightGBM / CNN-LSTM.
 * 2. Serve continuous raster predictions or grid inferences for surface AQI and NO2 estimation.
 * 3. Provide real-time validation metrics against collocated CPCB ground-truth stations.
 */

export const predictionService = {
  async getModelDiagnostics(): Promise<PredictionModelDiagnostics> {
    // In production: return (await apiClient.get('/api/v1/ml/diagnostics')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPredictionDiagnostics), 160);
    });
  },

  async getPipelineStages(): Promise<PipelineStageInfo[]> {
    // In production: return (await apiClient.get('/api/v1/ml/pipeline-graph')).data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPipelineStages), 100);
    });
  }
};

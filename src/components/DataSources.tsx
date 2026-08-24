import React from 'react';
import { 
  Orbit, 
  CloudSun, 
  Flame, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Activity, 
  Radio, 
  Database,
  ExternalLink
} from 'lucide-react';
import { DataSourceItem } from '../types';

interface DataSourcesProps {
  sources: DataSourceItem[];
}

export const DataSources: React.FC<DataSourcesProps> = ({ sources }) => {
  const getSourceIcon = (id: string) => {
    switch (id) {
      case 'src-s5p':
        return Orbit;
      case 'src-era5':
        return CloudSun;
      case 'src-modis':
        return Flame;
      case 'src-cpcb':
      default:
        return Building2;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
      case 'NOMINAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'DELAYED':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-forest-100 border border-forest-300 flex items-center justify-center text-forest-800">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              Data Ingestion Telemetry
            </h3>
            <p className="text-xs text-graphite-500">
              Multi-mission spaceborne & in-situ observation pipelines
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#edf4ee] text-forest-800 px-2 py-0.5 rounded border border-[#d0ddca]">
          4 Pipelines Active
        </span>
      </div>

      {/* Grid of 4 Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {sources.map((src) => {
          const Icon = getSourceIcon(src.id);
          const statusClass = getStatusBadge(src.status);

          return (
            <div
              key={src.id}
              className="bg-[#f8faf7] p-3.5 rounded-xl border border-[#e2e8dc] flex flex-col justify-between hover:border-forest-600 transition-colors group"
            >
              <div>
                {/* Top: Icon + Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#d4decb] flex items-center justify-center text-forest-800 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${statusClass}`}>
                    {src.status}
                  </span>
                </div>

                {/* Name */}
                <h4 className="font-bold text-sm text-graphite-900 leading-tight">
                  {src.name}
                </h4>
                <div className="text-[11px] text-forest-800 font-mono mt-0.5">
                  {src.satelliteOrNetwork}
                </div>

                {/* Short description */}
                <p className="text-xs text-graphite-600 mt-2 leading-relaxed">
                  {src.description}
                </p>
              </div>

              {/* Specs Box */}
              <div className="mt-3 pt-2.5 border-t border-[#e2e8dc] space-y-1 font-mono text-[10px] text-graphite-500">
                <div className="flex justify-between">
                  <span>RESOLUTION:</span>
                  <strong className="text-graphite-800">{src.spatialResolution}</strong>
                </div>
                <div className="flex justify-between">
                  <span>LATENCY:</span>
                  <span className="text-graphite-800">{src.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span>PROVIDER:</span>
                  <span className="text-graphite-700 truncate max-w-[120px]">{src.provider}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-[#f6f8f4] rounded-lg border border-[#e0e7dc] flex items-center justify-between text-xs font-mono text-graphite-500">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Automated Daily Synchronizer & Regridding Engine Operational</span>
        </div>
        <span className="text-[10px] text-graphite-400">ISRO / GEE Ingest Standard</span>
      </div>

    </div>
  );
};

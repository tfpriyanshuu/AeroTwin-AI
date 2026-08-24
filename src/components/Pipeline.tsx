import React, { useState } from 'react';
import { 
  Orbit, 
  Flame, 
  Wind, 
  Layers, 
  Cpu, 
  Gauge, 
  ArrowRight, 
  Info, 
  CheckCircle, 
  X,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import { PipelineStageInfo } from '../types';

interface PipelineProps {
  stages: PipelineStageInfo[];
}

export const Pipeline: React.FC<PipelineProps> = ({ stages }) => {
  const [selectedStage, setSelectedStage] = useState<PipelineStageInfo | null>(null);
  const [hoveredStage, setHoveredStage] = useState<PipelineStageInfo | null>(null);

  const getStageIcon = (category: string) => {
    switch (category) {
      case 'satellite':
        return Orbit;
      case 'meteorology':
        return Wind;
      case 'preprocessing':
        return Layers;
      case 'machine-learning':
        return Cpu;
      case 'output':
      default:
        return Gauge;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'satellite':
        return 'border-amber-400 bg-amber-50 text-amber-900';
      case 'meteorology':
        return 'border-teal-400 bg-teal-50 text-teal-900';
      case 'preprocessing':
        return 'border-purple-400 bg-purple-50 text-purple-900';
      case 'machine-learning':
        return 'border-emerald-500 bg-emerald-50 text-emerald-900';
      case 'output':
      default:
        return 'border-orange-500 bg-orange-50 text-orange-950';
    }
  };

  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edf1e8]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              AI Atmospheric Processing Pipeline
            </h3>
            <span className="text-[10px] font-mono bg-forest-100 text-forest-800 border border-forest-300 px-2 py-0.5 rounded uppercase">
              End-to-End Workflow
            </span>
          </div>
          <p className="text-xs text-graphite-500 mt-0.5">
            Click or hover any stage to inspect satellite sensors, spatial regridding, and physical basis
          </p>
        </div>

        <div className="text-[11px] font-mono text-graphite-400">
          7 Synchronized Pipeline Stages
        </div>
      </div>

      {/* Horizontal Flowchart (Responsive scrollable) */}
      <div className="my-6 overflow-x-auto pb-3 pt-1">
        <div className="flex items-center space-x-2 min-w-[960px]">
          {stages.map((stage, idx) => {
            const Icon = getStageIcon(stage.category);
            const isHovered = hoveredStage?.id === stage.id;
            const isSelected = selectedStage?.id === stage.id;
            const colorClass = getCategoryColor(stage.category);

            return (
              <React.Fragment key={stage.id}>
                
                {/* Node Box */}
                <div
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => setSelectedStage(stage)}
                  className={`flex-1 min-w-[125px] p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left relative group ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50 shadow-md ring-2 ring-forest-500/20'
                      : isHovered
                        ? 'border-forest-600 bg-[#f4f7f2] shadow-sm transform -translate-y-0.5'
                        : `${colorClass} hover:border-forest-600`
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/80 border border-current">
                      0{stage.stepNumber}
                    </span>
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                  </div>

                  {/* Stage Name */}
                  <div className="font-bold text-xs tracking-tight text-graphite-900 line-clamp-1">
                    {stage.name}
                  </div>

                  {/* Micro Role Description */}
                  <p className="text-[10px] text-graphite-600 mt-1 leading-tight line-clamp-2">
                    {stage.role}
                  </p>

                  {/* Resolution Tag */}
                  <div className="mt-2 pt-1 border-t border-black/5 text-[9px] font-mono text-graphite-500">
                    {stage.spatialResolution}
                  </div>
                </div>

                {/* Arrow connector between stages */}
                {idx < stages.length - 1 && (
                  <div className="text-graphite-400 shrink-0 px-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}

              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Inspection Card */}
      {(selectedStage || hoveredStage) && (
        <div className="p-4 bg-[#f6f8f4] rounded-xl border border-[#d6e0d0] text-xs font-sans animate-fadeIn">
          {(() => {
            const active = selectedStage || hoveredStage!;
            return (
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#d8e2d2]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-forest-800 text-ivory-50 px-2 py-0.5 rounded">
                      Stage {active.stepNumber}: {active.name}
                    </span>
                    <span className="text-graphite-500 font-mono text-[11px]">[{active.codeName}]</span>
                  </div>
                  {selectedStage && (
                    <button
                      onClick={() => setSelectedStage(null)}
                      className="text-graphite-400 hover:text-graphite-700 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2.5">
                  <div className="md:col-span-2 space-y-1.5">
                    <div>
                      <strong className="text-graphite-800 font-mono text-[11px] block">Role & Scientific Description:</strong>
                      <p className="text-graphite-700 text-xs leading-relaxed mt-0.5">{active.description}</p>
                    </div>
                    <div>
                      <strong className="text-forest-900 font-mono text-[11px] block">Physical Mechanism Basis:</strong>
                      <p className="text-graphite-600 text-xs leading-relaxed mt-0.5">{active.physicalBasis}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#d6e0d0] font-mono text-[11px] space-y-1.5">
                    <div>
                      <span className="text-graphite-400 block text-[10px]">INSTRUMENT / SENSOR:</span>
                      <span className="text-graphite-900 font-semibold">{active.sensor}</span>
                    </div>
                    <div>
                      <span className="text-graphite-400 block text-[10px]">SPATIAL & TEMPORAL CADENCE:</span>
                      <span className="text-graphite-900">{active.spatialResolution} • {active.temporalResolution}</span>
                    </div>
                    <div>
                      <span className="text-graphite-400 block text-[10px]">KEY PARAMETERS:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {active.keyParameters.map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#edf3ea] text-forest-900 rounded text-[9px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
};

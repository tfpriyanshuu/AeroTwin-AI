import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Bell, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AtmosphericAlert } from '../types';

interface AlertPanelProps {
  alerts: AtmosphericAlert[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          dot: 'bg-rose-600',
          badge: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
          tag: 'CRITICAL WARNING',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          dot: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          tag: 'ELEVATED ALERT',
        };
      case 'advisory':
        return {
          icon: Info,
          bg: 'bg-rust-50 border-rust-200 text-rust-900',
          dot: 'bg-rust-500',
          badge: 'bg-rust-100 text-rust-900 border-rust-300',
          tag: 'ADVISORY',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bg: 'bg-forest-50 border-forest-200 text-forest-900',
          dot: 'bg-emerald-600',
          badge: 'bg-forest-100 text-forest-800 border-forest-300',
          tag: 'CONDITIONS NOMINAL',
        };
    }
  };

  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              Environmental Alerts & Advisories
            </h3>
            <p className="text-xs text-graphite-500">
              Live automated alerts triggered by satellite threshold exceedances
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
          {alerts.length} ACTIVE
        </span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3 my-4">
        {alerts.map((alt) => {
          const style = getSeverityStyle(alt.severity);
          const Icon = style.icon;

          return (
            <div
              key={alt.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${style.bg} flex flex-col justify-between`}
            >
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.badge}`}>
                    {style.tag}
                  </span>
                  <span className="text-xs font-mono font-semibold text-graphite-700">
                    {alt.category}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-[11px] font-mono text-graphite-500">
                  <Clock className="w-3 h-3" />
                  <span>{alt.timestamp}</span>
                </div>
              </div>

              {/* Title & Message */}
              <div className="mt-2">
                <h4 className="font-bold text-sm text-graphite-900">
                  {alt.title}
                </h4>
                <div className="flex items-center space-x-1.5 text-xs text-graphite-600 font-mono mt-0.5">
                  <MapPin className="w-3 h-3 text-rust-600" />
                  <span>{alt.location}</span>
                  <span className="text-graphite-400">({alt.impactRadius})</span>
                </div>
                <p className="text-xs text-graphite-700 mt-1.5 leading-relaxed">
                  {alt.message}
                </p>
              </div>

              {/* Advisory Callout */}
              <div className="mt-2.5 pt-2 border-t border-black/5 flex items-start space-x-1.5 text-xs font-mono">
                <strong className="text-graphite-900 shrink-0">ACTION:</strong>
                <span className="text-graphite-700">{alt.advisory}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

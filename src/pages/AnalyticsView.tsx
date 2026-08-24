import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  MapPin, 
  Sliders, 
  ArrowUpDown, 
  CheckCircle2, 
  Building2,
  Share2
} from 'lucide-react';
import { StationData } from '../types';
import { StationTable } from '../components/StationTable';
import { getAqiTheme } from '../utils/aqiUtils';

interface AnalyticsViewProps {
  stations: StationData[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stations }) => {
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCSV = () => {
    // Generate CSV data string
    const headers = ['Station Name', 'City', 'State', 'AQI', 'Surface NO2 (ug/m3)', 'PM2.5', 'PM10', 'Model Predicted', 'Error Delta'];
    const rows = stations.map(s => [
      `"${s.name}"`,
      `"${s.city}"`,
      `"${s.state}"`,
      s.aqi,
      s.no2,
      s.pm25,
      s.pm10,
      s.predictedAqi,
      s.modelDelta,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AeroTwin_CAAQMS_Telemetry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('CSV telemetry exported successfully.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Compute summary stats
  const avgAqi = Math.round(stations.reduce((acc, s) => acc + s.aqi, 0) / stations.length);
  const avgNo2 = (stations.reduce((acc, s) => acc + s.no2, 0) / stations.length).toFixed(1);
  const worstStation = [...stations].sort((a, b) => b.aqi - a.aqi)[0];
  const bestStation = [...stations].sort((a, b) => a.aqi - b.aqi)[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-forest-100 border border-forest-300 flex items-center justify-center text-forest-800">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-graphite-950 font-sans">
              Ground Station Analytics & Observational Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-graphite-600 mt-1 max-w-3xl">
            Collocated Central Pollution Control Board (CPCB) continuous monitoring stations cross-calibrated against Sentinel-5P swaths.
          </p>
        </div>

        {/* Export Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 bg-forest-800 hover:bg-forest-700 text-ivory-50 text-xs font-semibold rounded-lg transition-colors border border-forest-600 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Network Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-white p-4 rounded-xl border border-[#dce3d8] shadow-subtle">
          <span className="text-[10px] text-graphite-500 uppercase block">Network Average AQI</span>
          <span className="text-2xl font-black text-orange-600 font-sans mt-1 block">{avgAqi}</span>
          <span className="text-[10px] text-graphite-400">Across {stations.length} reference stations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dce3d8] shadow-subtle">
          <span className="text-[10px] text-graphite-500 uppercase block">Mean Surface NO₂</span>
          <span className="text-2xl font-black text-forest-800 font-sans mt-1 block">{avgNo2} <span className="text-xs font-mono font-normal">µg/m³</span></span>
          <span className="text-[10px] text-graphite-400">Chemiluminescent sensor average</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dce3d8] shadow-subtle">
          <span className="text-[10px] text-graphite-500 uppercase block">Peak Hotspot Station</span>
          <span className="text-sm font-bold text-rose-950 truncate block mt-1">{worstStation.name}</span>
          <span className="text-xs font-bold text-rose-700 font-mono">AQI {worstStation.aqi} ({worstStation.city})</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dce3d8] shadow-subtle">
          <span className="text-[10px] text-graphite-500 uppercase block">Cleanest Airshed Station</span>
          <span className="text-sm font-bold text-emerald-950 truncate block mt-1">{bestStation.name}</span>
          <span className="text-xs font-bold text-emerald-700 font-mono">AQI {bestStation.aqi} ({bestStation.city})</span>
        </div>
      </div>

      {/* Station Table */}
      <StationTable stations={stations} />

    </div>
  );
};

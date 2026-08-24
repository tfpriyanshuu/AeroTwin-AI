import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpDown, 
  Activity, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StationData, AQICategory } from '../types';
import { getAqiTheme } from '../utils/aqiUtils';

interface StationTableProps {
  stations: StationData[];
  onSelectStation?: (station: StationData) => void;
  selectedStationId?: string;
}

export const StationTable: React.FC<StationTableProps> = ({
  stations,
  onSelectStation,
  selectedStationId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'aqi' | 'no2' | 'name'>('aqi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredStations = useMemo(() => {
    return stations
      .filter((st) => {
        const matchesSearch = 
          st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          st.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          st.state.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = 
          categoryFilter === 'all' || 
          st.aqiCategory.toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [stations, searchTerm, categoryFilter, sortField, sortOrder]);

  const handleSort = (field: 'aqi' | 'no2' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-[#ffffff] border border-[#dce3d8] rounded-xl p-5 shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#edf1e8]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-graphite-900 tracking-tight font-sans">
              CPCB CAAQMS Ground Monitoring Network
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#f0f4ed] text-forest-800 px-2 py-0.5 rounded border border-[#d2decb]">
              Ground Truth Calibration
            </span>
          </div>
          <p className="text-xs text-graphite-500 mt-0.5">
            Continuous telemetry from {stations.length} regional stations used for model training and residual error tracking
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-graphite-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station / city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#f6f8f4] border border-[#d4decb] rounded-lg text-xs font-mono text-graphite-900 placeholder:text-graphite-400 focus:outline-none focus:border-forest-700 w-44 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f6f8f4] border border-[#d4decb] rounded-lg px-2.5 py-1.5 text-xs font-mono text-graphite-800 focus:outline-none focus:border-forest-700"
          >
            <option value="all">All Categories</option>
            <option value="severe">Severe (400+)</option>
            <option value="poor">Poor (200-300)</option>
            <option value="moderate">Moderate (100-200)</option>
            <option value="satisfactory">Satisfactory (50-100)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#e2e8dc] text-graphite-500 text-[11px] bg-[#fafbf9]">
              <th 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-graphite-900"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>STATION NAME</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">LOCATION</th>
              <th 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-graphite-900"
                onClick={() => handleSort('aqi')}
              >
                <div className="flex items-center space-x-1">
                  <span>AQI (GROUND)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-graphite-900"
                onClick={() => handleSort('no2')}
              >
                <div className="flex items-center space-x-1">
                  <span>SURFACE NO₂</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">CATEGORY STATUS</th>
              <th className="py-2.5 px-3 font-semibold">AI MODEL DELTA</th>
              <th className="py-2.5 px-3 font-semibold">LAST SYNC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf1e8]">
            {filteredStations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-graphite-400 font-sans">
                  No monitoring stations match your search filter.
                </td>
              </tr>
            ) : (
              filteredStations.map((st) => {
                const theme = getAqiTheme(st.aqiCategory);
                const isSelected = selectedStationId === st.id;

                return (
                  <tr
                    key={st.id}
                    onClick={() => {
                      if (onSelectStation) onSelectStation(st);
                    }}
                    className={`hover:bg-[#f6f8f4] cursor-pointer transition-colors ${
                      isSelected ? 'bg-forest-50/80 font-bold' : ''
                    }`}
                  >
                    {/* Station Name */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-graphite-900">{st.name}</div>
                      <div className="text-[10px] text-graphite-400 font-mono">{st.id}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 text-graphite-700">
                      <div>{st.city}</div>
                      <div className="text-[10px] text-graphite-400">{st.state}</div>
                    </td>

                    {/* AQI */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-sm text-graphite-900">{st.aqi}</span>
                    </td>

                    {/* NO2 */}
                    <td className="py-3 px-3 text-graphite-700 font-medium">
                      {st.no2} µg/m³
                    </td>

                    {/* Category Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${theme.badge}`}>
                        {st.aqiCategory}
                      </span>
                    </td>

                    {/* AI Prediction Delta */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-forest-800 font-semibold">{st.predictedAqi}</span>
                        <span className={`text-[10px] ${st.modelDelta >= 0 ? 'text-rust-600' : 'text-forest-600'}`}>
                          ({st.modelDelta >= 0 ? `+${st.modelDelta}` : st.modelDelta})
                        </span>
                      </div>
                    </td>

                    {/* Last Sync */}
                    <td className="py-3 px-3 text-[11px] text-graphite-400">
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        <span>{st.lastPing}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="mt-3 pt-2.5 border-t border-[#edf1e8] flex items-center justify-between text-[11px] text-graphite-500 font-mono">
        <div>
          Showing {filteredStations.length} of {stations.length} active stations
        </div>
        <div className="text-[10px] text-graphite-400">
          * Protocol: Beta-Attenuation Monitor (BAM) & Chemiluminescence
        </div>
      </div>

    </div>
  );
};

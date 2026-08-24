import React, { useState } from 'react';
import { 
  Satellite, 
  Activity, 
  RefreshCw, 
  Settings, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Radio, 
  Layers, 
  Sparkles,
  X,
  FileText,
  Clock
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefreshFeed?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onRefreshFeed,
  isRefreshing = false
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('30s');
  const [satelliteSwath, setSatelliteSwath] = useState(true);
  const [highContrastOverlay, setHighContrastOverlay] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'air-quality', label: 'Air Quality' },
    { id: 'sources', label: 'Sources & Biomass' },
    { id: 'forecast', label: 'AI Prediction' },
    { id: 'analytics', label: 'Ground Stations' },
  ];

  return (
    <>
      <header className="bg-[#141d18] text-[#f4f6f1] border-b border-[#233229] sticky top-0 z-40 shadow-subtle">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand / Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-10 h-10 rounded-lg bg-forest-900 border border-forest-700/60 flex items-center justify-center text-forest-500 shadow-inner">
                <Satellite className="w-5 h-5 animate-pulse text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-ivory-50 font-sans">AeroTwin</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-forest-950/80 text-emerald-400 border border-forest-800">
                    ISRO / SIH
                  </span>
                </div>
                <p className="text-xs text-graphite-300 tracking-wide font-mono hidden sm:block">
                  Satellite Air Quality Intelligence
                </p>
              </div>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#0e1612] p-1 rounded-lg border border-[#233229]">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-[#1e2e24] text-emerald-300 font-semibold shadow-sm border border-forest-700/50'
                        : 'text-graphite-300 hover:text-ivory-100 hover:bg-[#15211a]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Pipeline Status Pill */}
              <div className="hidden lg:flex items-center space-x-2 bg-[#0e1612] px-3 py-1.5 rounded-full border border-[#26372d] text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-graphite-300 text-[11px]">PIPELINE:</span>
                <span className="text-emerald-400 font-semibold text-[11px] tracking-wide">LIVE</span>
                <span className="text-[#3c5043] font-mono">|</span>
                <span className="text-graphite-400 text-[10px] hidden xl:inline">Pass: 09:30 IST (Orbit #31842)</span>
              </div>

              {/* Refresh Simulator */}
              <button
                onClick={onRefreshFeed}
                title="Trigger Satellite Swath Telemetry Sync"
                className={`p-2 rounded-lg bg-[#1a2620] hover:bg-[#22332a] text-graphite-200 hover:text-ivory-50 border border-[#2b3d32] transition-colors ${
                  isRefreshing ? 'animate-spin text-emerald-400' : ''
                }`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* System Info */}
              <button
                onClick={() => setShowInfoModal(true)}
                title="Mission Architecture & Project Context"
                className="p-2 rounded-lg bg-[#1a2620] hover:bg-[#22332a] text-graphite-200 hover:text-ivory-50 border border-[#2b3d32] transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettingsModal(true)}
                title="Satellite & UI Settings"
                className="p-2 rounded-lg bg-[#1a2620] hover:bg-[#22332a] text-graphite-200 hover:text-ivory-50 border border-[#2b3d32] transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* User / Org Avatar */}
              <div className="flex items-center space-x-2 pl-1 border-l border-[#26372d]">
                <div className="w-8 h-8 rounded-lg bg-[#273a2e] border border-[#3b5243] flex items-center justify-center text-xs font-mono text-emerald-300 font-bold">
                  ISRO
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141d18] border border-[#283b30] rounded-xl max-w-md w-full p-6 text-ivory-100 shadow-elevation">
            <div className="flex items-center justify-between pb-4 border-b border-[#233229]">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-ivory-50">Operations & Display Settings</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-graphite-400 hover:text-ivory-100 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm font-sans">
              <div>
                <label className="text-xs text-graphite-300 font-mono uppercase block mb-1.5">
                  Simulated Ingest Cadence
                </label>
                <select 
                  value={autoRefreshInterval}
                  onChange={(e) => setAutoRefreshInterval(e.target.value)}
                  className="w-full bg-[#0d1410] border border-[#26372d] rounded-lg px-3 py-2 text-sm text-ivory-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="15s">15 Seconds (Rapid Evaluation)</option>
                  <option value="30s">30 Seconds (Standard Orbit Sim)</option>
                  <option value="60s">1 Minute (Low Bandwidth)</option>
                  <option value="manual">Manual Trigger Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-[#233229]">
                <div>
                  <div className="font-medium text-ivory-100">Sentinel-5P Swath Footprint Overlay</div>
                  <div className="text-xs text-graphite-400">Display 5.5 × 3.5 km pixel resolution bounds</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={satelliteSwath}
                  onChange={(e) => setSatelliteSwath(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded bg-[#0d1410] border-[#26372d]"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-[#233229]">
                <div>
                  <div className="font-medium text-ivory-100">High-Contrast Thermal Fire Radiance</div>
                  <div className="text-xs text-graphite-400">Emphasize MODIS active fire radiative power</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={highContrastOverlay}
                  onChange={(e) => setHighContrastOverlay(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded bg-[#0d1410] border-[#26372d]"
                />
              </div>

              <div className="p-3 bg-[#0d1410] rounded-lg border border-[#233229] text-xs text-graphite-300 font-mono">
                <span className="text-emerald-400 font-semibold">NOTE: </span>
                In production, these controls configure Google Earth Engine Earth Engine Python Client & Copernicus Sentinel Hub sync pipelines.
              </div>
            </div>

            <div className="pt-3 border-t border-[#233229] flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-forest-800 hover:bg-forest-700 text-ivory-50 text-xs font-semibold rounded-lg transition-colors border border-forest-600"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission Context Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141d18] border border-[#283b30] rounded-xl max-w-xl w-full p-6 text-ivory-100 shadow-elevation">
            <div className="flex items-center justify-between pb-4 border-b border-[#233229]">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base text-ivory-50">About AeroTwin Platform</h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-graphite-400 hover:text-ivory-100 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed text-graphite-200">
              <p>
                <strong className="text-ivory-50">AeroTwin</strong> is a specialized satellite-driven environmental intelligence platform designed for the <strong className="text-emerald-300">ISRO / Smart India Hackathon (SIH)</strong> atmospheric monitoring problem statement.
              </p>
              <p>
                The platform bridges the spatial resolution gap between spaceborne trace-gas spectrometers (Sentinel-5P/TROPOMI NO₂ & HCHO) and surface ground sensors (CPCB CAAQMS) by integrating:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-graphite-300">
                <li><strong className="text-ivory-100">Sentinel-5P / TROPOMI:</strong> Tropospheric NO₂ and HCHO column densities.</li>
                <li><strong className="text-ivory-100">ECMWF ERA5:</strong> Boundary layer height, wind transport vectors, temperature, humidity.</li>
                <li><strong className="text-ivory-100">NASA MODIS / VIIRS:</strong> Active fire detections & Fire Radiative Power (FRP).</li>
                <li><strong className="text-ivory-100">AI / ML Ensemble:</strong> Physics-informed Random Forest Regressor for surface AQI inference.</li>
              </ul>
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 text-[11px] font-mono">
                ⚡ <strong>Frontend Interface Architecture:</strong> The current user interface displays high-fidelity mock geospatial datasets and is pre-structured for seamless connection to Python Flask/FastAPI, Google Earth Engine, and GRIB2 meteorological decoders.
              </div>
            </div>

            <div className="pt-3 border-t border-[#233229] flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-[#22332a] hover:bg-[#2b4035] text-ivory-50 text-xs font-medium rounded-lg transition-colors border border-[#385042]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

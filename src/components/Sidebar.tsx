import React from 'react';
import { 
  LayoutDashboard, 
  Wind, 
  Orbit, 
  Flame, 
  CloudSun, 
  Cpu, 
  BarChart3, 
  GitBranch, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'air-quality', label: 'Air Quality', icon: Wind },
    { id: 'sources', label: 'Fire & Sources', icon: Flame, badge: '1,284' },
    { id: 'meteorology', label: 'Meteorology', icon: CloudSun },
    { id: 'forecast', label: 'AI Prediction', icon: Cpu, badge: 'R² 0.82' },
    { id: 'analytics', label: 'Ground Stations', icon: BarChart3 },
    { id: 'pipeline', label: 'Model Pipeline', icon: GitBranch },
  ];

  return (
    <aside
      className={`bg-[#121915] text-graphite-300 border-r border-[#223027] transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Branding / Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#202d24]">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-950"></div>
              <span className="text-xs font-mono font-semibold tracking-wider text-ivory-100 uppercase">
                Mission Ops
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-graphite-400 hover:text-ivory-50 hover:bg-[#1a251e] transition-colors ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#1b2b21] text-emerald-300 font-semibold border border-forest-700/60 shadow-sm'
                    : 'text-graphite-300 hover:text-ivory-100 hover:bg-[#16211a]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-emerald-400' : 'text-graphite-400 group-hover:text-ivory-100 group-hover:scale-110'}`} />
                
                {!collapsed && (
                  <span className="ml-3 truncate tracking-wide">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-[#1d2921] text-graphite-300 border border-[#2b3b30]'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed hover */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#1a251e] text-ivory-50 text-[11px] font-medium rounded-md shadow-lg border border-[#2a3c30] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom info section */}
      <div className="p-3 border-t border-[#202d24] space-y-2">
        {!collapsed && (
          <div className="bg-[#0e1511] p-3 rounded-lg border border-[#1f2d24] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISRO-SIH Model Ready</span>
            </div>
            <p className="text-[10px] text-graphite-400 leading-tight">
              Sentinel-5P DOAS & Random Forest surface predictor pipeline.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-graphite-400 px-1 font-mono">
          {!collapsed && <span>v2.4 Prototype</span>}
          <span className="text-[10px] bg-[#1a251e] px-1.5 py-0.5 rounded text-graphite-300">IND-AQI</span>
        </div>
      </div>
    </aside>
  );
};

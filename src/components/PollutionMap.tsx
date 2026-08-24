import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Circle, 
  Marker, 
  Popup, 
  Polygon, 
  Polyline, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  RotateCcw, 
  Sliders, 
  Plus, 
  Minus, 
  Maximize, 
  Minimize,
  Globe,
  Layers
} from 'lucide-react';
import { ActiveMapLayers, FireHotspot, RegionTelemetry, StationData } from '../types';
import { LayerControl } from './LayerControl';
import { getAqiTheme } from '../utils/aqiUtils';

interface PollutionMapProps {
  regions: RegionTelemetry[];
  stations: StationData[];
  fireHotspots: FireHotspot[];
  selectedRegion: RegionTelemetry | null;
  onSelectRegion: (region: RegionTelemetry) => void;
  onSelectStation?: (station: StationData) => void;
}

type BasemapStyle = 'voyager' | 'satellite' | 'dark' | 'osm';

// Controller component to invalidate container size & smoothly pan/zoom map programmatically
const MapViewController: React.FC<{ 
  center: [number, number]; 
  zoom: number; 
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size so all tiles load immediately even before browser layout settles
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);

  return null;
};

// Internal Zoom Controls
const MapZoomController: React.FC<{ onZoomIn: () => void; onZoomOut: () => void }> = () => {
  const map = useMap();

  return (
    <div className="flex flex-col space-y-1">
      <button
        onClick={() => map.zoomIn()}
        className="w-8 h-8 bg-[#141d18]/90 hover:bg-[#1f2d25] text-ivory-100 rounded-lg border border-[#25362b] shadow-panel flex items-center justify-center transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4 text-emerald-400" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-8 h-8 bg-[#141d18]/90 hover:bg-[#1f2d25] text-ivory-100 rounded-lg border border-[#25362b] shadow-panel flex items-center justify-center transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  );
};

export const PollutionMap: React.FC<PollutionMapProps> = ({
  regions,
  stations,
  fireHotspots,
  onSelectRegion,
  onSelectStation,
}) => {
  const [layers, setLayers] = useState<ActiveMapLayers>({
    predictedAqi: true,
    tropomiNo2: false,
    tropomiHcho: false,
    modisFire: true,
    windVectors: true,
    groundStations: true,
  });

  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.75);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Delhi NCR focus
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [isLayerControlOpen, setIsLayerControlOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [basemap, setBasemap] = useState<BasemapStyle>('voyager');

  // Custom DivIcon for Ground Stations
  const createStationIcon = (station: StationData) => {
    const theme = getAqiTheme(station.aqiCategory);
    return L.divIcon({
      className: 'custom-station-pin',
      html: `
        <div style="
          background-color: ${theme.hex};
          color: #ffffff;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 9999px;
          border: 1.5px solid #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
        ">
          <span>${station.aqi}</span>
        </div>
      `,
      iconSize: [40, 20],
      iconAnchor: [20, 10],
    });
  };

  // Custom DivIcon for Fire Hotspots
  const createFireIcon = () => {
    return L.divIcon({
      className: 'custom-fire-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          transform: translate(-50%, -50%);
        ">
          <div style="
            position: absolute;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: rgba(234, 88, 12, 0.4);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background-color: #ea580c;
            border: 1.5px solid #ffedd5;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          ">🔥</div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Indo-Gangetic Basin pollution extent
  const indoGangeticBeltCoords: [number, number][] = [
    [31.8, 74.2],
    [31.4, 76.5],
    [29.8, 77.8],
    [28.2, 79.8],
    [26.8, 82.5],
    [25.4, 85.8],
    [24.8, 87.5],
    [23.5, 87.2],
    [24.2, 84.5],
    [25.8, 80.5],
    [27.4, 77.2],
    [29.2, 75.4],
    [30.8, 74.0],
  ];

  // Wind vectors (NW to SE trajectory simulating post-monsoon stubble transport)
  const windStreamlines: [number, number][][] = [
    [[31.2, 75.0], [29.8, 76.2], [28.6, 77.3], [27.5, 78.8]],
    [[30.5, 74.5], [29.2, 75.8], [28.1, 77.0], [27.0, 78.5]],
    [[31.5, 75.5], [30.1, 76.8], [28.8, 78.0], [27.8, 79.5]],
    [[29.0, 76.0], [28.3, 77.1], [27.2, 78.4], [26.4, 80.2]],
    [[28.6, 77.2], [27.6, 78.5], [26.8, 80.3], [25.6, 85.1]],
  ];

  const resetView = () => {
    setMapCenter([28.6139, 77.2090]);
    setMapZoom(6);
  };

  // Basemap Tile URL Resolver
  const getTileUrl = () => {
    switch (basemap) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
      case 'osm':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'voyager':
      default:
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    }
  };

  const getTileAttribution = () => {
    if (basemap === 'satellite') {
      return '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }
    if (basemap === 'osm') {
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
    return '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap';
  };

  return (
    <div 
      className={`relative w-full rounded-xl overflow-hidden border border-[#d4decb] shadow-subtle bg-[#e5ebdf] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl' : 'h-[600px]'
      }`}
    >
      
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 max-w-[calc(100%-80px)]">
        <div className="bg-[#141d18]/90 backdrop-blur-md text-ivory-50 px-3 py-1.5 rounded-lg border border-[#25362b] text-xs font-mono flex items-center space-x-2 shadow-panel">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">GEOSPATIAL AIRSHED</span>
          <span className="text-graphite-400">|</span>
          <span className="text-graphite-300">Indo-Gangetic Basin</span>
        </div>

        <button
          onClick={resetView}
          className="bg-[#141d18]/90 hover:bg-[#1f2d25] text-ivory-100 px-2.5 py-1.5 rounded-lg border border-[#25362b] text-xs shadow-panel transition-colors flex items-center space-x-1.5"
          title="Reset View to North India"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] hidden sm:inline">Reset Extent</span>
        </button>

        <button
          onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
          className="bg-[#141d18]/90 hover:bg-[#1f2d25] text-ivory-100 px-2.5 py-1.5 rounded-lg border border-[#25362b] text-xs shadow-panel transition-colors flex items-center space-x-1.5"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">
            {isLayerControlOpen ? 'Hide Layers' : 'Show Layers'}
          </span>
        </button>

        {/* Basemap Switcher Dropdown */}
        <div className="bg-[#141d18]/90 text-ivory-100 px-2 py-1 rounded-lg border border-[#25362b] text-xs shadow-panel flex items-center space-x-1.5 font-mono">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <select 
            value={basemap}
            onChange={(e) => setBasemap(e.target.value as BasemapStyle)}
            aria-label="Basemap style selection"
            className="bg-transparent text-ivory-100 text-[11px] outline-none cursor-pointer pr-1"
          >
            <option value="voyager" className="bg-[#141d18] text-ivory-100">Clean Light</option>
            <option value="satellite" className="bg-[#141d18] text-ivory-100">Satellite View</option>
            <option value="dark" className="bg-[#141d18] text-ivory-100">Dark Matter</option>
            <option value="osm" className="bg-[#141d18] text-ivory-100">OpenStreetMap</option>
          </select>
        </div>
      </div>

      {/* Top Right Zoom & Fullscreen Controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col space-y-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-8 h-8 bg-[#141d18]/90 hover:bg-[#1f2d25] text-ivory-100 rounded-lg border border-[#25362b] shadow-panel flex items-center justify-center transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-emerald-400" />
          ) : (
            <Maximize className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>

      {/* Floating Layer Control Panel */}
      {isLayerControlOpen && (
        <div className="absolute top-14 left-3 z-30 max-h-[480px] overflow-y-auto">
          <LayerControl
            layers={layers}
            setLayers={setLayers}
            overlayOpacity={overlayOpacity}
            setOverlayOpacity={setOverlayOpacity}
          />
        </div>
      )}

      {/* Main Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />

        {/* Dynamic Basemap Tile Layer */}
        <TileLayer
          key={basemap}
          attribution={getTileAttribution()}
          url={getTileUrl()}
          subdomains={basemap === 'satellite' ? [] : ['a', 'b', 'c', 'd']}
          maxZoom={19}
        />

        {/* Custom Zoom Buttons rendered within MapContext */}
        <div className="leaflet-top leaflet-right" style={{ marginTop: '50px', marginRight: '12px' }}>
          <div className="leaflet-control">
            <MapZoomController onZoomIn={() => {}} onZoomOut={() => {}} />
          </div>
        </div>

        {/* 1. LAYER: Predicted AQI Heat Surface Contours */}
        {layers.predictedAqi && (
          <>
            {/* Broad Indo-Gangetic Basin Smog Contour */}
            <Polygon
              positions={indoGangeticBeltCoords}
              pathOptions={{
                color: '#c2410c',
                weight: 1.5,
                fillColor: '#ea580c',
                fillOpacity: overlayOpacity * 0.35,
                dashArray: '4, 6',
              }}
            />

            {/* Hotspot Circles around Major Airsheds */}
            {regions.map((region) => {
              const theme = getAqiTheme(region.aqiCategory);
              return (
                <Circle
                  key={`aqi-hotspot-${region.id}`}
                  center={[region.lat, region.lng]}
                  radius={region.id === 'delhi-ncr' ? 55000 : 42000}
                  pathOptions={{
                    color: theme.hex,
                    weight: 2,
                    fillColor: theme.hex,
                    fillOpacity: overlayOpacity * 0.55,
                  }}
                  eventHandlers={{
                    click: () => {
                      onSelectRegion(region);
                      setMapCenter([region.lat, region.lng]);
                    },
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 font-sans">
                      <div className="font-bold text-sm text-ivory-50">{region.name}</div>
                      <div className="text-graphite-300 font-mono mt-0.5">AQI: <strong className="text-orange-400">{region.aqi} ({region.aqiCategory})</strong></div>
                      <div className="text-graphite-300 font-mono text-[11px]">NO₂: {region.no2} µg/m³</div>
                      <div className="text-graphite-300 font-mono text-[11px]">Fire Influence: {region.fireInfluence}</div>
                      <button
                        onClick={() => onSelectRegion(region)}
                        className="mt-2 w-full py-1 bg-forest-800 hover:bg-forest-700 text-ivory-50 rounded text-[11px] font-semibold"
                      >
                        Inspect Airshed
                      </button>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </>
        )}

        {/* 2. LAYER: TROPOMI NO2 Column Overlay */}
        {layers.tropomiNo2 && (
          <>
            {regions.map((reg) => (
              <Circle
                key={`tropomi-no2-${reg.id}`}
                center={[reg.lat, reg.lng]}
                radius={38000}
                pathOptions={{
                  color: '#b45309',
                  weight: 1.5,
                  fillColor: '#f59e0b',
                  fillOpacity: overlayOpacity * 0.5,
                  dashArray: '2, 4',
                }}
              />
            ))}
          </>
        )}

        {/* 3. LAYER: TROPOMI HCHO Column Overlay */}
        {layers.tropomiHcho && (
          <>
            {regions.map((reg) => (
              <Circle
                key={`tropomi-hcho-${reg.id}`}
                center={[reg.lat, reg.lng]}
                radius={48000}
                pathOptions={{
                  color: '#7e22ce',
                  weight: 1.5,
                  fillColor: '#a855f7',
                  fillOpacity: overlayOpacity * 0.45,
                  dashArray: '3, 5',
                }}
              />
            ))}
          </>
        )}

        {/* 4. LAYER: MODIS Active Fire Hotspots */}
        {layers.modisFire && (
          <>
            {fireHotspots.map((hotspot) => (
              <Marker
                key={hotspot.id}
                position={[hotspot.lat, hotspot.lng]}
                icon={createFireIcon()}
              >
                <Popup>
                  <div className="text-xs p-1 font-mono">
                    <div className="font-bold text-orange-400 flex items-center space-x-1">
                      <span>🔥 {hotspot.district}</span>
                    </div>
                    <div className="text-graphite-300 text-[11px] mt-1">{hotspot.state}</div>
                    <div className="text-graphite-200 mt-1">FRP: <strong className="text-rust-400">{hotspot.frp} MW</strong></div>
                    <div className="text-graphite-300 text-[10px]">Brightness: {hotspot.brightness} K</div>
                    <div className="text-graphite-400 text-[10px]">{hotspot.satellite} • {hotspot.timestamp}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {/* 5. LAYER: Wind Vectors / Advection Plumes */}
        {layers.windVectors && (
          <>
            {windStreamlines.map((coords, idx) => (
              <Polyline
                key={`wind-line-${idx}`}
                positions={coords}
                pathOptions={{
                  color: '#0d9488',
                  weight: 2.5,
                  opacity: 0.8,
                  dashArray: '8, 8',
                }}
              />
            ))}
          </>
        )}

        {/* 6. LAYER: Ground CAAQMS Stations */}
        {layers.groundStations && (
          <>
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createStationIcon(station)}
                eventHandlers={{
                  click: () => {
                    if (onSelectStation) onSelectStation(station);
                  },
                }}
              >
                <Popup>
                  <div className="text-xs p-1 font-sans">
                    <div className="font-bold text-sm text-ivory-50">{station.name}</div>
                    <div className="text-graphite-300 font-mono text-[11px]">{station.city}, {station.state}</div>
                    <div className="mt-1.5 flex items-center justify-between font-mono">
                      <span className="text-graphite-300">Surface AQI:</span>
                      <strong className="text-orange-400">{station.aqi}</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-graphite-400">NO₂:</span>
                      <span className="text-ivory-100">{station.no2} µg/m³</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-graphite-400">Model Predicted:</span>
                      <span className="text-emerald-400">{station.predictedAqi} (Δ {station.modelDelta})</span>
                    </div>
                    <div className="text-[10px] text-graphite-400 mt-1 font-mono">
                      Telemetry sync: {station.lastPing}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

      </MapContainer>

      {/* Coordinate & Resolution Legend Tag */}
      <div className="absolute bottom-2 right-2 z-20 bg-[#141d18]/90 text-ivory-200 px-3 py-1 rounded-md border border-[#25362b] text-[10px] font-mono shadow-subtle flex items-center space-x-2">
        <span className="text-emerald-400 font-semibold">TROPOMI 5.5×3.5 km</span>
        <span className="text-graphite-500">|</span>
        <span className="text-graphite-300">WGS84 EPSG:4326</span>
      </div>

    </div>
  );
};

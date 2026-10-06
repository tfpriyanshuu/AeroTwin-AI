import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Loader2, 
  X, 
  Sparkles, 
  Globe, 
  Check,
  ChevronRight
} from 'lucide-react';
import { LocationSearchResult, ActiveLocation } from '../types';
import { realtimeAqiService, POPULAR_LOCATIONS } from '../services/realtimeAqiService';

interface LocationSearchProps {
  currentLocation: ActiveLocation;
  onSelectLocation: (loc: LocationSearchResult) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentLocation,
  onSelectLocation,
  isLoading = false,
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search handler
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setIsOpen(true);
    setGeoError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setResults(POPULAR_LOCATIONS.slice(0, 8));
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await realtimeAqiService.searchLocations(val);
        setResults(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  const handleSelect = (item: LocationSearchResult) => {
    onSelectLocation(item);
    setQuery('');
    setIsOpen(false);
  };

  // Browser GPS Geolocation Handler
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('GPS Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locResult = await realtimeAqiService.reverseGeocode(latitude, longitude);
          onSelectLocation(locResult);
          setIsOpen(false);
        } catch (err) {
          onSelectLocation({
            id: `gps_${latitude}_${longitude}`,
            name: `My Live Location`,
            admin1: 'GPS Coordinates',
            country: '',
            latitude,
            longitude,
          });
          setIsOpen(false);
        } finally {
          setIsLocatingUser(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocatingUser(false);
        setGeoError('Could not access device location. Please search manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-graphite-400 pointer-events-none flex items-center">
          {isSearching || isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <Search className="w-4 h-4 text-emerald-400/80" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => {
            setIsOpen(true);
            if (!query.trim()) setResults(POPULAR_LOCATIONS.slice(0, 8));
          }}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search any city or address for real-time AQI..."
          className={`w-full bg-[#0d1510] border border-[#24372c] hover:border-[#385544] focus:border-emerald-500 text-ivory-50 placeholder-graphite-400 text-xs sm:text-sm rounded-xl pl-9 pr-24 py-2.5 transition-all outline-none shadow-inner font-sans ${
            compact ? 'py-1.5 text-xs' : ''
          }`}
        />

        {/* Right Action buttons (Clear & GPS Locate) */}
        <div className="absolute right-2 flex items-center space-x-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults(POPULAR_LOCATIONS.slice(0, 8));
              }}
              className="p-1 rounded-md text-graphite-400 hover:text-ivory-100 hover:bg-[#1a2820]"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDetectCurrentLocation}
            disabled={isLocatingUser}
            className="flex items-center space-x-1 px-2 py-1 bg-[#1a2820] hover:bg-[#23382c] text-emerald-300 hover:text-emerald-200 border border-[#2d4738] rounded-lg text-[11px] font-mono transition-colors disabled:opacity-50"
            title="Use Device GPS Location"
          >
            {isLocatingUser ? (
              <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-3 h-3 text-emerald-400" />
            )}
            <span className="hidden md:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#121c16]/98 backdrop-blur-xl border border-[#2b3f33] rounded-xl shadow-elevation z-50 overflow-hidden text-ivory-100 animate-fadeIn">
          
          {/* Quick GPS Geolocation Button */}
          <div className="p-2 border-b border-[#213227] bg-[#16231b]/60">
            <button
              onClick={handleDetectCurrentLocation}
              disabled={isLocatingUser}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-forest-950/60 hover:bg-forest-900/80 border border-emerald-800/40 text-emerald-300 text-xs font-mono transition-colors text-left"
            >
              <div className="flex items-center space-x-2">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Use My Current Location</span>
              </div>
              <span className="text-[10px] text-emerald-400/70">Device GPS</span>
            </button>
            {geoError && (
              <p className="text-[10px] text-amber-300 font-mono mt-1 px-1">{geoError}</p>
            )}
          </div>

          {/* Location Suggestions List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-[#1e2d23] py-1">
            <div className="px-3 py-1.5 text-[10px] font-mono text-graphite-400 uppercase tracking-wider flex items-center justify-between">
              <span>{query.trim().length >= 2 ? 'Search Results' : 'Popular Indian Airsheds'}</span>
              <span className="text-emerald-400">Open-Meteo Global</span>
            </div>

            {results.length > 0 ? (
              results.map((loc) => {
                const isCurrent = 
                  Math.abs(loc.latitude - currentLocation.lat) < 0.05 && 
                  Math.abs(loc.longitude - currentLocation.lng) < 0.05;

                return (
                  <button
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    onClick={() => handleSelect(loc)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#1a2920] transition-colors text-left group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#19271f] border border-[#273d2f] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ivory-50 flex items-center space-x-1.5">
                          <span>{loc.name}</span>
                          {loc.admin1 && (
                            <span className="text-graphite-400 font-normal">, {loc.admin1}</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-graphite-400">
                          {loc.country} • {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-graphite-500 group-hover:text-emerald-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-graphite-400 font-mono">
                No matching locations found. Try entering another city name.
              </div>
            )}
          </div>

          {/* Quick Preset City Chips */}
          <div className="p-2.5 bg-[#0e1612] border-t border-[#213227]">
            <div className="text-[10px] font-mono text-graphite-400 mb-1.5">Quick Presets:</div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LOCATIONS.slice(0, 7).map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleSelect(chip)}
                  className="px-2 py-0.5 rounded-md bg-[#19261e] hover:bg-[#24372c] text-ivory-200 hover:text-emerald-300 border border-[#2a3f32] text-[11px] font-mono transition-colors"
                >
                  {chip.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

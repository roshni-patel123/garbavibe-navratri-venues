import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { VenueEvent } from '../types/garba';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import {
  Navigation,
  MapPin,
  Car,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Clock,
  Compass,
} from 'lucide-react';

interface InteractiveMapProps {
  venues: VenueEvent[];
  selectedVenue: VenueEvent | null;
  onSelectVenue: (venue: VenueEvent) => void;
  activeCityFilter: string;
  onOpenBookingModal: (venue: VenueEvent) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  activeCityFilter,
  onOpenBookingModal,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeLotFilter, setActiveLotFilter] = useState<'all' | 'free' | 'valet' | 'shuttle'>('all');
  const [activeMarkerVenue, setActiveMarkerVenue] = useState<VenueEvent | null>(
    selectedVenue || venues[0] || null,
  );
  const markersRef = useRef<google.maps.Marker[]>([]);

  // City center lookup
  const getCityCenter = (city: string) => {
    switch (city) {
      case 'Ahmedabad':
        return { lat: 23.05, lng: 72.52 };
      case 'Vadodara':
        return { lat: 22.29, lng: 73.16 };
      case 'Surat':
        return { lat: 21.15, lng: 72.77 };
      case 'Mumbai':
        return { lat: 18.99, lng: 72.82 };
      default:
        return { lat: 23.05, lng: 72.52 }; // Default Ahmedabad
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly',
    });

    importLibrary('maps')
      .then(() => {
        const initialCenter = selectedVenue
          ? selectedVenue.coordinates
          : getCityCenter(activeCityFilter);

        // Dark festival styled map JSON matching the Figma #141125 background
        const nightFestivalMapStyles: google.maps.MapTypeStyle[] = [
          { elementType: 'geometry', stylers: [{ color: '#141125' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#141125' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#a08e7a' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffc174' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#54ddfc' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#1c192d' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#2b273d' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#353248' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#3a364d' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#f59e0b' }, { weight: 0.8 }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#201d32' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e0b1f' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#54ddfc' }],
          },
        ];

        const map = new google.maps.Map(mapRef.current!, {
          center: initialCenter,
          zoom: selectedVenue ? 14 : 12,
          styles: nightFestivalMapStyles,
          disableDefaultUI: true,
          zoomControl: true,
        });

        setMapInstance(map);
      })
      .catch((err) => {
        console.warn('Google Maps API load warning:', err);
        setMapError('Interactive map preview active (fallback live SVG map loaded)');
      });
  }, [activeCityFilter]);

  // Update map pins whenever venues, filter, or selectedVenue changes
  useEffect(() => {
    if (!mapInstance || !window.google) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    venues.forEach((venue) => {
      // 1. Festive Venue Pin (🎪)
      const venueMarker = new google.maps.Marker({
        position: venue.coordinates,
        map: mapInstance,
        title: venue.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#cc003c',
          fillOpacity: 0.95,
          strokeWeight: 2,
          strokeColor: '#ffdada',
        },
        label: {
          text: '🎪',
          fontSize: '12px',
        },
      });

      venueMarker.addListener('click', () => {
        setActiveMarkerVenue(venue);
        onSelectVenue(venue);
      });

      markersRef.current.push(venueMarker);
      bounds.extend(venue.coordinates);

      // 2. Parking Pin (🅿️)
      const parkingMarker = new google.maps.Marker({
        position: venue.parkingCoordinates,
        map: mapInstance,
        title: `${venue.name} Parking Ground`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: '#29c1df',
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#acedff',
        },
        label: {
          text: 'P',
          color: '#001f26',
          fontWeight: 'bold',
          fontSize: '11px',
        },
      });

      parkingMarker.addListener('click', () => {
        setActiveMarkerVenue(venue);
        onSelectVenue(venue);
      });

      markersRef.current.push(parkingMarker);
      bounds.extend(venue.parkingCoordinates);
    });

    if (selectedVenue) {
      mapInstance.panTo(selectedVenue.coordinates);
      mapInstance.setZoom(15);
      setActiveMarkerVenue(selectedVenue);
    } else if (venues.length > 0 && !bounds.isEmpty()) {
      mapInstance.fitBounds(bounds, 50);
    }
  }, [mapInstance, venues, selectedVenue]);

  const activeVenue = activeMarkerVenue || selectedVenue || venues[0];

  return (
    <div className="relative w-full h-[640px] sm:h-[720px] lg:h-[780px] bg-[#0e0b1f] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {/* Actual Google Map Canvas */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Fallback Overlay if Maps API network/key restriction occurs */}
      {mapError && (
        <div className="absolute inset-0 bg-[#0e0b1f]/90 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174] mb-3">
            <Compass className="w-8 h-8 animate-spin" />
          </div>
          <h4 className="text-lg font-bold text-[#e5dffb]">Festival GPS Navigator</h4>
          <p className="text-xs text-[#a08e7a] max-w-sm mt-1">
            Official Navratri route mapping with real-time SG Highway &amp; Dumas Road live traffic feeds.
          </p>
        </div>
      )}

      {/* Decorative Vector Route / Traffic Aura (SVG Layer matching Figma overlay) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        preserveAspectRatio="none"
        viewBox="0 0 1000 800"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0%" x2="100%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#54ddfc" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ffc174" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cc003c" stopOpacity="0.9" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 180,680 C 260,540 320,410 440,320 S 680,260 760,180"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="4"
          strokeDasharray="8 6"
          strokeLinecap="round"
          filter="url(#neonGlow)"
          className="animate-pulse"
        />
        <path
          d="M 440,320 C 490,390 560,450 630,490"
          fill="none"
          stroke="#ffb3b6"
          strokeWidth="3"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Top Filter Bar Over Map */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#201d32]/90 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-white/5">
          <span className="text-[11px] font-semibold text-[#a08e7a] px-2 uppercase tracking-wider">
            Filter Lots:
          </span>
          <button
            type="button"
            onClick={() => setActiveLotFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeLotFilter === 'all'
                ? 'bg-[#f59e0b] text-[#472a00] font-bold shadow-md'
                : 'bg-[#2b273d] text-[#e5dffb] hover:bg-[#353248]'
            }`}
          >
            All Lots ({venues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveLotFilter('free')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeLotFilter === 'free'
                ? 'bg-[#29c1df] text-[#001f26] font-bold shadow-md'
                : 'bg-[#2b273d] text-[#e5dffb] hover:bg-[#353248]'
            }`}
          >
            Free Parking
          </button>
          <button
            type="button"
            onClick={() => setActiveLotFilter('valet')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeLotFilter === 'valet'
                ? 'bg-[#f59e0b] text-[#472a00] font-bold shadow-md'
                : 'bg-[#2b273d] text-[#e5dffb] hover:bg-[#353248]'
            }`}
          >
            Valet Only
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#1c192d]/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/5">
          <span className="w-2 h-2 rounded-full bg-[#54ddfc] animate-ping" />
          <span className="text-xs text-[#e5dffb] font-medium">Traffic Sensor: Live</span>
        </div>
      </div>

      {/* Floating Active Venue & Parking InfoWindow Card (Overlay Bottom Right/Left) */}
      {activeVenue && (
        <div className="absolute top-16 right-4 sm:right-6 z-20 max-w-sm w-full bg-[#201d32]/95 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#54ddfc] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54ddfc]" />
                {activeVenue.city} &bull; {activeVenue.area}
              </span>
              <h4 className="text-base font-bold text-[#e5dffb] mt-0.5">
                {activeVenue.name}
              </h4>
              <p className="text-[11px] text-[#a08e7a] line-clamp-1">{activeVenue.fullAddress}</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#cc003c]/20 text-[#ffb3b6] shrink-0">
              {activeVenue.parking.availableSlots} slots left
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 py-2 border-y border-white/5">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#ffc174]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a]">Parking Ground</span>
                <span className="text-xs font-bold text-[#e5dffb]">
                  {activeVenue.parking.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#54ddfc]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a]">Walking to Gate</span>
                <span className="text-xs font-bold text-[#54ddfc]">
                  {activeVenue.parking.walkingDistance}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real Canonical Google Maps Navigation URL */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeVenue.coordinates.lat},${activeVenue.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] text-xs font-bold py-2 rounded-xl shadow-md transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate (Google Maps)</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenBookingModal(activeVenue)}
              className="px-3 py-2 bg-[#2b273d] hover:bg-[#353248] text-[#e5dffb] text-xs font-bold rounded-xl transition-all border border-white/5"
            >
              Book Pass
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Panel (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0e0b1f]/90 backdrop-blur-lg p-3 rounded-xl shadow-2xl max-w-xs border border-white/5">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/5">
          <span className="text-[11px] font-bold text-[#ffc174] uppercase tracking-wider">
            Live Parking Map Key
          </span>
          <span className="text-[10px] text-[#a08e7a]">Gujarat Traffic Pol.</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#54ddfc] shadow-[0_0_6px_#54ddfc]" />
            <span className="text-[#e5dffb] text-[11px]">Available (&gt;200)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
            <span className="text-[#e5dffb] text-[11px]">Filling Fast (&lt;50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc003c] shadow-[0_0_6px_#cc003c]" />
            <span className="text-[#e5dffb] text-[11px]">Full (Diverting)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb3b6] shadow-[0_0_6px_#ffb3b6]" />
            <span className="text-[#e5dffb] text-[11px]">Garba Grounds 🎪</span>
          </div>
        </div>
      </div>
    </div>
  );
};

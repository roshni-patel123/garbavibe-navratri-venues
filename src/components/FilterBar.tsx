import React from 'react';
import {
  MapPin,
  Sparkles,
  Music,
  Tent,
  Car,
  Zap,
  Users,
  Flame,
} from 'lucide-react';

interface FilterProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedAuspiciousDay: number | 'all';
  onSelectAuspiciousDay: (day: number | 'all') => void;
  selectedMusicStyle: string;
  onSelectMusicStyle: (style: string) => void;
  selectedVenueType: string;
  onSelectVenueType: (type: string) => void;
  quickFilters: {
    freeParking: boolean;
    valetAvailable: boolean;
    adityaGadhvi: boolean;
    kinjalDave: boolean;
    couplePass: boolean;
    sellingFast: boolean;
  };
  onToggleQuickFilter: (key: string) => void;
}

export const FilterBar: React.FC<FilterProps> = ({
  selectedCity,
  onSelectCity,
  selectedAuspiciousDay,
  onSelectAuspiciousDay,
  selectedMusicStyle,
  onSelectMusicStyle,
  selectedVenueType,
  onSelectVenueType,
  quickFilters,
  onToggleQuickFilter,
}) => {
  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-4 md:px-6 -mt-4 z-20">
      <div className="bg-[#201d32]/90 backdrop-blur-2xl rounded-2xl p-4 lg:p-6 shadow-2xl border border-white/5">
        {/* Top Level Multi-Attribute Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
          {/* City / Hub Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#a08e7a] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
              City or Key Area
            </label>
            <div className="relative bg-[#2b273d] rounded-xl px-3.5 py-2 flex items-center justify-between border border-transparent hover:border-[#ffc174]/30 transition-all">
              <select
                aria-label="City or Key Area"
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="w-full bg-transparent text-sm text-[#e5dffb] font-medium outline-none cursor-pointer appearance-none pr-6 truncate"
              >
                <option value="All" className="bg-[#201d32] text-[#e5dffb]">
                  All Cities (Gujarat &amp; Mumbai)
                </option>
                <option value="Ahmedabad" className="bg-[#201d32] text-[#e5dffb]">
                  Ahmedabad (SG Highway, SBR, Bopal)
                </option>
                <option value="Vadodara" className="bg-[#201d32] text-[#e5dffb]">
                  Vadodara (Atladra, Alkapuri)
                </option>
                <option value="Surat" className="bg-[#201d32] text-[#e5dffb]">
                  Surat (Dumas Rd, Althan Canal)
                </option>
                <option value="Mumbai" className="bg-[#201d32] text-[#e5dffb]">
                  Mumbai (Worli Dome, Borivali)
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#a08e7a] text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Date & Night Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#a08e7a] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#54ddfc]" />
              Auspicious Night
            </label>
            <div className="relative bg-[#2b273d] rounded-xl px-3.5 py-2 flex items-center justify-between border border-transparent hover:border-[#54ddfc]/30 transition-all">
              <select
                aria-label="Auspicious Night"
                value={selectedAuspiciousDay}
                onChange={(e) =>
                  onSelectAuspiciousDay(
                    e.target.value === 'all' ? 'all' : Number(e.target.value),
                  )
                }
                className="w-full bg-transparent text-sm text-[#e5dffb] font-medium outline-none cursor-pointer appearance-none pr-6 truncate"
              >
                <option value="all" className="bg-[#201d32] text-[#e5dffb]">
                  All 9 Auspicious Nights (Pratipada to Navami)
                </option>
                <option value="1" className="bg-[#201d32] text-[#e5dffb]">
                  Night 1 (Ghatasthapana / Pratipada)
                </option>
                <option value="2" className="bg-[#201d32] text-[#e5dffb]">
                  Night 2 (Dwitiya)
                </option>
                <option value="3" className="bg-[#201d32] text-[#e5dffb]">
                  Night 3 (Tritiya)
                </option>
                <option value="4" className="bg-[#201d32] text-[#e5dffb]">
                  Night 4 (Chaturthi)
                </option>
                <option value="5" className="bg-[#201d32] text-[#e5dffb]">
                  Night 5 (Panchami)
                </option>
                <option value="6" className="bg-[#201d32] text-[#e5dffb]">
                  Night 6 (Shashti)
                </option>
                <option value="7" className="bg-[#201d32] text-[#e5dffb]">
                  Night 7 (Maha Saptami)
                </option>
                <option value="8" className="bg-[#201d32] text-[#e5dffb]">
                  Night 8 (Maha Ashtami)
                </option>
                <option value="9" className="bg-[#201d32] text-[#e5dffb]">
                  Night 9 (Maha Navami Grand Finale)
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#a08e7a] text-[18px]">
                tune
              </span>
            </div>
          </div>

          {/* Music & Dancing Vibe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#a08e7a] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#ffb3b6]" />
              Music Style
            </label>
            <div className="relative bg-[#2b273d] rounded-xl px-3.5 py-2 flex items-center justify-between border border-transparent hover:border-[#ffb3b6]/30 transition-all">
              <select
                aria-label="Music Style"
                value={selectedMusicStyle}
                onChange={(e) => onSelectMusicStyle(e.target.value)}
                className="w-full bg-transparent text-sm text-[#e5dffb] font-medium outline-none cursor-pointer appearance-none pr-6 truncate"
              >
                <option value="All" className="bg-[#201d32] text-[#e5dffb]">
                  All Garba Rhythms &amp; Beats
                </option>
                <option
                  value="Traditional Raas"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  Traditional Authentic Raas (Sheri / Folk)
                </option>
                <option
                  value="Disco Dandiya"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  Disco Dandiya Pop &amp; Bollywood Fusion
                </option>
                <option
                  value="Dhol Tasha Fusion"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  High-BPM Live Dhol Tasha
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#a08e7a] text-[18px]">
                graphic_eq
              </span>
            </div>
          </div>

          {/* Venue Layout & Atmosphere */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#a08e7a] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Tent className="w-3.5 h-3.5 text-[#ffc174]" />
              Venue Experience
            </label>
            <div className="relative bg-[#2b273d] rounded-xl px-3.5 py-2 flex items-center justify-between border border-transparent hover:border-[#ffc174]/30 transition-all">
              <select
                aria-label="Venue Experience"
                value={selectedVenueType}
                onChange={(e) => onSelectVenueType(e.target.value)}
                className="w-full bg-transparent text-sm text-[#e5dffb] font-medium outline-none cursor-pointer appearance-none pr-6 truncate"
              >
                <option value="All" className="bg-[#201d32] text-[#e5dffb]">
                  Any Experience (Open Lawn, AC Dome, Club)
                </option>
                <option
                  value="Open Lawn"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  Open Natural Grass Lawn &amp; Turf
                </option>
                <option value="AC Dome" className="bg-[#201d32] text-[#e5dffb]">
                  100% Air-Conditioned Indoor Dome
                </option>
                <option
                  value="Heritage Club"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  Exclusive Heritage Club Ground
                </option>
                <option
                  value="Sheri Garba"
                  className="bg-[#201d32] text-[#e5dffb]"
                >
                  Authentic Sheri / Expo Ground
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#a08e7a] text-[18px]">
                stadium
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filter Micro-Chips */}
        <div className="flex items-center gap-2 mt-4 pt-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-[#a08e7a] uppercase whitespace-nowrap mr-1 tracking-wider">
            Quick Filters:
          </span>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('freeParking')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.freeParking
                ? 'bg-[#29c1df]/25 text-[#54ddfc] border-[#54ddfc] shadow-[0_0_12px_rgba(84,221,252,0.3)]'
                : 'bg-[#2b273d] text-[#e5dffb] border-white/5 hover:border-white/20'
            }`}
          >
            <span>🅿️ Free Parking Guaranteed</span>
            <span className="bg-[#54ddfc]/20 text-[#54ddfc] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              18
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('valetAvailable')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.valetAvailable
                ? 'bg-[#f59e0b]/25 text-[#ffc174] border-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#2b273d] text-[#e5dffb] border-white/5 hover:border-white/20'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#ffc174]" />
            <span>Valet Available</span>
            <span className="bg-[#ffc174]/20 text-[#ffc174] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              12
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('adityaGadhvi')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.adityaGadhvi
                ? 'bg-[#f59e0b]/30 text-[#ffddb8] border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-[#2b273d] text-[#e5dffb] border-white/5 hover:border-white/20'
            }`}
          >
            <span>🎤 Aditya Gadhvi Tonight</span>
            <span className="bg-[#ffc174]/20 text-[#ffddb8] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('kinjalDave')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.kinjalDave
                ? 'bg-[#cc003c]/30 text-[#ffb3b6] border-[#cc003c] shadow-[0_0_12px_rgba(204,0,60,0.4)]'
                : 'bg-[#2b273d] text-[#e5dffb] border-white/5 hover:border-white/20'
            }`}
          >
            <span>💃 Kinjal Dave Lineup</span>
            <span className="bg-[#cc003c]/20 text-[#ffb3b6] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              5
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('couplePass')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.couplePass
                ? 'bg-[#54ddfc]/25 text-[#54ddfc] border-[#54ddfc]'
                : 'bg-[#2b273d] text-[#e5dffb] border-white/5 hover:border-white/20'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#54ddfc]" />
            <span>Couple Pass Available</span>
            <span className="bg-[#54ddfc]/20 text-[#54ddfc] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              29
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleQuickFilter('sellingFast')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              quickFilters.sellingFast
                ? 'bg-[#cc003c] text-white border-transparent shadow-[0_0_14px_rgba(204,0,60,0.5)]'
                : 'bg-[#cc003c]/20 text-[#ffb3b6] border-[#cc003c]/30 hover:bg-[#cc003c]/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-white" />
            <span>Selling Out Fast</span>
            <span className="bg-black/30 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              9
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

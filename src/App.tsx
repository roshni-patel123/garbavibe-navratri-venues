import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Heart,
  Calendar,
  Sparkles,
  Car,
  Music,
  ShieldCheck,
  Send,
  Navigation,
  RefreshCw,
  Flame,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { VENUES_DATA, ARTISTS_DATA, SCHEDULE_DATA } from './data/garbaData';
import { VenueEvent, ArtistProfile } from './types/garba';
import { FilterBar } from './components/FilterBar';
import { VenueCard } from './components/VenueCard';
import { InteractiveMap } from './components/InteractiveMap';
import { FeaturedArtistsSection } from './components/FeaturedArtistsSection';
import { BookingModal } from './components/BookingModal';
import { GroundScheduleMatrix } from './components/GroundScheduleMatrix';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'singers' | 'schedule'>('explore');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedAuspiciousDay, setSelectedAuspiciousDay] = useState<number | 'all'>('all');
  const [selectedMusicStyle, setSelectedMusicStyle] = useState<string>('All');
  const [selectedVenueType, setSelectedVenueType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'parking' | 'distance' | 'price'>('trending');
  
  // Quick Filters state
  const [quickFilters, setQuickFilters] = useState({
    freeParking: false,
    valetAvailable: false,
    adityaGadhvi: false,
    kinjalDave: false,
    couplePass: false,
    sellingFast: false,
  });

  // Selected venue for modal or map navigation
  const [selectedVenueForMap, setSelectedVenueForMap] = useState<VenueEvent | null>(VENUES_DATA[0]);
  const [bookingVenue, setBookingVenue] = useState<VenueEvent | null>(null);
  const [highlightedArtist, setHighlightedArtist] = useState<string | null>(null);
  const [selectedDayScheduleTab, setSelectedDayScheduleTab] = useState<number | 'all'>('all');

  // Newsletter email state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Toggle quick filter
  const handleToggleQuickFilter = (key: string) => {
    setQuickFilters((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  // Filter venues
  const filteredVenues = VENUES_DATA.filter((v) => {
    // City match
    if (selectedCity !== 'All' && v.city !== selectedCity) return false;

    // Auspicious Day match
    if (
      selectedAuspiciousDay !== 'all' &&
      !v.auspiciousDays.includes(selectedAuspiciousDay)
    ) {
      return false;
    }

    // Music style match
    if (selectedMusicStyle !== 'All' && v.musicStyle !== selectedMusicStyle) {
      return false;
    }

    // Venue Experience match
    if (selectedVenueType !== 'All' && v.venueExperience !== selectedVenueType) {
      return false;
    }

    // Quick filters
    if (quickFilters.freeParking && v.parking.priceType !== 'FREE') return false;
    if (quickFilters.valetAvailable && !v.parking.valetAvailable) return false;
    if (
      quickFilters.adityaGadhvi &&
      !v.headliner.name.toLowerCase().includes('aditya')
    ) {
      return false;
    }
    if (
      quickFilters.kinjalDave &&
      !v.headliner.name.toLowerCase().includes('kinjal')
    ) {
      return false;
    }
    if (quickFilters.couplePass && !v.tickets.couplePrice) return false;
    if (quickFilters.sellingFast && !v.tickets.fastFilling) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'parking') {
      return b.parking.availableSlots - a.parking.availableSlots;
    }
    if (sortBy === 'price') {
      const priceA = a.tickets.regularPrice || a.tickets.femalePrice || 0;
      const priceB = b.tickets.regularPrice || b.tickets.femalePrice || 0;
      return priceA - priceB;
    }
    if (sortBy === 'distance') {
      return a.name.localeCompare(b.name);
    }
    return b.reviewsCount - a.reviewsCount; // Trending
  });

  const handleSelectVenueForMap = (venue: VenueEvent) => {
    setSelectedVenueForMap(venue);
    setActiveTab('map');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleArtistNavigateToSchedule = (artistName: string) => {
    setHighlightedArtist(artistName);
    setActiveTab('schedule');
    const scheduleEl = document.getElementById('pass-guide');
    if (scheduleEl) {
      scheduleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-[#141125] text-[#e5dffb] min-h-screen relative font-sans selection:bg-[#f59e0b] selection:text-[#141125]">
      {/* Ambient Festive Glow Elements in Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#cc003c]/15 blur-[120px]"></div>
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[#29c1df]/15 blur-[120px]"></div>
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-[#f59e0b]/10 blur-[140px]"></div>
      </div>

      {/* Global Header matching Figma layout */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0b1f]/85 backdrop-blur-2xl shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6)] border-b border-white/5">
        <div className="h-20 w-full px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 group text-left"
            >
              {/* Dandiya Sticks Festive Icon */}
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#f59e0b] flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <div className="w-full h-full relative flex items-center justify-center">
                  <span className="w-1.5 h-6 bg-[#cc003c] rounded-full rotate-45 absolute" />
                  <span className="w-1.5 h-6 bg-[#29c1df] rounded-full -rotate-45 absolute" />
                  <span className="w-2 h-2 rounded-full bg-[#ffc174] z-10 shadow" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#ffc174] leading-none group-hover:text-[#ffddb8] transition-colors">
                  GarbaVibe
                </span>
                <span className="text-[10px] font-bold text-[#54ddfc] tracking-wider uppercase leading-none mt-1">
                  Navratri 2026
                </span>
              </div>
            </button>

            {/* Quick City Dropdown Pill */}
            <div className="relative hidden xl:block">
              <div className="flex items-center gap-1.5 bg-[#2b273d]/80 rounded-full px-3.5 py-1.5 hover:bg-[#353248] transition-colors border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
                <select
                  aria-label="City Selector"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#e5dffb] outline-none cursor-pointer appearance-none pr-4"
                >
                  <option value="All" className="bg-[#201d32]">All Regions</option>
                  <option value="Ahmedabad" className="bg-[#201d32]">Ahmedabad</option>
                  <option value="Vadodara" className="bg-[#201d32]">Vadodara</option>
                  <option value="Surat" className="bg-[#201d32]">Surat</option>
                  <option value="Mumbai" className="bg-[#201d32]">Mumbai</option>
                </select>
                <span className="material-symbols-outlined text-[#a08e7a] text-[16px] pointer-events-none -ml-3">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'explore'
                  ? 'bg-[#353248] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-[#d8c3ad] hover:text-[#e5dffb]'
              }`}
            >
              Explore Venues
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'map'
                  ? 'bg-[#353248] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-[#d8c3ad] hover:text-[#e5dffb]'
              }`}
            >
              Interactive Map &amp; Parking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('singers')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'singers'
                  ? 'bg-[#353248] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-[#d8c3ad] hover:text-[#e5dffb]'
              }`}
            >
              Singers &amp; Lineup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[#353248] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-[#d8c3ad] hover:text-[#e5dffb]'
              }`}
            >
              Pass Guide
            </button>
          </nav>

          {/* Right Action Icons & Organizer Portal */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#pass-guide"
              onClick={() => setActiveTab('schedule')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#201d32] border border-white/5 px-3.5 py-1.5 rounded-full hover:bg-[#353248] transition-all group"
            >
              <span className="h-2 w-2 rounded-full bg-[#cc003c] animate-pulse"></span>
              <span className="text-xs font-medium text-[#d8c3ad] group-hover:text-[#e5dffb]">
                Organizer Portal
              </span>
              <span className="bg-[#cc003c]/25 text-[#ffb3b6] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            </a>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('venue-search-input');
                  if (input) input.focus();
                }}
                className="p-2 rounded-full text-[#d8c3ad] hover:bg-[#2b273d] hover:text-[#e5dffb] transition-colors"
                title="Search Venues"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-2 rounded-full text-[#d8c3ad] hover:bg-[#2b273d] hover:text-[#ffb3b6] transition-colors relative"
                title="Saved Passes"
              >
                <Heart className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f59e0b]"></span>
              </button>

              {/* User Avatar */}
              <div className="ml-1 pl-1 flex items-center">
                <div className="w-8 h-8 rounded-full ring-2 ring-[#ffc174]/40 p-0.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="User profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 w-full pt-20">
        {/* HERO SECTION */}
        <section className="relative w-full pt-8 pb-12 overflow-hidden">
          <div className="relative w-full max-w-[1360px] mx-auto px-4 md:px-6">
            {/* Live Breadcrumb Aura */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2b273d]/90 text-[#ffc174] text-xs font-bold shadow-md border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#ffc174] animate-pulse"></span>
                OFFICIAL NAVRATRI 2026 DISCOVERY
              </span>
              <span className="hidden sm:inline text-[#a08e7a] text-xs">&bull;</span>
              <span className="hidden sm:inline text-xs font-medium text-[#d8c3ad]">
                Live Ground &amp; Pass Status Across Gujarat &amp; Mumbai
              </span>
            </div>

            {/* Main Headline */}
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#e5dffb] tracking-tight leading-[1.08] mb-3">
                Find Your Rhythm This{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc174] via-[#ffddb8] to-[#ffb3b6]">
                  Navratri 2026
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#d8c3ad] max-w-2xl leading-relaxed">
                Discover Gujarat &amp; Mumbai’s most electric Garba nights, verified parking spaces, singer line-ups, and instant official passes across all nine auspicious nights.
              </p>
            </div>

            {/* Quick Hero Visual Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-2 max-w-3xl">
              <div className="bg-[#1c192d]/70 backdrop-blur-md rounded-xl p-3 px-4 shadow-sm border border-white/5">
                <span className="text-[11px] text-[#a08e7a] uppercase tracking-wider block font-semibold">
                  Verified Venues
                </span>
                <span className="text-2xl font-extrabold text-[#ffc174]">
                  {VENUES_DATA.length * 8} Venues
                </span>
              </div>
              <div className="bg-[#1c192d]/70 backdrop-blur-md rounded-xl p-3 px-4 shadow-sm border border-white/5">
                <span className="text-[11px] text-[#a08e7a] uppercase tracking-wider block font-semibold">
                  Parking Capacity
                </span>
                <span className="text-2xl font-extrabold text-[#54ddfc]">
                  22,400+
                </span>
              </div>
              <div className="bg-[#1c192d]/70 backdrop-blur-md rounded-xl p-3 px-4 shadow-sm border border-white/5">
                <span className="text-[11px] text-[#a08e7a] uppercase tracking-wider block font-semibold">
                  Live Artists
                </span>
                <span className="text-2xl font-extrabold text-[#ffb3b6]">
                  140+ Stars
                </span>
              </div>
              <div className="bg-[#1c192d]/70 backdrop-blur-md rounded-xl p-3 px-4 shadow-sm border border-white/5">
                <span className="text-[11px] text-[#a08e7a] uppercase tracking-wider block font-semibold">
                  Official Partners
                </span>
                <span className="text-2xl font-extrabold text-[#e5dffb]">
                  100% QR Pass
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Discovery Filter Hub */}
        <FilterBar
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedAuspiciousDay={selectedAuspiciousDay}
          onSelectAuspiciousDay={setSelectedAuspiciousDay}
          selectedMusicStyle={selectedMusicStyle}
          onSelectMusicStyle={setSelectedMusicStyle}
          selectedVenueType={selectedVenueType}
          onSelectVenueType={setSelectedVenueType}
          quickFilters={quickFilters}
          onToggleQuickFilter={handleToggleQuickFilter}
        />

        {/* Dynamic Content Views */}
        {activeTab === 'explore' && (
          <>
            {/* Results Count & Sorting Header Row */}
            <section className="w-full max-w-[1360px] mx-auto px-4 md:px-6 mt-8 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c192d]/60 rounded-xl px-4 py-3 backdrop-blur-md border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]"></span>
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-bold text-[#e5dffb]">
                      {filteredVenues.length} Verified Garba Venues Found
                    </h2>
                    <span className="hidden md:inline text-xs text-[#a08e7a]">
                      in {selectedCity === 'All' ? 'Gujarat & Mumbai Metropolitan Area' : selectedCity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
                  <span className="text-[#a08e7a] mr-1 whitespace-nowrap font-medium">
                    Sort By:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSortBy('trending')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      sortBy === 'trending'
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'bg-[#2b273d] text-[#d8c3ad] hover:bg-[#353248]'
                    }`}
                  >
                    Trending First
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('parking')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      sortBy === 'parking'
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'bg-[#2b273d] text-[#d8c3ad] hover:bg-[#353248]'
                    }`}
                  >
                    🅿️ Parking Ease
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('distance')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      sortBy === 'distance'
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'bg-[#2b273d] text-[#d8c3ad] hover:bg-[#353248]'
                    }`}
                  >
                    Distance
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      sortBy === 'price'
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'bg-[#2b273d] text-[#d8c3ad] hover:bg-[#353248]'
                    }`}
                  >
                    Lowest Pass Price
                  </button>
                </div>
              </div>
            </section>

            {/* 3-Column Rich Venue Cards Grid */}
            <section className="w-full max-w-[1360px] mx-auto px-4 md:px-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onSelectForMap={handleSelectVenueForMap}
                    onOpenBookingModal={setBookingVenue}
                  />
                ))}
              </div>
            </section>

            {/* Live SG Highway & SBR Traffic Preview Banner */}
            <section className="w-full max-w-[1360px] mx-auto px-4 md:px-6 mb-12">
              <div className="relative bg-gradient-to-r from-[#1c192d] via-[#201d32] to-[#1c192d] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#54ddfc] animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#54ddfc]">
                        Live Traffic &amp; Gate Intelligence
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#e5dffb]">
                      Avoid SG Highway &amp; SBR Traffic Jams
                    </h3>
                    <p className="text-sm text-[#d8c3ad]">
                      Check live parking spot occupancy, nearest metro shuttle stops, and fast-track gate entries before stepping out in your traditional attire.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="bg-[#353248]/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5 border border-white/5">
                        <Car className="w-5 h-5 text-[#ffc174]" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#a08e7a]">SG Highway Corridors</span>
                          <span className="text-xs font-bold text-[#e5dffb]">68% Lots Occupied</span>
                        </div>
                      </div>
                      <div className="bg-[#353248]/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5 border border-white/5">
                        <Navigation className="w-5 h-5 text-[#ffb3b6]" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#a08e7a]">Metro Feeder Buses</span>
                          <span className="text-xs font-bold text-[#e5dffb]">Running Every 7 Mins</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('map')}
                      className="w-full bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Open Full Interactive Parking Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* MAP & PARKING VIEW */}
        {activeTab === 'map' && (
          <section className="w-full max-w-[1360px] mx-auto px-4 md:px-6 my-6">
            {/* Sub-header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] animate-ping"></span>
                <h2 className="text-xl font-bold text-[#e5dffb]">
                  Interactive Ground GPS &amp; Parking Radar
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1c192d] p-1 rounded-full border border-white/5">
                {['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedCity === city
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'text-[#d8c3ad] hover:text-[#e5dffb]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <InteractiveMap
              venues={filteredVenues}
              selectedVenue={selectedVenueForMap}
              onSelectVenue={setSelectedVenueForMap}
              activeCityFilter={selectedCity}
              onOpenBookingModal={setBookingVenue}
            />
          </section>
        )}

        {/* SINGERS & LINEUPS VIEW */}
        {activeTab === 'singers' && (
          <FeaturedArtistsSection
            artists={ARTISTS_DATA}
            onSelectArtist={(artist) => {}}
            onNavigateToSchedule={handleArtistNavigateToSchedule}
          />
        )}

        {/* PASS GUIDE & DAILY SCHEDULE VIEW */}
        {activeTab === 'schedule' && (
          <GroundScheduleMatrix
            scheduleRows={SCHEDULE_DATA}
            selectedDayTab={selectedDayScheduleTab}
            onSelectDayTab={setSelectedDayScheduleTab}
            highlightedArtist={highlightedArtist}
          />
        )}

        {/* Featured Artists section embedded also on Explore tab for rich browsing */}
        {activeTab === 'explore' && (
          <>
            <FeaturedArtistsSection
              artists={ARTISTS_DATA}
              onSelectArtist={(artist) => {}}
              onNavigateToSchedule={handleArtistNavigateToSchedule}
            />

            <GroundScheduleMatrix
              scheduleRows={SCHEDULE_DATA}
              selectedDayTab={selectedDayScheduleTab}
              onSelectDayTab={setSelectedDayScheduleTab}
              highlightedArtist={highlightedArtist}
            />
          </>
        )}

        {/* Sticky Real-Time Live Status Bar */}
        <aside className="sticky bottom-4 z-40 w-full max-w-[1360px] mx-auto px-4 md:px-6 pointer-events-none mt-8">
          <div className="pointer-events-auto bg-[#353248]/95 backdrop-blur-2xl rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cc003c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#cc003c]"></span>
              </span>
              <p className="text-xs md:text-sm text-[#e5dffb] truncate">
                <span className="font-bold text-[#ffc174]">Real-time Navratri Live Tracker:</span>
                <span className="text-[#54ddfc] font-semibold ml-1.5">12 Venues</span> with Free Parking nearby &bull;{' '}
                <span className="text-[#ffb3b6] font-semibold ml-1">4 Venues</span> with Fast-Filling Passes
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('All');
                  setSortBy('trending');
                }}
                className="bg-[#201d32] hover:bg-[#2b273d] text-[#e5dffb] text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hidden md:inline-flex items-center gap-1.5 border border-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#54ddfc]" />
                Refresh Status
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('map');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] text-xs font-bold px-4 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Find Available Near Me</span>
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Global Booking Modal */}
      <BookingModal
        venue={bookingVenue}
        onClose={() => setBookingVenue(null)}
      />

      {/* Global Festive Footer */}
      <footer className="relative z-10 w-full bg-[#0e0b1f]/95 backdrop-blur-xl mt-16 border-t border-white/5 shadow-[0_-12px_32px_-4px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-[1360px] mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Brand Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#ffc174]">GarbaVibe</span>
                <span className="bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2026 Live
                </span>
              </div>
              <p className="text-xs text-[#a08e7a] leading-relaxed">
                Gujarat and India's premier authentic Garba discoverability network. Connecting night raas dancers, venues, passes, and dhol lineups across all nine auspicious nights.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[#54ddfc] text-xs font-medium">
                <Calendar className="w-4 h-4" />
                <span>Navratri Begins: Oct 3, 2025 / Oct 12, 2026</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-[#e5dffb] uppercase tracking-wider">
                Quick Navigation
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-[#a08e7a] mt-1">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('Ahmedabad');
                      setActiveTab('explore');
                    }}
                    className="hover:text-[#ffc174] transition-colors"
                  >
                    Ahmedabad Premier Venues
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('Vadodara');
                      setActiveTab('explore');
                    }}
                    className="hover:text-[#ffc174] transition-colors"
                  >
                    Surat &amp; Vadodara Raas Grounds
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="hover:text-[#ffc174] transition-colors"
                  >
                    Valet &amp; Metro Parking Zones
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('schedule')}
                    className="hover:text-[#ffc174] transition-colors"
                  >
                    Traditional Dress Code Norms
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('singers')}
                    className="hover:text-[#ffc174] transition-colors"
                  >
                    Live Dhol Beat Announcements
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Ticketing Partners */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-[#e5dffb] uppercase tracking-wider">
                Official Ticketing Partners
              </h4>
              <p className="text-xs text-[#a08e7a]">
                Secure QR verification passes issued strictly through verified platforms.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-3 py-1.5 bg-[#201d32] border border-white/5 rounded-lg text-xs font-semibold text-[#e5dffb]">
                  BookMyShow
                </span>
                <span className="px-3 py-1.5 bg-[#201d32] border border-white/5 rounded-lg text-xs font-semibold text-[#e5dffb]">
                  Paytm Insider
                </span>
                <span className="px-3 py-1.5 bg-[#201d32] border border-white/5 rounded-lg text-xs font-semibold text-[#e5dffb]">
                  AllEvents
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-[#ffb4ab]">
                <ShieldCheck className="w-4 h-4 text-[#ffb4ab]" />
                <span>24x7 Safety Helpline: 112 / 1091</span>
              </div>
            </div>

            {/* Col 4: Newsletter */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-[#e5dffb] uppercase tracking-wider">
                Get Line-Up Drops
              </h4>
              <p className="text-xs text-[#a08e7a]">
                Be the first to know when headliner singers like Falguni Pathak and Kinjal Dave drop passes.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-1.5 mt-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#201d32] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e5dffb] placeholder-[#a08e7a] focus:outline-none focus:border-[#ffc174]"
                />
                <button
                  type="submit"
                  className="bg-[#f59e0b] text-[#472a00] text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-[#ffb95f] transition-all shrink-0"
                >
                  Join
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-[#54ddfc] flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Subscribed! You will get instant drop alerts.</span>
                </p>
              )}
              <div className="flex items-center gap-1.5 text-[11px] text-[#a08e7a] mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#54ddfc]" />
                <span>No spam. Only verified festival alerts.</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a08e7a]">
            <p>&copy; 2026 GarbaVibe Network. Dedicated to authentic folk heritage and safe festivities.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-[#e5dffb] cursor-pointer">Safety Guidelines</span>
              <span className="hover:text-[#e5dffb] cursor-pointer">Terms of Ground Entry</span>
              <span className="hover:text-[#e5dffb] cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

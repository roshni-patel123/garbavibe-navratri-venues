import React, { useState } from 'react';
import { ArtistProfile } from '../types/garba';
import {
  Play,
  Pause,
  Sparkles,
  Calendar,
  Instagram,
  Music,
  MapPin,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FeaturedArtistsSectionProps {
  artists: ArtistProfile[];
  onSelectArtist: (artist: ArtistProfile) => void;
  onNavigateToSchedule: (artistName: string) => void;
}

export const FeaturedArtistsSection: React.FC<FeaturedArtistsSectionProps> = ({
  artists,
  onSelectArtist,
  onNavigateToSchedule,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleTrack = (artistId: string) => {
    if (playingTrackId === artistId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(artistId);
    }
  };

  const filteredArtists = artists.filter((a) => {
    const matchesGenre = selectedGenre === 'All' || a.genre.includes(selectedGenre);
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.primaryVenue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <section className="w-full px-4 md:px-6 py-12 max-w-[1360px] mx-auto" id="singers-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#ffb3b6] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffc174]" />
            2026 Spotlight Circle &bull; Live Rhythms
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#e5dffb] mt-1 tracking-tight">
            Featured Navratri Headliners
          </h2>
          <p className="text-sm text-[#a08e7a] max-w-2xl mt-1">
            From the raw earthen resonance of Saurashtra dayro to high-energy midnight electro-dhol, explore artist tour schedules and live sound bites.
          </p>
        </div>

        {/* Search input for artists */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search singer (e.g. Aditya, Kinjal, Atul)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#201d32] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#e5dffb] placeholder-[#a08e7a] focus:outline-none focus:border-[#ffc174] w-64"
          />
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {['All', 'Traditional Garba', 'Contemporary Dandiya', 'Sufi & Gujarati Folk'].map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedGenre === genre
                ? 'bg-[#353248] text-[#ffc174] border-[#ffc174]/40 shadow-sm'
                : 'bg-[#201d32] text-[#a08e7a] border-white/5 hover:text-[#e5dffb]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* 3-Column Rich Artist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => {
          const isPlaying = playingTrackId === artist.id;
          return (
            <article
              key={artist.id}
              className="group bg-[#1c192d] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#ffc174]/30 transition-all duration-300 flex flex-col"
            >
              {/* Image & Audio Preview Header */}
              <div className="relative h-72 w-full overflow-hidden bg-[#141125]">
                <img
                  src={artist.photoUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c192d] via-[#1c192d]/40 to-transparent"></div>

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#cc003c]/90 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                    {artist.badge1}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#0e0b1f]/80 backdrop-blur-md text-[#54ddfc] font-semibold text-[10px]">
                    {artist.badge2}
                  </span>
                </div>

                {/* Social Icon Links */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#0e0b1f]/80 backdrop-blur-md flex items-center justify-center text-[#e5dffb] hover:text-[#ffc174] transition-colors"
                      title="Instagram Profile"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {artist.socialLinks.spotify && (
                    <a
                      href={artist.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#0e0b1f]/80 backdrop-blur-md flex items-center justify-center text-[#e5dffb] hover:text-[#54ddfc] transition-colors"
                      title="Spotify Profile"
                    >
                      <Music className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Mini Audio Player Bar */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#2b273d]/90 backdrop-blur-md px-3 py-2 rounded-xl flex items-center justify-between gap-2 shadow-lg border border-white/5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTrack(artist.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isPlaying
                          ? 'bg-[#f59e0b] text-[#472a00] scale-105 shadow-[0_0_12px_#f59e0b]'
                          : 'bg-[#ffc174] text-[#472a00] hover:scale-105'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#e5dffb] truncate">
                        {artist.previewTrack.title}
                      </p>
                      <p className="text-[10px] text-[#54ddfc] truncate">
                        {isPlaying ? '● Playing Live Beat' : artist.previewTrack.previewMeta}
                      </p>
                    </div>
                  </div>

                  {/* Audio Waveform visualization */}
                  <div className="flex items-center gap-0.5 h-4 shrink-0">
                    {[40, 75, 100, 60, 85, 30, 90, 50].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all ${
                          isPlaying
                            ? 'bg-[#ffc174] animate-pulse'
                            : 'bg-white/20'
                        }`}
                        style={{ height: `${isPlaying ? (h * 0.16) + 4 : 4}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Artist Details */}
              <div className="p-4 md:p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#e5dffb] group-hover:text-[#ffc174] transition-colors">
                      {artist.name}
                    </h3>
                    <span className="text-xs font-bold text-[#ffc174] bg-[#ffc174]/15 px-2 py-0.5 rounded-md">
                      {artist.performingDays}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#54ddfc] mt-0.5">
                    {artist.subtitle}
                  </p>
                  <p className="text-xs text-[#a08e7a] mt-2 line-clamp-3 leading-relaxed">
                    {artist.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-[#201d32] flex items-center justify-between text-xs">
                    <span className="text-[#a08e7a] flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
                      {artist.primaryVenue}, {artist.venueCity}
                    </span>
                    <span className="text-[#cc003c] font-bold text-[11px] shrink-0">
                      {artist.statusBadge}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToSchedule(artist.name)}
                    className="w-full text-center py-2.5 rounded-xl bg-[#2b273d] hover:bg-[#353248] text-[#e5dffb] hover:text-[#ffc174] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/5"
                  >
                    <span>View Performing Venues &amp; Slots</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ffc174]" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

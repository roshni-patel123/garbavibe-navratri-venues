import React, { useState } from 'react';
import { VenueEvent } from '../types/garba';
import {
  Clock,
  MapPin,
  Car,
  ChevronRight,
  Ticket,
  Star,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface VenueCardProps {
  venue: VenueEvent;
  onSelectForMap: (venue: VenueEvent) => void;
  onOpenBookingModal: (venue: VenueEvent) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onSelectForMap,
  onOpenBookingModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="flex flex-col bg-[#201d32]/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-[#ffc174]/40 border border-white/5 transition-all duration-300 group">
      {/* Visual Edge-to-Edge Media Banner with Badges */}
      <div className="relative w-full h-52 overflow-hidden bg-[#141125]">
        <img
          src={venue.bannerImage}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#201d32] via-[#201d32]/20 to-transparent"></div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
              venue.badge.type === 'free' || venue.isFreePass
                ? 'bg-[#29c1df] text-[#001f26] font-extrabold shadow-[0_0_14px_rgba(41,193,223,0.6)]'
                : venue.badge.type === 'hot'
                  ? 'bg-[#cc003c] text-white shadow-[#cc003c]/40'
                  : venue.badge.type === 'record'
                    ? 'bg-[#f59e0b]/90 text-[#141125] font-extrabold'
                    : venue.badge.type === 'exclusive'
                      ? 'bg-[#353248]/90 text-[#ffddb8]'
                      : venue.badge.type === 'ac'
                        ? 'bg-[#29c1df]/80 text-[#001f26] font-extrabold'
                        : 'bg-[#cc003c]/80 text-white'
            }`}
          >
            {venue.badge.text}
          </span>
        </div>

        {/* Top Right Rating & Share */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            title="Share Venue"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-[#0e0b1f]/80 backdrop-blur-md flex items-center justify-center text-[#e5dffb] hover:text-[#ffc174] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0e0b1f]/85 backdrop-blur-md text-[#ffc174] text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#ffc174] text-[#ffc174]" />
            {venue.rating} ({venue.reviewsCount})
          </span>
        </div>

        {/* Bottom Image Info Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#e5dffb]">
          <span className="text-[11px] font-medium bg-[#0e0b1f]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[#54ddfc] flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#54ddfc]" />
            {venue.timeRange}
          </span>
          <span className="text-[11px] font-medium bg-[#0e0b1f]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[#ffddb8] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#ffc174]" />
            {venue.area}, {venue.city}
          </span>
        </div>
      </div>

      {/* Venue Content Area */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <h3 className="text-xl font-bold text-[#e5dffb] group-hover:text-[#ffc174] transition-colors line-clamp-1">
          {venue.name}
        </h3>
        <p className="text-xs text-[#a08e7a] mt-1 line-clamp-1">{venue.tagline}</p>

        {/* Singer Lineup Block */}
        <div className="flex items-center gap-3 bg-[#2b273d]/70 rounded-xl p-2.5 mt-3 border border-white/5">
          <img
            src={venue.headliner.photoUrl}
            alt={venue.headliner.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#ffc174]/40"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#a08e7a] uppercase tracking-wider font-semibold">
              {venue.headliner.title}
            </span>
            <span className="text-sm text-[#ffc174] font-semibold truncate">
              {venue.headliner.name}
            </span>
          </div>
        </div>

        {/* Verified Parking & Access Guarantee */}
        <div className="mt-3 flex items-start gap-2.5 bg-[#0e0b1f]/60 rounded-xl p-2.5 border border-white/5">
          <Car className="w-5 h-5 text-[#54ddfc] shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs text-[#e5dffb]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[#54ddfc]">
                {venue.parking.totalSlots.toLocaleString()}+ Slots &bull;{' '}
                {venue.parking.valetAvailable ? 'Valet Active' : venue.parking.type}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  venue.parking.priceType === 'FREE'
                    ? 'bg-[#54ddfc]/20 text-[#54ddfc]'
                    : venue.parking.priceType === 'CLUB VALET'
                      ? 'bg-[#ffc174]/20 text-[#ffc174]'
                      : 'bg-white/10 text-[#e5dffb]'
                }`}
              >
                {venue.parking.priceType}
              </span>
            </div>
            <span className="text-[11px] text-[#a08e7a] mt-0.5 line-clamp-1">
              {venue.parking.statusText}
            </span>
          </div>
        </div>

        {/* Price & Booking CTA */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#a08e7a]">Pass Pricing</span>
            <div className="text-right">
              {venue.isFreePass || venue.tickets.isFree ? (
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="bg-[#29c1df]/20 text-[#54ddfc] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#54ddfc]/30">
                    100% FREE
                  </span>
                  <span className="text-base font-extrabold text-[#54ddfc]">
                    Free Entry
                  </span>
                </div>
              ) : venue.tickets.label ? (
                <span className="text-base font-bold text-[#e5dffb]">
                  {venue.tickets.label}
                </span>
              ) : (
                <span className="text-base font-bold text-[#e5dffb]">
                  ₹{venue.tickets.regularPrice || 999}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectForMap(venue)}
              className="flex items-center justify-center gap-1 bg-[#2b273d] hover:bg-[#353248] text-[#e5dffb] text-xs font-semibold py-2.5 px-2 rounded-xl transition-all border border-white/5"
            >
              <span>Details &amp; Map</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffc174]" />
            </button>

            <button
              type="button"
              onClick={() => onOpenBookingModal(venue)}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-2 rounded-xl shadow-md transition-all ${
                venue.isFreePass || venue.tickets.isFree
                  ? 'bg-[#29c1df] hover:bg-[#54ddfc] text-[#001f26] shadow-[0_0_12px_rgba(41,193,223,0.4)]'
                  : 'bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="truncate">
                {venue.isFreePass ? 'Claim Free Pass' : `Book on ${venue.ticketingPlatform}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

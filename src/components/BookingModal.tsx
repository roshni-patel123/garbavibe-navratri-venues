import React, { useState } from 'react';
import { VenueEvent } from '../types/garba';
import {
  X,
  Ticket,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IdCard,
  QrCode,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  venue: VenueEvent | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ venue, onClose }) => {
  const [selectedPassType, setSelectedPassType] = useState<'regular' | 'female' | 'male' | 'couple' | 'season'>('regular');
  const [quantity, setQuantity] = useState<number>(1);

  if (!venue) return null;

  const handleCelebrateRedirect = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffc174', '#54ddfc', '#ffb3b6', '#f59e0b'],
    });
    setTimeout(() => {
      window.open(venue.ticketingUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const getPassPrice = () => {
    if (venue.isFreePass || venue.tickets.isFree) return 0;
    if (selectedPassType === 'female') return venue.tickets.femalePrice || venue.tickets.regularPrice || 800;
    if (selectedPassType === 'male') return venue.tickets.malePrice || venue.tickets.regularPrice || 1200;
    if (selectedPassType === 'couple') return venue.tickets.couplePrice || 1800;
    if (selectedPassType === 'season') return venue.tickets.seasonPrice || 5000;
    return venue.tickets.regularPrice || venue.tickets.femalePrice || 999;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1c192d] border border-white/10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8">
        {/* Top Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#201d32] to-[#2b273d] border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#141125]/80 hover:bg-[#353248] text-[#e5dffb] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-xs font-bold uppercase tracking-wider">
              Official Partner &bull; {venue.ticketingPlatform}
            </span>
            <span className="text-xs text-[#54ddfc] font-semibold">100% Genuine QR Passes</span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#e5dffb] mt-2">
            {venue.name}
          </h3>
          <p className="text-xs text-[#a08e7a] flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
            {venue.fullAddress}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          {/* Pass Selector Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] block mb-2">
              Select Pass Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {venue.tickets.femalePrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPassType('female')}
                  className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                    selectedPassType === 'female'
                      ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174]'
                      : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-semibold">Female Pass</span>
                  <span className="text-base font-extrabold mt-0.5">₹{venue.tickets.femalePrice}</span>
                  <span className="text-[10px] text-[#a08e7a]">Single Night</span>
                </button>
              )}

              {venue.tickets.malePrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPassType('male')}
                  className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                    selectedPassType === 'male'
                      ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174]'
                      : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-semibold">Male Pass</span>
                  <span className="text-base font-extrabold mt-0.5">₹{venue.tickets.malePrice}</span>
                  <span className="text-[10px] text-[#a08e7a]">Traditional attire only</span>
                </button>
              )}

              {venue.tickets.couplePrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPassType('couple')}
                  className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                    selectedPassType === 'couple'
                      ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174]'
                      : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-semibold">Couple Pass</span>
                  <span className="text-base font-extrabold mt-0.5">₹{venue.tickets.couplePrice}</span>
                  <span className="text-[10px] text-[#a08e7a]">M + F Entry</span>
                </button>
              )}

              {venue.tickets.seasonPrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPassType('season')}
                  className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                    selectedPassType === 'season'
                      ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174]'
                      : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-semibold">Season Pass</span>
                  <span className="text-base font-extrabold mt-0.5">₹{venue.tickets.seasonPrice}</span>
                  <span className="text-[10px] text-[#a08e7a]">All 9 Nights</span>
                </button>
              )}
            </div>
          </div>

          {/* Step-by-Step "How to Book & Collect Pass" Guide */}
          <div className="bg-[#201d32] rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#ffc174] uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              How to Book &amp; Collect Ground Wristband
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#2b273d] p-3 rounded-xl flex flex-col gap-1">
                <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-[#472a00] font-bold flex items-center justify-center text-[10px]">
                  1
                </span>
                <span className="font-bold text-[#e5dffb]">Book Online</span>
                <span className="text-[#a08e7a]">
                  Checkout securely on {venue.ticketingPlatform} to obtain your digital QR invoice voucher.
                </span>
              </div>

              <div className="bg-[#2b273d] p-3 rounded-xl flex flex-col gap-1">
                <span className="w-5 h-5 rounded-full bg-[#54ddfc] text-[#001f26] font-bold flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="font-bold text-[#e5dffb]">Collect RFID Tag</span>
                <span className="text-[#a08e7a]">
                  Pick up your magnetic holographic wristband at ground box office 24-48 hrs prior with Govt ID.
                </span>
              </div>

              <div className="bg-[#2b273d] p-3 rounded-xl flex flex-col gap-1">
                <span className="w-5 h-5 rounded-full bg-[#ffb3b6] text-[#40000c] font-bold flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="font-bold text-[#e5dffb]">Express Turnstile Entry</span>
                <span className="text-[#a08e7a]">
                  Scan wristband at Gate 2 boom barrier. Entry cutoff strictly at 10:30 PM.
                </span>
              </div>
            </div>
          </div>

          {/* Ground Entry Norms Card */}
          <div className="bg-[#201d32] rounded-2xl p-4 border border-white/5 flex flex-col gap-2 text-xs">
            <span className="font-bold text-[#e5dffb] flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#54ddfc]" />
              Mandatory Ground Norms &amp; Guidelines
            </span>
            <ul className="text-[#a08e7a] space-y-1 list-disc list-inside">
              <li>Strict Traditional Dress Code: Kedia / Kurta for Male, Chaniya Choli for Female.</li>
              <li>Free parking pass is automatically synced with your booking phone number.</li>
              <li>No duplicate entries allowed; RFID wristbands cannot be exchanged or transferred.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer with Direct BookMyShow Action */}
        <div className="p-6 bg-[#16122e] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-[#a08e7a]">Total Estimated Amount</span>
            <span className="text-2xl font-extrabold text-[#e5dffb]">
              ₹{getPassPrice().toLocaleString()}{' '}
              <span className="text-xs text-[#a08e7a] font-normal">incl. GST</span>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-[#2b273d] hover:bg-[#353248] text-xs font-semibold text-[#e5dffb] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCelebrateRedirect}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Proceed to {venue.ticketingPlatform}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

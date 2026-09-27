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
  User,
  Phone,
  Mail,
  Plus,
  Minus,
  Printer,
  Car,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  venue: VenueEvent | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ venue, onClose }) => {
  const [selectedPassType, setSelectedPassType] = useState<'regular' | 'female' | 'male' | 'couple' | 'season'>('regular');
  const [quantity, setQuantity] = useState<number>(2);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const quickProfiles = [
    { name: 'Roshni Patel', phone: '9876543210' },
    { name: 'Aarav Mehta', phone: '9825012345' },
    { name: 'Kavya Shah', phone: '9712345678' },
  ];

  if (!venue) return null;

  const getUnitPrice = () => {
    if (venue.isFreePass || venue.tickets.isFree) return 0;
    if (selectedPassType === 'female') return venue.tickets.femalePrice || venue.tickets.regularPrice || 800;
    if (selectedPassType === 'male') return venue.tickets.malePrice || venue.tickets.regularPrice || 1200;
    if (selectedPassType === 'couple') return venue.tickets.couplePrice || 1800;
    if (selectedPassType === 'season') return venue.tickets.seasonPrice || 5000;
    return venue.tickets.regularPrice || venue.tickets.femalePrice || 999;
  };

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * quantity;

  const handleApplyProfile = (name: string, phone: string) => {
    setFullName(name);
    setPhoneNumber(phone);
    setValidationError(null);
  };

  const handleProceedBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      setValidationError('Please enter your full name as shown on your Govt ID (minimum 3 characters).');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number for QR pass delivery.');
      return;
    }
    if (quantity < 1 || quantity > 10) {
      setValidationError('Please select between 1 and 10 passes.');
      return;
    }

    setValidationError(null);
    setBookingId('GV-' + Math.floor(100000 + Math.random() * 900000));

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ffc174', '#54ddfc', '#ffb3b6', '#f59e0b'],
    });

    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
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

        {/* Modal Body: Confirmed View or Booking Form */}
        {bookingConfirmed ? (
          <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#29c1df]/20 border-2 border-[#54ddfc] flex items-center justify-center text-[#54ddfc] mb-2 animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#54ddfc]">
                Pass Confirmed
              </span>
              <h4 className="text-2xl font-extrabold text-[#e5dffb] mt-1">
                Your Garba Passes Are Generated!
              </h4>
              <p className="text-xs text-[#a08e7a] max-w-sm mt-1">
                Digital pass voucher and Gate Parking slip dispatched to{' '}
                <strong className="text-[#ffc174]">+91 {phoneNumber}</strong> via WhatsApp.
              </p>
            </div>

            {/* Virtual Hologram Pass Card */}
            <div className="bg-gradient-to-br from-[#28243f] via-[#201d32] to-[#161327] rounded-2xl p-5 border-2 border-dashed border-[#ffc174]/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#54ddfc]">
                    {bookingId}
                  </span>
                  <h5 className="text-lg font-bold text-[#e5dffb] mt-0.5">{venue.name}</h5>
                  <span className="text-xs text-[#a08e7a]">{venue.city} &bull; Oct 10–19, 2026</span>
                </div>
                <div className="bg-white p-2 rounded-xl shrink-0">
                  <div className="w-16 h-16 bg-[#141125] p-1 rounded-lg flex items-center justify-center">
                    <QrCode className="w-full h-full text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#a08e7a] block uppercase font-bold">Passholder</span>
                  <span className="font-bold text-[#e5dffb] truncate block">{fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a08e7a] block uppercase font-bold">Mobile</span>
                  <span className="font-bold text-[#ffc174] truncate block">+91 {phoneNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a08e7a] block uppercase font-bold">Quantity</span>
                  <span className="font-bold text-[#54ddfc] truncate block">
                    {quantity} Pass{quantity > 1 ? 'es' : ''} ({selectedPassType.toUpperCase()})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#a08e7a] block uppercase font-bold">Amount</span>
                  <span className="font-bold text-[#ffb3b6] truncate block">
                    {unitPrice === 0 ? 'FREE ENTRY' : `₹${totalPrice.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#a08e7a]">
                <Car className="w-3.5 h-3.5 text-[#ffc174]" />
                <span>Verified parking pass linked to +91 {phoneNumber}.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingConfirmed(false)}
                className="px-4 py-2.5 rounded-xl bg-[#2b273d] hover:bg-[#353248] text-xs font-bold text-[#e5dffb] transition-colors"
              >
                Modify / Book More
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#201d32] border border-white/10 hover:bg-[#2b273d] text-xs font-semibold text-[#e5dffb] flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#ffc174]" />
                  <span>Print Slip</span>
                </button>

                <a
                  href={venue.ticketingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffb95f] text-xs font-bold text-[#472a00] flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Open {venue.ticketingPlatform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Modal Body / Form */
          <form onSubmit={handleProceedBooking} className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 bg-[#cc003c]/20 border border-[#cc003c]/40 text-[#ffb3b6] rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Pass Selector Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] block mb-2">
              1. Select Pass Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {venue.isFreePass ? (
                <button
                  type="button"
                  onClick={() => setSelectedPassType('regular')}
                  className="col-span-2 sm:col-span-4 p-3 rounded-xl border bg-[#29c1df]/20 border-[#54ddfc] text-[#54ddfc] flex items-center justify-between text-left"
                >
                  <div>
                    <span className="text-xs font-bold block">100% Free Public Entry Pass</span>
                    <span className="text-[11px] text-[#a08e7a]">Cultural State Heritage Pass (Zero Fee)</span>
                  </div>
                  <span className="text-base font-extrabold text-[#54ddfc]">FREE ₹0</span>
                </button>
              ) : (
                <>
                  {venue.tickets.femalePrice && (
                    <button
                      type="button"
                      onClick={() => setSelectedPassType('female')}
                      className={`p-3 rounded-xl border flex flex-col text-left transition-all ${
                        selectedPassType === 'female'
                          ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
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
                          ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
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
                          ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
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
                          ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-semibold">Season Pass</span>
                      <span className="text-base font-extrabold mt-0.5">₹{venue.tickets.seasonPrice}</span>
                      <span className="text-[10px] text-[#a08e7a]">All 9 Nights</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Pass Quantity Input Selector */}
          <div className="bg-[#201d32] rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] block">
                2. Select Pass Quantity
              </label>
              <p className="text-xs text-[#e5dffb] font-medium mt-0.5">
                Maximum 10 passes per mobile verification
              </p>
            </div>

            {/* Stepper + direct input */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#2b273d] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-[#353248] hover:bg-[#3f3b55] text-[#e5dffb] flex items-center justify-center transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease pass quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setQuantity(Math.min(10, Math.max(1, val)));
                    }
                  }}
                  className="w-12 text-center bg-transparent text-sm font-extrabold text-[#ffc174] outline-none"
                  aria-label="Pass quantity number"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 rounded-lg bg-[#353248] hover:bg-[#3f3b55] text-[#e5dffb] flex items-center justify-center transition-colors disabled:opacity-40"
                  disabled={quantity >= 10}
                  aria-label="Increase pass quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Quantity Badges */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      quantity === num
                        ? 'bg-[#f59e0b] text-[#472a00]'
                        : 'bg-[#2b273d] text-[#a08e7a] hover:text-[#e5dffb]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Details (Name & Phone Number Inputs) */}
          <div className="bg-[#201d32] rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] block">
                3. Passholder Contact &amp; Verification Details
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] text-[#a08e7a]">Quick Select:</span>
                {quickProfiles.map((p) => (
                  <button
                    key={p.phone}
                    type="button"
                    onClick={() => handleApplyProfile(p.name, p.phone)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                      fullName === p.name && phoneNumber === p.phone
                        ? 'bg-[#f59e0b] text-[#472a00] border-[#f59e0b]'
                        : 'bg-[#2b273d] text-[#d8c3ad] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#a08e7a] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#ffc174]" />
                  Full Name (as on Govt ID) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roshni Patel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#e5dffb] placeholder-[#a08e7a] outline-none focus:border-[#ffc174] transition-all"
                  />
                </div>
              </div>

              {/* Mobile Phone Number Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#a08e7a] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#54ddfc]" />
                  Mobile / WhatsApp Number *
                </label>
                <div className="flex items-center bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#54ddfc] transition-all">
                  <span className="text-xs font-bold text-[#ffc174] mr-2 shrink-0">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent text-xs text-[#e5dffb] placeholder-[#a08e7a] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[11px] font-semibold text-[#a08e7a] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#ffb3b6]" />
                Email Address (Optional - for digital pass receipt)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#e5dffb] placeholder-[#a08e7a] outline-none focus:border-[#ffb3b6] transition-all"
              />
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
                <span className="font-bold text-[#e5dffb]">Instant SMS QR</span>
                <span className="text-[#a08e7a]">
                  Instant QR booking voucher dispatched to {phoneNumber ? `+91 ${phoneNumber}` : 'your mobile number'}.
                </span>
              </div>

              <div className="bg-[#2b273d] p-3 rounded-xl flex flex-col gap-1">
                <span className="w-5 h-5 rounded-full bg-[#54ddfc] text-[#001f26] font-bold flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="font-bold text-[#e5dffb]">Collect RFID Tag</span>
                <span className="text-[#a08e7a]">
                  Pick up your {quantity} magnetic RFID holographic wristband{quantity > 1 ? 's' : ''} at ground box office with Govt ID.
                </span>
              </div>

              <div className="bg-[#2b273d] p-3 rounded-xl flex flex-col gap-1">
                <span className="w-5 h-5 rounded-full bg-[#ffb3b6] text-[#40000c] font-bold flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="font-bold text-[#e5dffb]">Express Turnstile</span>
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
              <li>Free parking pass is automatically synced with mobile number (+91 {phoneNumber || 'XXXXXXXXXX'}).</li>
              <li>No duplicate entries allowed; RFID wristbands cannot be exchanged or transferred.</li>
            </ul>
          </div>

          {/* Modal Footer with Live Price & Action */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-[#a08e7a]">
                Total Amount for {quantity} Pass{quantity > 1 ? 'es' : ''}
              </span>
              <div className="flex items-baseline gap-2">
                {unitPrice === 0 ? (
                  <span className="text-2xl font-extrabold text-[#54ddfc]">
                    FREE (₹0)
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-extrabold text-[#e5dffb]">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#a08e7a] font-normal">
                      (₹{unitPrice} × {quantity}) incl. GST
                    </span>
                  </>
                )}
              </div>
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
                type="submit"
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  unitPrice === 0
                    ? 'bg-[#29c1df] hover:bg-[#54ddfc] text-[#001f26]'
                    : 'bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00]'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>
                  {unitPrice === 0
                    ? `Claim ${quantity} Free Pass${quantity > 1 ? 'es' : ''}`
                    : `Proceed to Book (${quantity} Pass${quantity > 1 ? 'es' : ''})`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};


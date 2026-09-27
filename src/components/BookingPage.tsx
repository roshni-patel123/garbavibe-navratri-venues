import React, { useState, useEffect } from 'react';
import { VenueEvent } from '../types/garba';
import {
  Ticket,
  User,
  Phone,
  Mail,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Printer,
  Download,
  Share2,
  Car,
  Clock,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingPageProps {
  venues: VenueEvent[];
  selectedVenue: VenueEvent | null;
  onSelectVenue: (venue: VenueEvent) => void;
  onNavigateToMap?: (venue: VenueEvent) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  onNavigateToMap,
}) => {
  // If no venue is selected, pick the first one
  const currentVenue = selectedVenue || venues[0];

  const [selectedPassType, setSelectedPassType] = useState<
    'regular' | 'female' | 'male' | 'couple' | 'season'
  >('regular');
  const [quantity, setQuantity] = useState<number>(2);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick preset identities for fast selection
  const quickProfiles = [
    { name: 'Roshni Patel', phone: '9876543210' },
    { name: 'Aarav Mehta', phone: '9825012345' },
    { name: 'Kavya Shah', phone: '9712345678' },
    { name: 'Devendra Joshi', phone: '9909012345' },
  ];

  // Pass quantities for quick selection
  const quantityPresets = [1, 2, 3, 4, 5, 6, 8, 10];

  // Adjust pass type when venue changes
  useEffect(() => {
    if (currentVenue.isFreePass || currentVenue.tickets.isFree) {
      setSelectedPassType('regular');
    } else if (currentVenue.tickets.femalePrice) {
      setSelectedPassType('female');
    } else {
      setSelectedPassType('regular');
    }
    setBookingConfirmed(false);
  }, [currentVenue]);

  const getUnitPrice = () => {
    if (currentVenue.isFreePass || currentVenue.tickets.isFree) return 0;
    if (selectedPassType === 'female')
      return currentVenue.tickets.femalePrice || currentVenue.tickets.regularPrice || 800;
    if (selectedPassType === 'male')
      return currentVenue.tickets.malePrice || currentVenue.tickets.regularPrice || 1200;
    if (selectedPassType === 'couple')
      return currentVenue.tickets.couplePrice || 1800;
    if (selectedPassType === 'season')
      return currentVenue.tickets.seasonPrice || 5000;
    return (
      currentVenue.tickets.regularPrice ||
      currentVenue.tickets.femalePrice ||
      999
    );
  };

  const unitPrice = getUnitPrice();
  const subtotal = unitPrice * quantity;
  const gst = unitPrice === 0 ? 0 : Math.round(subtotal * 0.18);
  const totalAmount = unitPrice === 0 ? 0 : subtotal + gst;

  const handleApplyProfile = (name: string, phone: string) => {
    setFullName(name);
    setPhoneNumber(phone);
    setValidationError(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      setValidationError('Please enter a valid full name (minimum 3 characters).');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number for QR pass delivery.');
      return;
    }

    if (quantity < 1 || quantity > 10) {
      setValidationError('Please select pass quantity between 1 and 10 passes.');
      return;
    }

    setValidationError(null);

    // Generate random booking ID
    const randomId = 'GV-' + Math.floor(100000 + Math.random() * 900000);
    setBookingId(randomId);

    // Confetti celebration
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#29c1df', '#ffb3b6', '#54ddfc', '#ffc174'],
    });

    setBookingConfirmed(true);
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-6 py-6 font-sans">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-xs font-bold uppercase tracking-wider">
              Official Booking Portal
            </span>
            <span className="text-xs text-[#54ddfc] font-semibold">
              Instant Wristband &amp; Parking Pass
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e5dffb] tracking-tight">
            Book Navratri Garba Passes
          </h1>
          <p className="text-xs md:text-sm text-[#a08e7a] mt-1">
            Configure attendee details, select pass quantity, and receive instant digital QR vouchers with gate RFID pickup.
          </p>
        </div>

        {/* Venue Quick Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#a08e7a] whitespace-nowrap hidden sm:inline">
            Select Venue:
          </label>
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <select
              aria-label="Select Garba Venue"
              value={currentVenue.id}
              onChange={(e) => {
                const found = venues.find((v) => v.id === e.target.value);
                if (found) onSelectVenue(found);
              }}
              className="w-full bg-[#1c192d] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#ffc174] focus:outline-none focus:border-[#f59e0b] cursor-pointer appearance-none pr-8 shadow-md"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#1c192d] text-[#e5dffb]">
                  {v.isFreePass ? '🎟️ [FREE] ' : '🎪 '} {v.name} ({v.city})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#ffc174] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {bookingConfirmed ? (
        /* Confirmed Pass Voucher Card State */
        <div className="bg-[#1c192d] border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] max-w-3xl mx-auto">
          <div className="text-center flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#29c1df]/20 border-2 border-[#54ddfc] flex items-center justify-center text-[#54ddfc] mb-3 shadow-[0_0_20px_rgba(41,193,223,0.4)] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#54ddfc]">
              Pass Booking Confirmed
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#e5dffb] mt-1">
              Your Garba Passes Are Ready!
            </h2>
            <p className="text-xs text-[#a08e7a] max-w-md mt-1">
              A digital confirmation along with QR pass tokens has been dispatched via SMS &amp; WhatsApp to{' '}
              <strong className="text-[#ffc174]">+91 {phoneNumber}</strong>.
            </p>
          </div>

          {/* Holographic Pass Display */}
          <div className="relative bg-gradient-to-br from-[#28243f] via-[#201d32] to-[#161327] rounded-2xl p-6 border-2 border-dashed border-[#ffc174]/40 shadow-2xl overflow-hidden mb-6">
            {/* Ambient Festive Shimmer */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#f59e0b]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#29c1df]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a08e7a]">
                  Booking Reference ID
                </span>
                <div className="text-xl font-mono font-extrabold text-[#54ddfc] tracking-wider">
                  {bookingId}
                </div>
                <h3 className="text-xl font-bold text-[#e5dffb] mt-2">
                  {currentVenue.name}
                </h3>
                <p className="text-xs text-[#a08e7a] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
                  {currentVenue.fullAddress}
                </p>
              </div>

              {/* QR Code Block */}
              <div className="bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center shrink-0">
                <div className="w-28 h-28 bg-[#141125] p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-full h-full text-white" />
                </div>
                <span className="text-[9px] font-extrabold text-[#141125] mt-1 tracking-wider uppercase">
                  Scan at Entry Turnstile
                </span>
              </div>
            </div>

            {/* Passholder Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
              <div className="flex flex-col">
                <span className="text-[#a08e7a] text-[10px] uppercase font-bold">
                  Primary Passholder
                </span>
                <span className="font-extrabold text-[#e5dffb] text-sm mt-0.5">
                  {fullName}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#a08e7a] text-[10px] uppercase font-bold">
                  Mobile Number
                </span>
                <span className="font-extrabold text-[#ffc174] text-sm mt-0.5">
                  +91 {phoneNumber}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#a08e7a] text-[10px] uppercase font-bold">
                  Pass Quantity
                </span>
                <span className="font-extrabold text-[#54ddfc] text-sm mt-0.5">
                  {quantity} Wristband{quantity > 1 ? 's' : ''} ({selectedPassType.toUpperCase()})
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#a08e7a] text-[10px] uppercase font-bold">
                  Total Paid
                </span>
                <span className="font-extrabold text-[#ffb3b6] text-sm mt-0.5">
                  {unitPrice === 0 ? 'FREE ENTRY' : `₹${totalAmount.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Parking sync alert */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#a08e7a]">
              <Car className="w-4 h-4 text-[#ffc174]" />
              <span>
                Parking Gate Pass linked to <strong>+91 {phoneNumber}</strong> ({currentVenue.parking.type} - {currentVenue.parking.priceType}).
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setBookingConfirmed(false)}
              className="px-5 py-2.5 rounded-xl bg-[#2b273d] hover:bg-[#353248] text-xs font-bold text-[#e5dffb] transition-colors"
            >
              Book Another Pass
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-[#201d32] border border-white/10 hover:bg-[#2b273d] text-xs font-semibold text-[#e5dffb] flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#ffc174]" />
                <span>Print Pass Slip</span>
              </button>

              <a
                href={currentVenue.ticketingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffb95f] text-xs font-bold text-[#472a00] flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Open in {currentVenue.ticketingPlatform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Main Two-Column Booking Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form (Name, Number, Quantity, Pass Type) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Validation Banner */}
            {validationError && (
              <div className="p-3.5 bg-[#cc003c]/20 border border-[#cc003c]/40 text-[#ffb3b6] rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#ffb3b6]" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            <form
              onSubmit={handleConfirmBooking}
              className="bg-[#1c192d] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
            >
              {/* Selected Venue Header Glance */}
              <div className="p-4 rounded-2xl bg-[#201d32] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174]">
                      {currentVenue.city} &bull; {currentVenue.venueExperience}
                    </span>
                    {currentVenue.isFreePass && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#29c1df]/20 text-[#54ddfc] border border-[#54ddfc]/30">
                        100% Free Public Entry
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#e5dffb] mt-1">
                    {currentVenue.name}
                  </h3>
                  <p className="text-xs text-[#a08e7a] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ffc174]" />
                    {currentVenue.fullAddress}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-[#a08e7a] block">Starting Rate</span>
                  <span className="text-lg font-extrabold text-[#ffc174]">
                    {currentVenue.isFreePass || currentVenue.tickets.isFree
                      ? 'FREE ₹0'
                      : currentVenue.tickets.label || `₹${currentVenue.tickets.regularPrice || 999}`}
                  </span>
                </div>
              </div>

              {/* STEP 1: Pass Category Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] flex items-center justify-between mb-3">
                  <span>Step 1: Select Pass Category</span>
                  <span className="text-[10px] text-[#ffc174] font-semibold">
                    {currentVenue.isFreePass ? 'State Heritage Pass' : 'Strict Traditional Attire'}
                  </span>
                </label>

                {currentVenue.isFreePass ? (
                  <button
                    type="button"
                    onClick={() => setSelectedPassType('regular')}
                    className="w-full p-4 rounded-2xl border-2 bg-[#29c1df]/15 border-[#54ddfc] text-[#54ddfc] flex items-center justify-between text-left shadow-[0_0_20px_rgba(41,193,223,0.2)]"
                  >
                    <div>
                      <span className="text-sm font-bold block text-[#54ddfc]">
                        🌟 Gujarat Cultural Public Pass (100% Free Entry)
                      </span>
                      <span className="text-xs text-[#a08e7a] mt-0.5 block">
                        Open to all Navratri enthusiasts with valid Govt Photo ID. Zero booking fee.
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-[#54ddfc] ml-2 shrink-0">
                      FREE ₹0
                    </span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {currentVenue.tickets.femalePrice && (
                      <button
                        type="button"
                        onClick={() => setSelectedPassType('female')}
                        className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all ${
                          selectedPassType === 'female'
                            ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold">Female Pass</span>
                        <span className="text-lg font-extrabold mt-1">
                          ₹{currentVenue.tickets.femalePrice}
                        </span>
                        <span className="text-[10px] text-[#a08e7a]">Single Night</span>
                      </button>
                    )}

                    {currentVenue.tickets.malePrice && (
                      <button
                        type="button"
                        onClick={() => setSelectedPassType('male')}
                        className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all ${
                          selectedPassType === 'male'
                            ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold">Male Pass</span>
                        <span className="text-lg font-extrabold mt-1">
                          ₹{currentVenue.tickets.malePrice}
                        </span>
                        <span className="text-[10px] text-[#a08e7a]">Traditional Attire</span>
                      </button>
                    )}

                    {currentVenue.tickets.couplePrice && (
                      <button
                        type="button"
                        onClick={() => setSelectedPassType('couple')}
                        className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all ${
                          selectedPassType === 'couple'
                            ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold">Couple Pass</span>
                        <span className="text-lg font-extrabold mt-1">
                          ₹{currentVenue.tickets.couplePrice}
                        </span>
                        <span className="text-[10px] text-[#a08e7a]">1 Male + 1 Female</span>
                      </button>
                    )}

                    {currentVenue.tickets.seasonPrice && (
                      <button
                        type="button"
                        onClick={() => setSelectedPassType('season')}
                        className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all ${
                          selectedPassType === 'season'
                            ? 'bg-[#f59e0b]/20 border-[#ffc174] text-[#ffc174] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : 'bg-[#201d32] border-white/5 text-[#e5dffb] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold">Season Pass</span>
                        <span className="text-lg font-extrabold mt-1">
                          ₹{currentVenue.tickets.seasonPrice}
                        </span>
                        <span className="text-[10px] text-[#a08e7a]">All 9 Nights Access</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: Passholder Name & Phone Number Input */}
              <div className="bg-[#201d32] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a]">
                    Step 2: Enter Name &amp; Mobile Number
                  </label>
                  <span className="text-[11px] text-[#54ddfc] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified SMS &amp; WhatsApp Pass Delivery
                  </span>
                </div>

                {/* Quick Profile Selectors */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] font-semibold text-[#a08e7a] whitespace-nowrap">
                    Quick Select:
                  </span>
                  {quickProfiles.map((p) => (
                    <button
                      key={p.phone}
                      type="button"
                      onClick={() => handleApplyProfile(p.name, p.phone)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                        fullName === p.name && phoneNumber === p.phone
                          ? 'bg-[#f59e0b] text-[#472a00] border-[#f59e0b]'
                          : 'bg-[#2b273d] text-[#d8c3ad] border-white/5 hover:border-white/20'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#e5dffb] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ffc174]" />
                      Full Name (as per Photo ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roshni Patel"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#e5dffb] placeholder-[#a08e7a] outline-none focus:border-[#ffc174] transition-all shadow-inner"
                    />
                    <span className="text-[10px] text-[#a08e7a]">
                      Printed on the magnetic wristband at the ground box office.
                    </span>
                  </div>

                  {/* Phone Number Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#e5dffb] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#54ddfc]" />
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="flex items-center bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#54ddfc] transition-all shadow-inner">
                      <span className="text-xs font-bold text-[#ffc174] mr-2 shrink-0 select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value.replace(/\D/g, ''));
                          setValidationError(null);
                        }}
                        className="w-full bg-transparent text-xs font-bold text-[#e5dffb] placeholder-[#a08e7a] outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-[#a08e7a]">
                      QR e-pass voucher and gate parking slip sent here.
                    </span>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#a08e7a] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ffb3b6]" />
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="roshni@example.com (for tax invoice & calendar invite)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2b273d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#e5dffb] placeholder-[#a08e7a] outline-none focus:border-[#ffb3b6] transition-all"
                  />
                </div>
              </div>

              {/* STEP 3: Pass Quantity Input & Selector */}
              <div className="bg-[#201d32] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#a08e7a] block">
                      Step 3: Select Pass Quantity
                    </label>
                    <p className="text-xs text-[#e5dffb] font-medium mt-0.5">
                      Select or type how many passes you need for your group
                    </p>
                  </div>

                  {/* Quantity Stepper Controls */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center bg-[#2b273d] border border-white/10 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-lg bg-[#353248] hover:bg-[#3f3b55] text-[#e5dffb] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
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
                        className="w-14 text-center bg-transparent text-base font-extrabold text-[#ffc174] outline-none"
                        aria-label="Direct pass quantity input"
                      />

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        disabled={quantity >= 10}
                        className="w-9 h-9 rounded-lg bg-[#353248] hover:bg-[#3f3b55] text-[#e5dffb] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Pass Quantity Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-[#a08e7a] mr-1">
                    Quick Preset:
                  </span>
                  {quantityPresets.map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        quantity === qty
                          ? 'bg-[#f59e0b] text-[#472a00] shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                          : 'bg-[#2b273d] text-[#d8c3ad] hover:text-[#e5dffb] hover:bg-[#353248]'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Pass' : 'Passes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-2xl text-base font-extrabold shadow-xl transition-all flex items-center justify-center gap-2 ${
                  unitPrice === 0
                    ? 'bg-[#29c1df] hover:bg-[#54ddfc] text-[#001f26] shadow-[0_0_20px_rgba(41,193,223,0.35)]'
                    : 'bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                }`}
              >
                <Ticket className="w-5 h-5" />
                <span>
                  {unitPrice === 0
                    ? `Claim ${quantity} Free Public Pass${quantity > 1 ? 'es' : ''}`
                    : `Confirm & Generate ${quantity} Pass${quantity > 1 ? 'es' : ''} (₹${totalAmount.toLocaleString()})`}
                </span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Live RFID Digital Wristband Preview & Order Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            {/* Live Holographic Pass Preview */}
            <div className="bg-gradient-to-br from-[#231f38] via-[#1c192d] to-[#161327] rounded-3xl p-6 border-2 border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174]">
                  Live Digital Wristband Preview
                </span>
                <span className="text-[10px] font-bold text-[#54ddfc] uppercase">
                  RFID 13.56 MHz NFC
                </span>
              </div>

              {/* Virtual Hologram Pass Card */}
              <div className="bg-[#141125] rounded-2xl p-5 border border-white/15 relative overflow-hidden shadow-inner">
                {/* Visual hologram ribbon */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ffc174]/20 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#54ddfc]">
                      PASS NO: GV-2026-{'X' + (quantity * 137).toString().padStart(4, '0')}
                    </span>
                    <h4 className="text-base font-extrabold text-[#e5dffb] mt-0.5">
                      {currentVenue.name}
                    </h4>
                    <span className="text-[11px] text-[#ffc174] font-medium block">
                      {currentVenue.city} &bull; Oct 10–19, 2026
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#a08e7a] block">Passholder Name</span>
                    <span className="font-bold text-[#e5dffb] truncate block">
                      {fullName || 'Attendee Name'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a08e7a] block">Registered Mobile</span>
                    <span className="font-bold text-[#ffc174] truncate block">
                      {phoneNumber ? `+91 ${phoneNumber}` : '+91 9XXXXXXXXX'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                  <span className="font-bold text-[#54ddfc]">
                    🎟️ {quantity} {quantity === 1 ? 'Wristband' : 'Wristbands'} (
                    {selectedPassType.toUpperCase()})
                  </span>
                  <span className="text-[10px] text-[#a08e7a]">Gate 2 Entry</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown / Order Summary */}
            <div className="bg-[#1c192d] rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#ffc174] flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Pass Order Summary
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#a08e7a]">
                  <span>Pass Type</span>
                  <span className="font-semibold text-[#e5dffb] capitalize">
                    {currentVenue.isFreePass ? 'Free Public Pass' : `${selectedPassType} Pass`}
                  </span>
                </div>

                <div className="flex justify-between text-[#a08e7a]">
                  <span>Unit Price</span>
                  <span className="font-semibold text-[#e5dffb]">
                    {unitPrice === 0 ? '₹0 (Free)' : `₹${unitPrice}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#a08e7a]">
                  <span>Selected Quantity</span>
                  <span className="font-semibold text-[#ffc174]">
                    {quantity} {quantity === 1 ? 'Pass' : 'Passes'}
                  </span>
                </div>

                <div className="flex justify-between text-[#a08e7a]">
                  <span>GST &amp; Municipal Cultural Cess (18%)</span>
                  <span className="font-semibold text-[#e5dffb]">
                    {unitPrice === 0 ? '₹0' : `₹${gst}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#e5dffb]">Total Payable</span>
                  <span className="text-xl font-extrabold text-[#54ddfc]">
                    {unitPrice === 0 ? '100% FREE (₹0)' : `₹${totalAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Partner Redirect Notice */}
              <div className="p-3 bg-[#201d32] rounded-xl border border-white/5 text-[11px] text-[#a08e7a] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#ffc174] shrink-0 mt-0.5" />
                <span>
                  Pass collection requires valid Govt Photo ID. Physical RFID bands must be picked up before 9:30 PM at the ground box office.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

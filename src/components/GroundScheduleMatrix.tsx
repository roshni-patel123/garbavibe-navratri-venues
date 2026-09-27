import React from 'react';
import { GroundScheduleRow } from '../types/garba';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Zap,
  Ticket,
} from 'lucide-react';

interface GroundScheduleMatrixProps {
  scheduleRows: GroundScheduleRow[];
  selectedDayTab: number | 'all';
  onSelectDayTab: (day: number | 'all') => void;
  highlightedArtist: string | null;
}

export const GroundScheduleMatrix: React.FC<GroundScheduleMatrixProps> = ({
  scheduleRows,
  selectedDayTab,
  onSelectDayTab,
  highlightedArtist,
}) => {
  const filteredRows = scheduleRows.filter((row) => {
    if (selectedDayTab === 'all') return true;
    return row.dayNumber === selectedDayTab;
  });

  return (
    <section className="w-full px-4 md:px-6 py-12 max-w-[1360px] mx-auto" id="pass-guide">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#54ddfc]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#54ddfc]">
              Master Ground Grid
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#e5dffb] mt-1 tracking-tight">
            Daily Schedule &amp; Pass Allocation Matrix
          </h2>
          <p className="text-xs md:text-sm text-[#a08e7a] mt-1">
            Real-time verified ground slots, gates timing, and certified ticketing platform redirections.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectDayTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDayTab === 'all'
                ? 'bg-[#353248] text-[#ffc174] shadow-sm'
                : 'bg-[#201d32] text-[#a08e7a] hover:text-[#e5dffb]'
            }`}
          >
            All Days
          </button>
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDayTab(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDayTab === day
                  ? 'bg-[#353248] text-[#ffc174] shadow-sm'
                  : 'bg-[#201d32] text-[#a08e7a] hover:text-[#e5dffb]'
              }`}
            >
              Day {day} (Oct {11 + day})
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl bg-[#1c192d] border border-white/5 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#2b273d]/90 text-[#a08e7a] text-xs font-bold uppercase tracking-wider border-b border-white/5">
              <th className="py-4 px-5">Slot Time &amp; Day</th>
              <th className="py-4 px-5">Performing Artist / Troupe</th>
              <th className="py-4 px-5">Venue &amp; City</th>
              <th className="py-4 px-5">Live Pass Inventory</th>
              <th className="py-4 px-5 text-right">Direct Pass Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[#e5dffb] text-sm">
            {filteredRows.map((row) => {
              const isHighlighted = highlightedArtist && row.artistName.includes(highlightedArtist);
              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-[#f59e0b]/20 hover:bg-[#f59e0b]/25'
                      : 'hover:bg-[#201d32]/70'
                  }`}
                >
                  {/* Slot Time */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#ffc174] text-base flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ffc174]" />
                      {row.timeSlot}
                    </div>
                    <div className="text-xs text-[#a08e7a] mt-0.5">{row.dayText}</div>
                  </td>

                  {/* Artist */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          row.artistColor === 'primary'
                            ? 'bg-[#ffc174]/20 text-[#ffc174]'
                            : row.artistColor === 'secondary'
                              ? 'bg-[#cc003c]/20 text-[#ffb3b6]'
                              : 'bg-[#54ddfc]/20 text-[#54ddfc]'
                        }`}
                      >
                        {row.artistInitials}
                      </div>
                      <div>
                        <div className="font-bold text-[#e5dffb] text-sm">
                          {row.artistName}
                        </div>
                        <div className="text-xs text-[#54ddfc]">
                          {row.artistSubtext}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Venue */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#e5dffb] text-sm">
                      {row.venueName}
                    </div>
                    <div className="text-xs text-[#a08e7a] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#ffc174]" />
                      {row.venueLocation}
                    </div>
                  </td>

                  {/* Pass Inventory */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1 max-w-[150px]">
                      <div className="flex justify-between text-xs">
                        <span
                          className={`font-bold ${
                            row.inventoryAlertColor === 'secondary'
                              ? 'text-[#ffb3b6]'
                              : row.inventoryAlertColor === 'tertiary'
                                ? 'text-[#54ddfc]'
                                : 'text-[#ffc174]'
                          }`}
                        >
                          {row.passInventoryText}
                        </span>
                        <span className="text-[#a08e7a] text-[10px]">
                          {row.passInventoryPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[#353248] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.inventoryAlertColor === 'secondary'
                              ? 'bg-[#cc003c]'
                              : row.inventoryAlertColor === 'tertiary'
                                ? 'bg-[#29c1df]'
                                : 'bg-[#f59e0b]'
                          }`}
                          style={{ width: `${row.passInventoryPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Booking Action */}
                  <td className="py-4 px-5 text-right">
                    <a
                      href={row.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#ffb95f] text-[#472a00] text-xs font-bold shadow-md transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Security, QR & Entry Advisory Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#1c192d] p-4 rounded-xl border border-white/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffc174]/15 flex items-center justify-center text-[#ffc174] shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#e5dffb]">RFID Wristband Verification</h5>
            <p className="text-xs text-[#a08e7a] mt-0.5">
              Collect authorized magnetic tags at designated box offices 48 hours prior to Night 1.
            </p>
          </div>
        </div>

        <div className="bg-[#1c192d] p-4 rounded-xl border border-white/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#54ddfc]/15 flex items-center justify-center text-[#54ddfc] shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#e5dffb]">Strict Traditional Attire</h5>
            <p className="text-xs text-[#a08e7a] mt-0.5">
              Mandatory Kedia / Kurta for Men &amp; Authentic Chaniya Choli for Women across all premier arenas.
            </p>
          </div>
        </div>

        <div className="bg-[#1c192d] p-4 rounded-xl border border-white/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffb3b6]/15 flex items-center justify-center text-[#ffb3b6] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#e5dffb]">Valet &amp; Shuttle Bays</h5>
            <p className="text-xs text-[#a08e7a] mt-0.5">
              Free multi-tier parking paired with direct electric buggy drop-offs for early entrants before 08:30 PM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

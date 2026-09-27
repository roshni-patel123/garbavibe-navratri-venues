export interface ParkingInfo {
  totalSlots: number;
  availableSlots: number;
  type: 'On-site Ground' | 'Multi-Deck' | 'Basement' | 'Park & Ride Shuttle';
  valetAvailable: boolean;
  valetChutes?: number;
  evChargers?: number;
  fastTagEnabled: boolean;
  statusText: string;
  walkingDistance: string; // e.g. "3 min walk to Gate 2"
  priceType: 'FREE' | 'PAID' | 'CLUB VALET' | 'MEMBERS ONLY';
  alternateLot?: string;
  avgQueueTime?: string;
}

export interface TicketBreakdown {
  femalePrice?: number;
  malePrice?: number;
  couplePrice?: number;
  seasonPrice?: number;
  regularPrice?: number;
  currency: string;
  label: string; // e.g., "From ₹800 (F) / ₹1,200 (M)"
  fastFilling?: boolean;
  statusBadge?: string;
}

export interface HeadlinerArtist {
  name: string;
  title: string;
  photoUrl: string;
  musicStyle: string;
  previewTrack?: {
    title: string;
    duration: string;
    bpm: string;
  };
}

export interface VenueEvent {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  city: 'Ahmedabad' | 'Vadodara' | 'Surat' | 'Mumbai';
  area: string; // e.g. "SG Highway", "Sindhu Bhavan Road", "Worli"
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parkingCoordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  bannerImage: string;
  timeRange: string;
  datesText: string;
  auspiciousDays: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9]
  badge: {
    text: string;
    type: 'hot' | 'record' | 'exclusive' | 'ac' | 'traditional';
  };
  headliner: HeadlinerArtist;
  parking: ParkingInfo;
  tickets: TicketBreakdown;
  ticketingPlatform: 'BookMyShow' | 'Paytm Insider' | 'AllEvents' | 'Official Portal';
  ticketingUrl: string;
  venueExperience: 'Open Lawn' | 'AC Dome' | 'Heritage Club' | 'Sheri Garba';
  musicStyle: 'Traditional Raas' | 'Disco Dandiya' | 'Dhol Tasha Fusion' | 'Classical Mataji Aarti' | 'Sufi Raas';
}

export interface ArtistProfile {
  id: string;
  name: string;
  subtitle: string;
  role: string;
  description: string;
  photoUrl: string;
  performingDays: string;
  dayNumbers: number[];
  genre: string;
  badge1: string;
  badge2: string;
  primaryVenue: string;
  venueCity: string;
  statusBadge: string;
  previewTrack: {
    title: string;
    previewMeta: string;
    audioPlaceholderDuration: string;
  };
  socialLinks: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}

export interface GroundScheduleRow {
  id: string;
  timeSlot: string;
  dayText: string;
  dayNumber: number;
  artistName: string;
  artistInitials: string;
  artistColor: string;
  artistSubtext: string;
  venueName: string;
  venueLocation: string;
  passInventoryText: string;
  passInventoryPercent: number;
  inventoryAlertColor: 'secondary' | 'primary' | 'tertiary';
  bookingUrl: string;
  ticketingPlatform: string;
}

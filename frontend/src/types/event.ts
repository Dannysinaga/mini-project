export interface Profile {
  userId: string;
  fullName: string | null;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Organizer {
  id: string;
  email: string;
  passwordHash: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string | null;
  category: string;
  location: string;
  bannerUrl: string | null;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "PUBLISHED" | "FINISHED" | "CANCELED";
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ticketTypes: TicketType[];
  organizer?: Organizer;
  reviews?: Review[];
}
export interface TransactionTicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  ticketTypeId: string;
  quantity: number;
  subtotal: number;
  price: number;
  createdAt: string;
  ticketType?: TransactionTicketType;
}

export interface TransactionEvent {
  id: string;
  organizerId: string;
  name: string;
  description: string | null;
  category: string;
  location: string;
  bannerUrl: string | null;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionProfile {
  userId: string;
  fullName: string | null;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  profile?: TransactionProfile | null;
}

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  totalAmount: number;
  pointsUsed: number;
  finalAmount: number;
  paymentProofUrl: string | null;
  createdAt: string;
  confirmationDeadlineAt: string | null;
  couponDiscount: number;
  couponId: string | null;
  paymentDeadlineAt: string;
  paymentUploadedAt: string | null;
  rejectionReason: string | null;
  updatedAt: string;
  voucherDiscount: number;
  voucherId: string | null;
  status:
    | "WAITING_PAYMENT"
    | "WAITING_CONFIRMATION"
    | "DONE"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELED";
  items: TransactionItem[];
  event?: TransactionEvent;
  user?: TransactionUser;
}
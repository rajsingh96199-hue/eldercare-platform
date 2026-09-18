export type Role = 'FAMILY' | 'CAREGIVER' | 'ADMIN';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'DISPUTED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
  city?: string | null;
  emergencyContact?: string | null;
  isActive: boolean;
  createdAt: string;
  caregiverProfile?: CaregiverProfile | null;
}

export interface VerificationDocument {
  id: string;
  caregiverId: string;
  type: string;
  name: string;
  fileUrl: string;
  status: VerificationStatus;
  notes?: string | null;
  uploadedAt: string;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  user?: User;
  title: string;
  bio: string;
  yearsExperience: number;
  hourlyRate: number;
  dailyRate: number;
  qualifications: string; // JSON array string
  specializations: string; // JSON array string
  serviceAreas: string; // JSON array string
  languages: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationNotes?: string | null;
  ratingAvg: number;
  ratingCount: number;
  totalHoursCompleted: number;
  isAvailable: boolean;
  documents?: VerificationDocument[];
  reviewsReceived?: Review[];
  createdAt: string;
}

export interface Patient {
  id: string;
  familyUserId: string;
  fullName: string;
  age: number;
  gender: string;
  relationship: string;
  medicalConditions?: string | null;
  allergies?: string | null;
  mobilityLevel: string;
  dietaryNeeds?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  doctorName?: string | null;
  doctorPhone?: string | null;
  notes?: string | null;
  createdAt: string;
  careNotes?: CareNote[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: string;
  baseHourlyRate: number;
  baseDailyRate: number;
  features: string; // JSON string array
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  familyUserId: string;
  caregiverUserId: string;
  patientId: string;
  serviceId: string;
  bookingType: 'HOURLY' | 'DAILY' | 'LONG_TERM';
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  platformFee: number;
  caregiverPayout: number;
  status: BookingStatus;
  serviceAddress: string;
  city: string;
  specialInstructions?: string | null;
  cancellationReason?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  service?: Service;
  familyUser?: Partial<User>;
  caregiverUser?: Partial<User> & { caregiverProfile?: Partial<CaregiverProfile> };
  careNotes?: CareNote[];
  review?: Review | null;
}

export interface CareNote {
  id: string;
  bookingId: string;
  caregiverProfileId: string;
  patientId: string;
  date: string;
  bloodPressure?: string | null;
  bloodSugar?: string | null;
  pulseRate?: number | null;
  temperature?: number | null;
  oxygenLevel?: number | null;
  medicationsAdministered?: string | null;
  dietNotes?: string | null;
  mobilityExercises?: string | null;
  moodState?: string | null;
  notes: string;
  createdAt: string;
  caregiverProfile?: {
    user?: {
      fullName: string;
      avatar?: string | null;
    };
  };
  booking?: {
    bookingNumber: string;
    service?: { title: string };
  };
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  caregiverProfileId: string;
  rating: number;
  comment: string;
  punctualityRating?: number;
  careQualityRating?: number;
  communicationRating?: number;
  createdAt: string;
  user?: {
    fullName: string;
    avatar?: string | null;
  };
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  bookingId: string;
  userId: string;
  againstUserId?: string | null;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
  adminResolution?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  user?: { fullName: string; email: string; phone?: string | null };
  againstUser?: { fullName: string; email: string; phone?: string | null };
  booking?: Booking;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface AdminAnalytics {
  users: {
    total: number;
    families: number;
    caregivers: number;
    verifiedCaregivers: number;
    pendingVerifications: number;
  };
  bookings: {
    total: number;
    completed: number;
    active: number;
    disputed: number;
  };
  financials: {
    gmv: number;
    platformRevenue: number;
    caregiverPayouts: number;
  };
  complaints: {
    open: number;
  };
  servicesBreakdown: Array<{
    id: string;
    title: string;
    slug: string;
    bookingsCount: number;
  }>;
  recentBookings: Booking[];
}

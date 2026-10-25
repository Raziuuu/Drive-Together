export type UserRole = 'user' | 'admin' | 'dealer';

export interface Profile {
  id: string;
  phone_number: string;
  full_name: string;
  city: string;
  area: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric';

export interface VehicleCategory {
  id: string;
  name: string;
  slug: 'car' | 'bike' | 'scooter' | 'auto';
  membership_fee: number; // e.g. 199, 299, 399, 499
  active: boolean;
  description?: string;
}

export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  active: boolean;
}

export interface VehicleColor {
  name: string;
  hex?: string; // e.g. '#1e3a8a', '#ffffff', '#475569'
}

export interface VehicleVariant {
  id: string;
  vehicle_id: string;
  name: string;
  ex_showroom_price: number;
  on_road_estimate: number;
  specifications?: Record<string, string>;
  active: boolean;
}

export interface Vehicle {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  slug: string;
  fuel_type: FuelType;
  description: string;
  starting_price: number;
  image_url: string;
  active: boolean;
  created_at?: string;
  brand?: VehicleBrand;
  category?: VehicleCategory;
  variants?: VehicleVariant[];
  colors?: VehicleColor[];
}

export type GroupStatus =
  | 'Building'
  | 'Almost Full'
  | 'Negotiation Ready'
  | 'Negotiating'
  | 'Offer Received'
  | 'Purchase Window Open'
  | 'Completed'
  | 'Failed'
  | 'Refund Processing'
  | 'Refunded';

export interface Group {
  id: string;
  vehicle_id: string;
  location: string;
  minimum_members: number; // minimum required to unlock bulk negotiation (no upper limit on group size!)
  current_members: number; // total buyers joined in this month's group
  membership_fee: number;
  month_name?: string; // e.g. 'November 2026', 'December 2026', 'January 2027'
  cycle_number: number; // 1, 2, or 3
  cycle_start_date: string;
  cycle_end_date: string;
  maximum_cycles: number; // default 3
  status: GroupStatus;
  created_at: string;
  updated_at?: string;
  vehicle?: Vehicle;
  active_offer?: DealerOffer;
}

export interface GroupCycle {
  id: string;
  group_id: string;
  cycle_number: number;
  start_date: string;
  end_date: string;
  member_count: number;
  minimum_members: number;
  status: 'active' | 'completed' | 'carried_forward' | 'failed';
}

export type MembershipStatus =
  | 'active'
  | 'transferred'
  | 'negotiation'
  | 'completed'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded';

export type PurchaseTimeline =
  | 'Within 15 days'
  | '15–30 days'
  | '1–3 months'
  | '3+ months';

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  payment_id: string;
  joined_at: string;
  membership_status: MembershipStatus;
  purchase_timeline: PurchaseTimeline;
  preferred_variant: string;
  preferred_color?: string; // e.g. 'Nexa Blue', 'Pearl Arctic White'
  preferred_location: string;
  selected_month?: string; // e.g. 'November 2026'
  selected_showroom?: string; // e.g. 'Advaith Hyundai Coastal, Mangalore'
  showroom_id?: string;
  group?: Group;
  user?: Profile;
}

export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded' | 'refund_pending';

export interface Payment {
  id: string;
  user_id: string;
  group_id: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_provider: 'demo' | 'razorpay' | 'cashfree';
  transaction_reference: string;
  created_at: string;
  group?: Group;
}

export interface Dealer {
  id: string;
  business_name: string;
  city: string;
  address: string;
  contact_name: string;
  phone: string;
  brand?: string; // Exclusive authorized manufacturer brand
  brands: string[];
  verified: boolean;
  created_at: string;
}

export interface DealerOffer {
  id: string;
  group_id: string;
  dealer_id: string;
  vehicle_variant_id?: string;
  offer_price: number;
  discount_amount: number;
  offer_expiry: string;
  notes?: string;
  status: 'active' | 'expired' | 'accepted' | 'rejected';
  created_at: string;
  dealer?: Dealer;
  group?: Group;
}

export interface Refund {
  id: string;
  user_id: string;
  group_id: string;
  payment_id: string;
  amount: number;
  reason: string;
  status: 'processing' | 'refunded' | 'failed';
  processed_at?: string;
  created_at: string;
  group?: Group;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | 'group_joined'
    | 'group_progress'
    | 'negotiation_started'
    | 'offer_received'
    | 'cycle_ending'
    | 'cycle_carried_forward'
    | 'refund_initiated'
    | 'refund_completed';
  read: boolean;
  link_url?: string;
  created_at: string;
}

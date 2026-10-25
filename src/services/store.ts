import {
  VehicleCategory,
  VehicleBrand,
  Vehicle,
  Group,
  Dealer,
  DealerOffer,
  Profile,
  GroupMember,
  Payment,
  Refund,
  Notification,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_VEHICLES,
  INITIAL_GROUPS,
  INITIAL_DEALERS,
  INITIAL_OFFERS,
  DEMO_USER_PROFILE,
  DEMO_ADMIN_PROFILE,
  INITIAL_USER_MEMBERSHIPS,
  INITIAL_USER_PAYMENTS,
  INITIAL_REFUNDS,
} from '@/data/seedData';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'dt_categories',
  BRANDS: 'dt_brands',
  VEHICLES: 'dt_vehicles',
  GROUPS: 'dt_groups',
  DEALERS: 'dt_dealers',
  OFFERS: 'dt_offers',
  MEMBERSHIPS: 'dt_memberships',
  PAYMENTS: 'dt_payments',
  REFUNDS: 'dt_refunds',
  NOTIFICATIONS: 'dt_notifications',
  CURRENT_USER: 'dt_current_user',
  SELECTED_LOCATION: 'dt_selected_location',
};

class DataStore {
  constructor() {
    if (this.isBrowser()) {
      // Auto-purge any stale mock user sessions from development
      const userPurged = localStorage.getItem('dt_user_purged_v2');
      if (!userPurged) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.setItem('dt_user_purged_v2', 'true');
      }

      // Auto-wipe mock data if not already cleared
      const wiped = localStorage.getItem('dt_mock_wiped_v4');
      if (!wiped) {
        this.clearAllMockData();
        localStorage.setItem('dt_mock_wiped_v4', 'true');
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch storage event for reactive listeners across components
      window.dispatchEvent(new Event('drivetogether_store_update'));
    } catch (e) {
      console.error('Failed to set item in storage', e);
    }
  }

  // Categories
  getCategories(): VehicleCategory[] {
    return this.getItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  saveCategory(cat: VehicleCategory): void {
    const list = this.getCategories();
    const index = list.findIndex((c) => c.id === cat.id);
    if (index >= 0) {
      list[index] = cat;
    } else {
      list.push(cat);
    }
    this.setItem(STORAGE_KEYS.CATEGORIES, list);
  }

  // Brands
  getBrands(): VehicleBrand[] {
    return this.getItem(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  }

  saveBrand(brand: VehicleBrand): void {
    const list = this.getBrands();
    const index = list.findIndex((b) => b.id === brand.id);
    if (index >= 0) {
      list[index] = brand;
    } else {
      list.push(brand);
    }
    this.setItem(STORAGE_KEYS.BRANDS, list);
  }

  deleteBrand(id: string): void {
    const list = this.getBrands().filter((b) => b.id !== id);
    this.setItem(STORAGE_KEYS.BRANDS, list);
  }

  // Vehicles
  getVehicles(): Vehicle[] {
    const rawVehicles = this.getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const brands = this.getBrands();
    const categories = this.getCategories();
    const list = rawVehicles && rawVehicles.length > 0 ? rawVehicles : INITIAL_VEHICLES;

    return list.map((v) => ({
      ...v,
      brand: brands.find((b) => b.id === v.brand_id),
      category: categories.find((c) => c.id === v.category_id),
    }));
  }

  saveVehicle(vehicle: Vehicle): void {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex((v) => v.id === vehicle.id);
    if (index >= 0) {
      vehicles[index] = vehicle;
    } else {
      vehicles.unshift(vehicle);
    }
    this.setItem(STORAGE_KEYS.VEHICLES, vehicles);
  }

  deleteVehicle(id: string): void {
    const vehicles = this.getVehicles().filter((v) => v.id !== id);
    this.setItem(STORAGE_KEYS.VEHICLES, vehicles);
  }

  // Groups
  getGroups(): Group[] {
    const rawGroups = this.getItem<Group[]>(STORAGE_KEYS.GROUPS, []);
    const vehicles = this.getVehicles();
    const offers = this.getOffers();

    return rawGroups.map((g) => ({
      ...g,
      vehicle: vehicles.find((v) => v.id === g.vehicle_id),
      active_offer: offers.find((o) => o.group_id === g.id && o.status === 'active'),
    }));
  }

  saveGroup(group: Group): void {
    const groups = this.getItem<Group[]>(STORAGE_KEYS.GROUPS, []);
    const index = groups.findIndex((g) => g.id === group.id);
    if (index >= 0) {
      groups[index] = group;
    } else {
      groups.unshift(group);
    }
    this.setItem(STORAGE_KEYS.GROUPS, groups);
  }

  deleteGroup(id: string): void {
    const groups = this.getItem<Group[]>(STORAGE_KEYS.GROUPS, []).filter((g) => g.id !== id);
    this.setItem(STORAGE_KEYS.GROUPS, groups);
  }

  // Dealers
  getDealers(): Dealer[] {
    return this.getItem<Dealer[]>(STORAGE_KEYS.DEALERS, []);
  }

  saveDealer(dealer: Dealer): void {
    const dealers = this.getDealers();
    const index = dealers.findIndex((d) => d.id === dealer.id);
    if (index >= 0) {
      dealers[index] = dealer;
    } else {
      dealers.unshift(dealer);
    }
    this.setItem(STORAGE_KEYS.DEALERS, dealers);
  }

  deleteDealer(id: string): void {
    const dealers = this.getDealers().filter((d) => d.id !== id);
    this.setItem(STORAGE_KEYS.DEALERS, dealers);
  }

  // Offers
  getOffers(): DealerOffer[] {
    const rawOffers = this.getItem<DealerOffer[]>(STORAGE_KEYS.OFFERS, []);
    const dealers = this.getDealers();
    return rawOffers.map((o) => ({
      ...o,
      dealer: dealers.find((d) => d.id === o.dealer_id),
    }));
  }

  saveOffer(offer: DealerOffer): void {
    const offers = this.getItem<DealerOffer[]>(STORAGE_KEYS.OFFERS, []);
    const index = offers.findIndex((o) => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.unshift(offer);
    }
    this.setItem(STORAGE_KEYS.OFFERS, offers);
  }

  deleteOffer(id: string): void {
    const offers = this.getItem<DealerOffer[]>(STORAGE_KEYS.OFFERS, []).filter((o) => o.id !== id);
    this.setItem(STORAGE_KEYS.OFFERS, offers);
  }

  // Memberships
  getMemberships(): GroupMember[] {
    const raw = this.getItem<GroupMember[]>(STORAGE_KEYS.MEMBERSHIPS, []);
    const groups = this.getGroups();
    return raw.map((m) => ({
      ...m,
      group: groups.find((g) => g.id === m.group_id),
    }));
  }

  saveMembership(member: GroupMember): void {
    const list = this.getItem<GroupMember[]>(STORAGE_KEYS.MEMBERSHIPS, []);
    const index = list.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      list[index] = member;
    } else {
      list.unshift(member);
    }
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, list);
  }

  // Payments
  getPayments(): Payment[] {
    const raw = this.getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const groups = this.getGroups();
    return raw.map((p) => ({
      ...p,
      group: groups.find((g) => g.id === p.group_id),
    }));
  }

  savePayment(payment: Payment): void {
    const list = this.getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    list.unshift(payment);
    this.setItem(STORAGE_KEYS.PAYMENTS, list);
  }

  // Refunds
  getRefunds(): Refund[] {
    const raw = this.getItem<Refund[]>(STORAGE_KEYS.REFUNDS, []);
    const groups = this.getGroups();
    return raw.map((r) => ({
      ...r,
      group: groups.find((g) => g.id === r.group_id),
    }));
  }

  saveRefund(refund: Refund): void {
    const list = this.getItem<Refund[]>(STORAGE_KEYS.REFUNDS, []);
    const index = list.findIndex((r) => r.id === refund.id);
    if (index >= 0) {
      list[index] = refund;
    } else {
      list.unshift(refund);
    }
    this.setItem(STORAGE_KEYS.REFUNDS, list);
  }

  // Notifications
  getNotifications(userId: string): Notification[] {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return list.filter((n) => n.user_id === userId);
  }

  saveNotification(notification: Notification): void {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    list.unshift(notification);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  markNotificationRead(notificationId: string): void {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const item = list.find((n) => n.id === notificationId);
    if (item) {
      item.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  // Auth / Current User (defaults to null so unauthenticated users see Sign In / Sign Up)
  getCurrentUser(): Profile | null {
    return this.getItem<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: Profile | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Selected Location (Uppinangady, Puttur, BC Road, Mangalore, All)
  getSelectedLocation(): string {
    return this.getItem(STORAGE_KEYS.SELECTED_LOCATION, 'All Locations');
  }

  setSelectedLocation(location: string): void {
    this.setItem(STORAGE_KEYS.SELECTED_LOCATION, location);
  }

  // Wipe all mock data to start with a fresh clean website
  clearAllMockData(): void {
    if (!this.isBrowser()) return;
    this.setItem(STORAGE_KEYS.VEHICLES, []);
    this.setItem(STORAGE_KEYS.GROUPS, []);
    this.setItem(STORAGE_KEYS.DEALERS, []);
    this.setItem(STORAGE_KEYS.OFFERS, []);
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, []);
    this.setItem(STORAGE_KEYS.PAYMENTS, []);
    this.setItem(STORAGE_KEYS.REFUNDS, []);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, []);
    localStorage.setItem('dt_mock_wiped_v3', 'true');
  }

  // Load starter template / sample data
  loadStarterData(): void {
    if (!this.isBrowser()) return;
    this.setItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.setItem(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
    this.setItem(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.setItem(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
    this.setItem(STORAGE_KEYS.DEALERS, INITIAL_DEALERS);
    this.setItem(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    localStorage.setItem('dt_mock_wiped_v3', 'loaded');
  }

  // Reset to initial clean state
  resetAll(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.BRANDS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.DEALERS);
    localStorage.removeItem(STORAGE_KEYS.OFFERS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERSHIPS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.REFUNDS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem('dt_mock_wiped_v3');
    window.dispatchEvent(new Event('drivetogether_store_update'));
  }
}

export const store = new DataStore();

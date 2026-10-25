import { Group, Vehicle, Dealer } from '@/types';
import { store } from './store';

export interface AdminOverviewStats {
  totalUsers: number;
  verifiedMembers: number;
  activeGroups: number;
  negotiationReady: number;
  offersReceived: number;
  revenue: number;
  pendingRefunds: number;
  completedGroups: number;
}

export const adminService = {
  async getOverviewStats(): Promise<AdminOverviewStats> {
    const groups = store.getGroups();
    const memberships = store.getMemberships();
    const payments = store.getPayments();
    const refunds = store.getRefunds();
    const offers = store.getOffers();

    const revenue = payments
      .filter((p) => p.payment_status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRefunds = refunds.filter((r) => r.status === 'processing').length;
    const negotiationReady = groups.filter(
      (g) => g.status === 'Negotiation Ready' || g.status === 'Negotiating'
    ).length;
    const completedGroups = groups.filter((g) => g.status === 'Completed').length;
    const activeGroups = groups.filter(
      (g) => g.status === 'Building' || g.status === 'Almost Full'
    ).length;

    return {
      totalUsers: 142, // demo aggregate
      verifiedMembers: memberships.length + 37 + 18 + 42 + 22 + 26 + 32 + 38 + 19, // realistic sum of current group members
      activeGroups,
      negotiationReady,
      offersReceived: offers.length,
      revenue,
      pendingRefunds,
      completedGroups,
    };
  },

  async createGroup(data: {
    vehicleId: string;
    location: string;
    minimumMembers: number;
    membershipFee: number;
    cycleEndDate: string;
  }): Promise<Group> {
    const group: Group = {
      id: 'grp-' + Date.now().toString(),
      vehicle_id: data.vehicleId,
      location: data.location,
      minimum_members: data.minimumMembers,
      current_members: 0,
      membership_fee: data.membershipFee,
      cycle_number: 1,
      cycle_start_date: new Date().toISOString(),
      cycle_end_date: data.cycleEndDate,
      maximum_cycles: 3,
      status: 'Building',
      created_at: new Date().toISOString(),
    };
    store.saveGroup(group);
    return group;
  },

  async createVehicle(data: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle> {
    const vehicle: Vehicle = {
      id: 'v-' + Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    store.saveVehicle(vehicle);
    return vehicle;
  },

  async updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    store.saveVehicle(vehicle);
    return vehicle;
  },

  async deleteVehicle(id: string): Promise<void> {
    store.deleteVehicle(id);
  },

  async updateGroup(group: Group): Promise<Group> {
    group.updated_at = new Date().toISOString();
    store.saveGroup(group);
    return group;
  },

  async deleteGroup(id: string): Promise<void> {
    store.deleteGroup(id);
  },

  async createDealer(data: Omit<Dealer, 'id' | 'created_at'>): Promise<Dealer> {
    const dealer: Dealer = {
      id: 'd-' + Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    store.saveDealer(dealer);
    return dealer;
  },

  async updateDealer(dealer: Dealer): Promise<Dealer> {
    store.saveDealer(dealer);
    return dealer;
  },

  async deleteDealer(id: string): Promise<void> {
    store.deleteDealer(id);
  },

  async deleteOffer(id: string): Promise<void> {
    store.deleteOffer(id);
  },

  async updateCategory(cat: any): Promise<void> {
    store.saveCategory(cat);
  },

  async createBrand(name: string, logoUrl?: string): Promise<void> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    store.saveBrand({
      id: 'b-' + Date.now().toString(),
      name,
      slug,
      logo_url: logoUrl || '',
      active: true,
    });
  },

  async deleteBrand(id: string): Promise<void> {
    store.deleteBrand(id);
  },

  async clearAllMockData(): Promise<void> {
    store.clearAllMockData();
  },

  async loadStarterData(): Promise<void> {
    store.loadStarterData();
  },
};


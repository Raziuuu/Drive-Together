import { Group, GroupStatus } from '@/types';
import { store } from './store';
import { refundService } from './refundService';

export const groupService = {
  async getGroups(filters?: {
    location?: string;
    categorySlug?: string;
    status?: string;
    search?: string;
  }): Promise<Group[]> {
    let groups = store.getGroups();

    if (filters?.location && filters.location !== 'All Locations' && filters.location !== 'all') {
      const loc = filters.location.toLowerCase();
      groups = groups.filter((g) => g.location.toLowerCase().includes(loc));
    }

    if (filters?.categorySlug && filters.categorySlug !== 'all') {
      groups = groups.filter((g) => g.vehicle?.category?.slug === filters.categorySlug);
    }

    if (filters?.status && filters.status !== 'all') {
      groups = groups.filter((g) => g.status === filters.status);
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      groups = groups.filter(
        (g) =>
          g.location.toLowerCase().includes(q) ||
          g.vehicle?.name.toLowerCase().includes(q) ||
          g.vehicle?.brand?.name.toLowerCase().includes(q)
      );
    }

    return groups;
  },

  async getGroupById(id: string): Promise<Group | null> {
    const groups = store.getGroups();
    return groups.find((g) => g.id === id) || null;
  },

  async getGroupsByVehicleId(vehicleId: string): Promise<Group[]> {
    const groups = store.getGroups();
    return groups.filter((g) => g.vehicle_id === vehicleId);
  },

  /**
   * Return available monthly group cycles (e.g. November 2026, December 2026, January 2027)
   */
  getAvailableMonths(): Array<{
    name: string;
    label: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string;
    description: string;
  }> {
    return [
      {
        name: 'November 2026',
        label: 'November 2026 (Active — Immediate Pooling)',
        isCurrent: true,
        startDate: '2026-11-01T00:00:00Z',
        endDate: '2026-11-30T23:59:59Z',
        description: 'Current active cycle. Immediate dealer negotiation upon reaching threshold.',
      },
      {
        name: 'December 2026',
        label: 'December 2026 (Upcoming Month Group)',
        isCurrent: false,
        startDate: '2026-12-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        description: 'Ideal for buyers planning year-end delivery & year-end dealer discount packages.',
      },
      {
        name: 'January 2027',
        label: 'January 2027 (Advance Booking Pool)',
        isCurrent: false,
        startDate: '2027-01-01T00:00:00Z',
        endDate: '2027-01-31T23:59:59Z',
        description: 'New year delivery pool. Secure early bulk allocation with partner showrooms.',
      },
      {
        name: 'February 2027',
        label: 'February 2027 (Future Delivery Group)',
        isCurrent: false,
        startDate: '2027-02-01T00:00:00Z',
        endDate: '2027-02-28T23:59:59Z',
        description: 'Advance planning group with no member limit. Lock in purchasing power early.',
      },
    ];
  },

  /**
   * Get or dynamically initialize a monthly group for a vehicle
   */
  async getOrCreateMonthlyGroup(vehicleId: string, monthName: string): Promise<Group> {
    const groups = store.getGroups();
    const existing = groups.find(
      (g) => g.vehicle_id === vehicleId && (g.month_name === monthName || (!g.month_name && monthName.includes('November')))
    );
    if (existing) {
      if (!existing.month_name) {
        existing.month_name = monthName;
        store.saveGroup(existing);
      }
      return existing;
    }

    const vehicles = store.getVehicles();
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const membershipFee = vehicle?.category?.membership_fee || 499;

    const availableMonths = this.getAvailableMonths();
    const targetMonth = availableMonths.find((m) => m.name === monthName) || availableMonths[0];

    const newGroup: Group = {
      id: `grp-${vehicleId}-${monthName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      vehicle_id: vehicleId,
      location: 'Mangalore + Puttur + BC Road + Uppinangady',
      minimum_members: 30, // threshold to trigger fleet bidding
      current_members: Math.floor(Math.random() * 12) + 6, // active organic interest
      membership_fee: membershipFee,
      month_name: monthName,
      cycle_number: 1,
      cycle_start_date: targetMonth.startDate,
      cycle_end_date: targetMonth.endDate,
      maximum_cycles: 3,
      status: 'Building',
      created_at: new Date().toISOString(),
      vehicle,
    };

    store.saveGroup(newGroup);
    return newGroup;
  },

  /**
   * Calculate group metrics: progress percentage, remaining members, days left
   */
  getGroupProgress(group: Group): {
    percentage: number;
    remaining: number;
    daysLeft: number;
    isNegotiationReady: boolean;
  } {
    const percentage = Math.min(100, Math.round((group.current_members / group.minimum_members) * 100));
    const remaining = Math.max(0, group.minimum_members - group.current_members);
    
    // Days remaining in current cycle
    const endDate = new Date(group.cycle_end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      percentage,
      remaining,
      daysLeft,
      isNegotiationReady: group.current_members >= group.minimum_members,
    };
  },

  /**
   * Advance group cycle (Monthly progression logic)
   * 1. If minimum reached -> Negotiation Ready
   * 2. If minimum NOT reached and cycle < 3 -> Carried forward to next monthly group (cycle + 1)
   * 3. If cycle === 3 and minimum NOT reached -> Group Failed & Auto refund initiated!
   */
  async advanceGroupCycle(groupId: string): Promise<Group> {
    const group = await this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.current_members >= group.minimum_members) {
      group.status = 'Negotiation Ready';
      group.updated_at = new Date().toISOString();
      store.saveGroup(group);
      return group;
    }

    if (group.cycle_number < group.maximum_cycles) {
      // Advance to next cycle
      group.cycle_number += 1;
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(0); // end of that month
      group.cycle_end_date = nextMonth.toISOString();
      group.status = 'Building';
      group.updated_at = new Date().toISOString();

      store.saveGroup(group);
      return group;
    }

    // Full 3 months passed without reaching threshold -> initiate refund
    group.status = 'Refund Processing';
    group.updated_at = new Date().toISOString();
    store.saveGroup(group);

    // Trigger refunds for members
    await refundService.initiateGroupRefunds(
      group.id,
      `Group did not reach minimum required serious buyers (${group.minimum_members}) after 3 months.`
    );

    return group;
  },

  /**
   * Update status directly (for Admin operations)
   */
  async updateStatus(groupId: string, status: GroupStatus): Promise<Group> {
    const group = await this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    group.status = status;
    group.updated_at = new Date().toISOString();
    store.saveGroup(group);
    return group;
  },
};

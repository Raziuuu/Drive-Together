import { GroupMember, PurchaseTimeline } from '@/types';
import { store } from './store';
import { paymentService } from './paymentService';
import { notificationService } from './notificationService';

export const membershipService = {
  /**
   * Join a vehicle group after paying the Group Membership Fee
   */
  async joinGroup(params: {
    userId: string;
    groupId: string;
    preferredVariant: string;
    preferredColor?: string;
    purchaseTimeline: PurchaseTimeline;
    preferredLocation: string;
    selectedMonth?: string;
    selectedShowroom?: string;
    showroomId?: string;
  }): Promise<{ member: GroupMember; isGroupNowReady: boolean }> {
    const groups = store.getGroups();
    const group = groups.find((g) => g.id === params.groupId);
    if (!group) throw new Error('Vehicle group not found');

    // Check if user is already an active member of THIS specific group
    const existing = store
      .getMemberships()
      .find((m) => m.group_id === params.groupId && m.user_id === params.userId && m.membership_status === 'active');

    if (existing) {
      throw new Error('You are already an active member of this group.');
    }

    // 1. Process payment for Group Membership Fee
    const payment = await paymentService.processPayment({
      userId: params.userId,
      groupId: params.groupId,
      amount: group.membership_fee,
    });

    // 2. Increment group members (no limit on group size!)
    group.current_members += 1;
    let isGroupNowReady = false;

    if (group.current_members >= group.minimum_members) {
      group.status = 'Negotiation Ready';
      isGroupNowReady = true;
    } else if (group.current_members >= group.minimum_members * 0.8) {
      group.status = 'Almost Full';
    }

    group.updated_at = new Date().toISOString();
    store.saveGroup(group);

    // 3. Create Group Member record
    const member: GroupMember = {
      id: 'mem-' + Date.now().toString(),
      group_id: params.groupId,
      user_id: params.userId,
      payment_id: payment.id,
      joined_at: new Date().toISOString(),
      membership_status: isGroupNowReady ? 'negotiation' : 'active',
      purchase_timeline: params.purchaseTimeline,
      preferred_variant: params.preferredVariant,
      preferred_color: params.preferredColor,
      preferred_location: params.preferredLocation,
      selected_month: params.selectedMonth || group.month_name || 'November 2026',
      selected_showroom: params.selectedShowroom || 'Preferred Authorized Showroom',
      showroom_id: params.showroomId,
      group,
    };

    store.saveMembership(member);

    // 4. Send confirmation notification
    await notificationService.sendNotification({
      user_id: params.userId,
      title: 'Group Joined Successfully',
      message: `You are officially member #${group.current_members} in the ${group.vehicle?.name || 'vehicle'} group for ${member.selected_month} (Showroom: ${member.selected_showroom}).`,
      type: 'group_joined',
      link_url: `/dashboard/groups`,
    });

    return { member, isGroupNowReady };
  },

  async getUserMemberships(userId: string): Promise<GroupMember[]> {
    const memberships = store.getMemberships();
    return memberships.filter((m) => m.user_id === userId);
  },

  async getMembershipByGroup(userId: string, groupId: string): Promise<GroupMember | null> {
    const memberships = store.getMemberships();
    return memberships.find((m) => m.user_id === userId && m.group_id === groupId) || null;
  },

  async getAllMembers(): Promise<GroupMember[]> {
    return store.getMemberships();
  },
};

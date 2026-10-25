import { Refund } from '@/types';
import { store } from './store';

export const refundService = {
  async getRefundsByUser(userId: string): Promise<Refund[]> {
    const refunds = store.getRefunds();
    return refunds.filter((r) => r.user_id === userId);
  },

  async getAllRefunds(): Promise<Refund[]> {
    return store.getRefunds();
  },

  /**
   * Initiate refunds for all members of an unfulfilled group after 3 months
   */
  async initiateGroupRefunds(groupId: string, reason: string): Promise<Refund[]> {
    const memberships = store.getMemberships().filter((m) => m.group_id === groupId);
    const payments = store.getPayments().filter((p) => p.group_id === groupId && p.payment_status === 'successful');
    const createdRefunds: Refund[] = [];

    for (const member of memberships) {
      const payment = payments.find((p) => p.id === member.payment_id);
      if (!payment) continue;

      const refund: Refund = {
        id: 'ref-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 5),
        user_id: member.user_id,
        group_id: groupId,
        payment_id: payment.id,
        amount: payment.amount,
        reason: reason || 'Group did not reach minimum required serious buyers within 3 months.',
        status: 'processing',
        created_at: new Date().toISOString(),
      };

      store.saveRefund(refund);
      createdRefunds.push(refund);

      // Update membership status
      member.membership_status = 'refund_pending';
      store.saveMembership(member);
    }

    return createdRefunds;
  },

  /**
   * Complete refund processing (by Admin or Bank)
   */
  async completeRefund(refundId: string): Promise<Refund> {
    const refunds = store.getRefunds();
    const refund = refunds.find((r) => r.id === refundId);
    if (!refund) throw new Error('Refund record not found');

    refund.status = 'refunded';
    refund.processed_at = new Date().toISOString();
    store.saveRefund(refund);

    // Update member record
    const memberships = store.getMemberships().filter((m) => m.payment_id === refund.payment_id);
    for (const m of memberships) {
      m.membership_status = 'refunded';
      store.saveMembership(m);
    }

    return refund;
  },
};

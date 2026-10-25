import { Payment } from '@/types';
import { store } from './store';

export const paymentService = {
  /**
   * Create and process a payment for Group Membership Fee
   */
  async processPayment(params: {
    userId: string;
    groupId: string;
    amount: number;
    provider?: 'demo' | 'razorpay' | 'cashfree';
  }): Promise<Payment> {
    const reference = 'DT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);

    const payment: Payment = {
      id: 'pay-' + Date.now().toString(),
      user_id: params.userId,
      group_id: params.groupId,
      amount: params.amount,
      currency: 'INR',
      payment_status: 'successful',
      payment_provider: params.provider || 'demo',
      transaction_reference: reference,
      created_at: new Date().toISOString(),
    };

    store.savePayment(payment);
    return payment;
  },

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    const list = store.getPayments();
    return list.filter((p) => p.user_id === userId);
  },

  async getAllPayments(): Promise<Payment[]> {
    return store.getPayments();
  },
};

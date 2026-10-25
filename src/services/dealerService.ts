import { Dealer, DealerOffer } from '@/types';
import { store } from './store';
import { notificationService } from './notificationService';

export const dealerService = {
  async getDealers(): Promise<Dealer[]> {
    return store.getDealers();
  },

  async getDealerById(id: string): Promise<Dealer | null> {
    const list = store.getDealers();
    return list.find((d) => d.id === id) || null;
  },

  async getOffers(groupId?: string): Promise<DealerOffer[]> {
    const offers = store.getOffers();
    if (groupId) {
      return offers.filter((o) => o.group_id === groupId);
    }
    return offers;
  },

  async createOffer(offerData: {
    groupId: string;
    dealerId: string;
    offerPrice: number;
    discountAmount: number;
    offerExpiry: string;
    notes?: string;
  }): Promise<DealerOffer> {
    const offer: DealerOffer = {
      id: 'o-' + Date.now().toString(),
      group_id: offerData.groupId,
      dealer_id: offerData.dealerId,
      offer_price: offerData.offerPrice,
      discount_amount: offerData.discountAmount,
      offer_expiry: offerData.offerExpiry,
      notes: offerData.notes,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    store.saveOffer(offer);

    // Update group status to 'Offer Received'
    const groups = store.getGroups();
    const group = groups.find((g) => g.id === offerData.groupId);
    if (group) {
      group.status = 'Offer Received';
      store.saveGroup(group);

      // Notify all members of this group
      const members = store.getMemberships().filter((m) => m.group_id === offerData.groupId);
      for (const m of members) {
        await notificationService.sendNotification({
          user_id: m.user_id,
          title: 'Dealer Offer Available!',
          message: `A negotiated offer of ₹${offerData.discountAmount.toLocaleString('en-IN')} off has been presented for your group.`,
          type: 'offer_received',
          link_url: `/dashboard/offers`,
        });
      }
    }

    return offer;
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
};

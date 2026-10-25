import { Notification } from '@/types';
import { store } from './store';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    return store.getNotifications(userId);
  },

  async markAsRead(notificationId: string): Promise<void> {
    store.markNotificationRead(notificationId);
  },

  async sendNotification(data: {
    user_id: string;
    title: string;
    message: string;
    type: Notification['type'];
    link_url?: string;
  }): Promise<Notification> {
    const notif: Notification = {
      id: 'notif-' + Date.now().toString(),
      ...data,
      read: false,
      created_at: new Date().toISOString(),
    };
    store.saveNotification(notif);
    return notif;
  },
};

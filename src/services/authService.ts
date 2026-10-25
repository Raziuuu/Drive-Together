import { Profile } from '@/types';
import { store } from './store';
import { DEMO_USER_PROFILE, DEMO_ADMIN_PROFILE } from '@/data/seedData';

export const DEMO_OTP = '123456';

export const authService = {
  /**
   * Request OTP for a given phone number
   */
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; demoOtp: string }> {
    // Basic phone validation (+91 or 10 digits)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }

    // In demo mode, we return the predetermined demo OTP: 123456
    return {
      success: true,
      message: `OTP sent successfully to +91 ${cleaned.slice(-10)}`,
      demoOtp: DEMO_OTP,
    };
  },

  /**
   * Verify entered OTP
   */
  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; user: Profile }> {
    if (otp !== DEMO_OTP) {
      throw new Error('Invalid OTP. In development demo mode, please enter 123456.');
    }

    const cleaned = phone.replace(/\D/g, '');
    const formattedPhone = `+91 ${cleaned.slice(-10, -5)} ${cleaned.slice(-5)}`;

    // Create or retrieve user
    let user = store.getCurrentUser();
    if (!user || user.phone_number !== formattedPhone) {
      user = {
        id: 'usr-' + Date.now().toString(),
        phone_number: formattedPhone,
        full_name: 'Verified Buyer',
        city: 'Mangalore',
        area: 'Coastal Region',
        role: 'user',
        created_at: new Date().toISOString(),
      };
    }

    store.setCurrentUser(user);
    return { success: true, user };
  },

  /**
   * Get currently logged-in user profile
   */
  getCurrentUser(): Profile | null {
    return store.getCurrentUser();
  },

  /**
   * Switch user in demo mode (for easily testing Admin dashboard vs regular User)
   */
  loginAs(role: 'user' | 'admin'): Profile {
    const profile = role === 'admin' ? DEMO_ADMIN_PROFILE : DEMO_USER_PROFILE;
    store.setCurrentUser(profile);
    return profile;
  },

  /**
   * Sign out
   */
  logout(): void {
    store.setCurrentUser(null);
  },

  /**
   * Update profile information
   */
  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = store.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const updated: Profile = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    store.setCurrentUser(updated);
    return updated;
  },
};

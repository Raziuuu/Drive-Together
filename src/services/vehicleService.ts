import { Vehicle, VehicleCategory, VehicleBrand } from '@/types';
import { store } from './store';

export const vehicleService = {
  async getCategories(): Promise<VehicleCategory[]> {
    return store.getCategories().filter((c) => c.active);
  },

  async getBrands(): Promise<VehicleBrand[]> {
    return store.getBrands().filter((b) => b.active);
  },

  async getVehicles(filters?: {
    categorySlug?: string;
    fuelType?: string;
    brandId?: string;
    search?: string;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    let vehicles = store.getVehicles().filter((v) => v.active);

    if (filters?.categorySlug && filters.categorySlug !== 'all') {
      vehicles = vehicles.filter((v) => v.category?.slug === filters.categorySlug);
    }

    if (filters?.fuelType && filters.fuelType !== 'all') {
      vehicles = vehicles.filter((v) => v.fuel_type.toLowerCase() === filters.fuelType?.toLowerCase());
    }

    if (filters?.brandId && filters.brandId !== 'all') {
      vehicles = vehicles.filter((v) => v.brand_id === filters.brandId);
    }

    if (filters?.maxPrice) {
      vehicles = vehicles.filter((v) => v.starting_price <= filters.maxPrice!);
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      vehicles = vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.brand?.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.fuel_type.toLowerCase().includes(q)
      );
    }

    return vehicles;
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const list = store.getVehicles();
    return list.find((v) => v.id === id) || null;
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const list = store.getVehicles();
    return list.find((v) => v.slug === slug) || null;
  },
};

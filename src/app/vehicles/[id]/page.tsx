import React from 'react';
import { store } from '@/services/store';
import { VehicleDetailClient } from './VehicleDetailClient';
import { notFound } from 'next/navigation';

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle =
    store.getVehicles().find((v) => v.id === id || v.slug === id) ||
    store.getVehicles()[0];

  if (!vehicle) {
    notFound();
  }

  const initialGroups = store.getGroups().filter((g) => g.vehicle_id === vehicle.id);

  return (
    <VehicleDetailClient vehicle={vehicle} initialGroups={initialGroups} />
  );
}

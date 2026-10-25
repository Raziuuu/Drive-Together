'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { vehicleService, adminService } from '@/services';
import { Vehicle, VehicleBrand, VehicleCategory, VehicleVariant } from '@/types';
import {
  CarFront,
  Plus,
  CheckCircle2,
  X,
  Tag,
  Pencil,
  Trash2,
  AlertCircle,
  Search,
  Fuel,
  IndianRupee,
  ShieldAlert,
} from 'lucide-react';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Vehicle Modal
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Hybrid' | 'Electric'>('Petrol');
  const [startingPrice, setStartingPrice] = useState(1000000);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>([
    { name: 'Pearl Arctic White', hex: '#F8F9FA' },
    { name: 'Nexa Blue', hex: '#16325C' },
    { name: 'Grandeur Grey', hex: '#5A6268' },
    { name: 'Splendid Silver', hex: '#C0C0C0' },
  ]);
  const [variants, setVariants] = useState<Array<{ name: string; price: number }>>([
    { name: 'Base Variant', price: 900000 },
    { name: 'Top-End DCA', price: 1350000 },
  ]);

  // Category Fee Edit Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(null);
  const [catFee, setCatFee] = useState(499);

  // Brand Modal
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vList, bList, cList] = await Promise.all([
        vehicleService.getVehicles(),
        vehicleService.getBrands(),
        vehicleService.getCategories(),
      ]);
      setVehicles(vList);
      setBrands(bList);
      setCategories(cList);
      if (bList.length > 0 && !brandId) setBrandId(bList[0].id);
      if (cList.length > 0 && !categoryId) setCategoryId(cList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateVehicle = () => {
    setEditingVehicleId(null);
    setName('');
    if (brands.length > 0) setBrandId(brands[0].id);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setFuelType('Petrol');
    setStartingPrice(800000);
    setImageUrl('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
    setDescription('');
    setColors([
      { name: 'Pearl Arctic White', hex: '#F8F9FA' },
      { name: 'Nexa Blue', hex: '#16325C' },
      { name: 'Grandeur Grey', hex: '#5A6268' },
      { name: 'Splendid Silver', hex: '#C0C0C0' },
    ]);
    setVariants([
      { name: 'Base Model', price: 800000 },
      { name: 'Top Model', price: 1250000 },
    ]);
    setVehicleModalOpen(true);
  };

  const openEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setName(v.name);
    setBrandId(v.brand_id);
    setCategoryId(v.category_id);
    setFuelType(v.fuel_type as any);
    setStartingPrice(v.starting_price);
    setImageUrl(v.image_url);
    setDescription(v.description);
    setColors(
      v.colors && v.colors.length > 0
        ? v.colors.map((c) => ({ name: c.name, hex: c.hex || '#ffffff' }))
        : [
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Silver', hex: '#C0C0C0' },
            { name: 'Grey', hex: '#4B5563' },
            { name: 'Black', hex: '#111827' },
          ]
    );
    setVariants(
      v.variants && v.variants.length > 0
        ? v.variants.map((varItem) => ({ name: varItem.name, price: varItem.ex_showroom_price }))
        : [{ name: 'Standard Trim', price: v.starting_price }]
    );
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const formattedVariants: VehicleVariant[] = variants.map((varItem, idx) => ({
        id: `var-${Date.now()}-${idx}`,
        vehicle_id: editingVehicleId || `v-${Date.now()}`,
        name: varItem.name,
        ex_showroom_price: Number(varItem.price),
        on_road_estimate: Math.round(Number(varItem.price) * 1.15),
        specifications: {},
        active: true,
      }));
      const formattedColors = colors.filter((c) => c.name.trim() !== '');

      if (editingVehicleId) {
        // Edit existing
        const existing = vehicles.find((v) => v.id === editingVehicleId);
        if (!existing) throw new Error('Vehicle not found');

        const updated: Vehicle = {
          ...existing,
          name,
          slug,
          brand_id: brandId,
          category_id: categoryId,
          fuel_type: fuelType,
          starting_price: Number(startingPrice),
          image_url: imageUrl,
          description,
          variants: formattedVariants,
          colors: formattedColors,
        };
        await adminService.updateVehicle(updated);
        setMessage(`Vehicle "${name}" updated successfully!`);
      } else {
        // Create new
        await adminService.createVehicle({
          name,
          slug,
          brand_id: brandId,
          category_id: categoryId,
          fuel_type: fuelType,
          starting_price: Number(startingPrice),
          image_url: imageUrl,
          description,
          active: true,
          variants: formattedVariants,
          colors: formattedColors,
        });
        setMessage(`Vehicle "${name}" added to website catalog!`);
      }

      setVehicleModalOpen(false);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save vehicle');
    }
  };

  const handleDeleteVehicle = async (v: Vehicle) => {
    if (!confirm(`Are you sure you want to delete "${v.name}" from the website catalog?`)) {
      return;
    }
    try {
      await adminService.deleteVehicle(v.id);
      setMessage(`Vehicle "${v.name}" removed successfully.`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete vehicle');
    }
  };

  const handleSaveCategoryFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await adminService.updateCategory({
        ...editingCategory,
        membership_fee: Number(catFee),
      });
      setCategoryModalOpen(false);
      setMessage(`Category "${editingCategory.name}" membership fee updated to ₹${catFee}!`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update category fee');
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      await adminService.createBrand(newBrandName.trim());
      setBrandModalOpen(false);
      setNewBrandName('');
      setMessage(`Brand "${newBrandName}" added successfully!`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to create brand');
    }
  };

  const handleDeleteBrand = async (b: VehicleBrand) => {
    if (!confirm(`Delete brand "${b.name}"? Vehicles linked to this brand may need reassignment.`)) return;
    try {
      await adminService.deleteBrand(b.id);
      setMessage(`Brand "${b.name}" deleted.`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete brand');
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Vehicle Catalog & Pricing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Add, edit, and remove vehicles, trims, manufacturer brands, and category fees across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setBrandModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>

          <button
            onClick={openCreateVehicle}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Category Membership Fees Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Category Group Membership Fees
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Click edit to change any category fee</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white block">{cat.name}</span>
                <span className="text-lg font-black text-emerald-400">₹{cat.membership_fee}</span>
                <span className="text-[10px] text-slate-400 block">Refundable Fee</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(cat);
                  setCatFee(cat.membership_fee);
                  setCategoryModalOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition cursor-pointer"
                title="Edit Fee"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Vehicles Table with Full Edit & Delete Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CarFront className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Vehicles ({filteredVehicles.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by model or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
            <p>No vehicles found.</p>
            <button
              onClick={openCreateVehicle}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Click here to add your first vehicle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-800/60 text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Powertrain</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Colors</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                          <Image src={v.image_url} alt={v.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{v.name}</span>
                          <span className="text-[11px] text-slate-500">{v.brand?.name || 'Brand'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">{v.category?.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {v.fuel_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{(v.starting_price / 100000).toFixed(2)} Lakh
                    </td>

                    <td className="py-3.5 px-4">
                      {v.colors && v.colors.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="flex items-center -space-x-1">
                            {v.colors.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-xs"
                                style={{ backgroundColor: c.hex || '#ffffff' }}
                                title={c.name}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {v.colors.length} {v.colors.length === 1 ? 'color' : 'colors'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {v.variants?.length || 1} Trims
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditVehicle(v)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer"
                          title="Edit Vehicle"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(v)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition cursor-pointer"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Add / Edit Vehicle Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-xl w-full space-y-4 text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">
                {editingVehicleId ? 'Edit Vehicle Details' : 'Add New Vehicle to Catalog'}
              </h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Vehicle Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai Creta, Ather 450X, Bajaj RE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (₹{c.membership_fee} fee)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Powertrain / Fuel</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  placeholder="Vehicle highlights and key specifications..."
                />
              </div>

              {/* Factory Paint Colors */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                      Factory Paint Colors ({colors.length})
                    </label>
                    <span className="text-[10px] text-slate-500">Color options buyers can choose from</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setColors([
                          { name: 'Pearl Arctic White', hex: '#F8F9FA' },
                          { name: 'Nexa Blue', hex: '#16325C' },
                          { name: 'Grandeur Grey', hex: '#5A6268' },
                          { name: 'Splendid Silver', hex: '#C0C0C0' },
                          { name: 'Opulent Red', hex: '#8B0000' },
                          { name: 'Midnight Black', hex: '#111827' },
                        ])
                      }
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Load Popular Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setColors([...colors, { name: 'New Color', hex: '#1e3a8a' }])}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {colors.map((cItem, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/60"
                    >
                      <input
                        type="color"
                        value={cItem.hex || '#ffffff'}
                        onChange={(e) => {
                          const updated = [...colors];
                          updated[cIdx].hex = e.target.value;
                          setColors(updated);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                        title="Pick Color"
                      />
                      <input
                        type="text"
                        placeholder="Color Name (e.g. Nexa Blue)"
                        value={cItem.name}
                        onChange={(e) => {
                          const updated = [...colors];
                          updated[cIdx].name = e.target.value;
                          setColors(updated);
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400 w-16">{cItem.hex}</span>
                      {colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, i) => i !== cIdx))}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          title="Remove Color"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Variants list */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                    Variants / Trims ({variants.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { name: 'New Trim', price: startingPrice }])}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {variants.map((varItem, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Variant Name"
                        value={varItem.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].name = e.target.value;
                          setVariants(updated);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Ex-showroom Price"
                        value={varItem.price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].price = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-32 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  {editingVehicleId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Category Fee Modal */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit {editingCategory.name} Membership Fee</h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryFee} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Group Membership Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={catFee}
                  onChange={(e) => setCatFee(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-bold outline-none"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  This fee applies to all vehicles in the {editingCategory.name} category.
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold">
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Brand Modal */}
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Manufacturer Brand</h3>
              <button onClick={() => setBrandModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota, Skoda, Ola Electric"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBrandModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold">
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

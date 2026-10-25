'use client';

import React, { useState, useEffect } from 'react';
import { dealerService, groupService, adminService, vehicleService } from '@/services';
import { Dealer, DealerOffer, Group, VehicleBrand } from '@/types';
import {
  Building2,
  Plus,
  Tag,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  X,
  Sparkles,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Showroom Modal State
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [editingDealerId, setEditingDealerId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Mangalore');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Suzuki');
  const [availableBrands, setAvailableBrands] = useState<VehicleBrand[]>([]);
  const [verified, setVerified] = useState(true);

  // New Dealer Offer Modal
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [discountAmount, setDiscountAmount] = useState(35000);
  const [offerPrice, setOfferPrice] = useState(1150000);
  const [notes, setNotes] = useState('Includes ₹25,000 corporate discount + ₹10,000 accessory kit.');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dList, oList, gList, bList] = await Promise.all([
        dealerService.getDealers(),
        dealerService.getOffers(),
        groupService.getGroups(),
        vehicleService.getBrands(),
      ]);
      setDealers(dList);
      setOffers(oList);
      setGroups(gList);
      setAvailableBrands(bList);
      if (bList.length > 0 && !selectedBrand) setSelectedBrand(bList[0].name);
      if (gList.length > 0 && !selectedGroupId) setSelectedGroupId(gList[0].id);
      if (dList.length > 0 && !selectedDealerId) setSelectedDealerId(dList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateDealer = () => {
    setEditingDealerId(null);
    setBusinessName('');
    setCity('Mangalore');
    setAddress('');
    setContactName('');
    setPhone('+91 ');
    setSelectedBrand(availableBrands[0]?.name || 'Suzuki');
    setVerified(true);
    setDealerModalOpen(true);
  };

  const openEditDealer = (d: Dealer) => {
    setEditingDealerId(d.id);
    setBusinessName(d.business_name);
    setCity(d.city);
    setAddress(d.address);
    setContactName(d.contact_name);
    setPhone(d.phone);
    setSelectedBrand(d.brand || d.brands[0] || 'Suzuki');
    setVerified(d.verified);
    setDealerModalOpen(true);
  };

  const handleSaveDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDealerId) {
        const existing = dealers.find((d) => d.id === editingDealerId);
        if (!existing) throw new Error('Showroom not found');

        const updated: Dealer = {
          ...existing,
          business_name: businessName,
          city,
          address,
          contact_name: contactName,
          phone,
          brand: selectedBrand,
          brands: [selectedBrand],
          verified,
        };
        await adminService.updateDealer(updated);
        setMessage(`Showroom "${businessName}" updated!`);
      } else {
        await adminService.createDealer({
          business_name: businessName,
          city,
          address,
          contact_name: contactName,
          phone,
          brand: selectedBrand,
          brands: [selectedBrand],
          verified,
        });
        setMessage(`Showroom "${businessName}" added to partner network!`);
      }

      setDealerModalOpen(false);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save showroom');
    }
  };

  const handleDeleteDealer = async (d: Dealer) => {
    if (!confirm(`Are you sure you want to remove "${d.business_name}" from partnered showrooms?`)) return;
    try {
      await adminService.deleteDealer(d.id);
      setMessage(`Showroom "${d.business_name}" removed.`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete showroom');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      await dealerService.createOffer({
        groupId: selectedGroupId,
        dealerId: selectedDealerId,
        offerPrice: Number(offerPrice),
        discountAmount: Number(discountAmount),
        offerExpiry: expiry.toISOString(),
        notes,
      });

      setOfferModalOpen(false);
      setMessage('Negotiated dealer offer published to group members successfully!');
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to publish offer');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this negotiated offer?')) return;
    try {
      await adminService.deleteOffer(id);
      setMessage('Offer deleted successfully.');
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete offer');
    }
  };

  const filteredDealers = dealers.filter(
    (d) =>
      d.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.brands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dealership Network & Bulk Offers</h2>
          <p className="text-xs text-slate-400 mt-1">
            Add and manage partner authorized showrooms across Mangalore, Puttur, BC Road, and Uppinangady, and publish negotiated group discounts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openCreateDealer}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showroom</span>
          </button>

          <button
            onClick={() => setOfferModalOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Dealer Offer</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Showrooms Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Partner Showrooms ({filteredDealers.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by showroom, city, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {filteredDealers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
            <p>No showrooms found.</p>
            <button
              onClick={openCreateDealer}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Add your first partner showroom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDealers.map((d) => (
              <div
                key={d.id}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{d.business_name}</h4>
                      <span className="text-[10px] font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded">
                        {d.city}
                      </span>
                      {d.verified && (
                        <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{d.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDealer(d)}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                      title="Edit Showroom"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDealer(d)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition"
                      title="Delete Showroom"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{d.contact_name}: {d.phone}</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-lg">
                    Authorized {d.brand || d.brands[0]} Showroom
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Negotiated Offers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Negotiated Offers ({offers.length})
          </h3>
        </div>

        {offers.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No active negotiated offers. When a group hits its threshold, publish the dealer's fleet package here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((o) => (
              <div
                key={o.id}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Negotiated Fleet Discount</span>
                    <span className="text-xl font-black text-emerald-400">
                      ₹{o.discount_amount.toLocaleString('en-IN')} OFF
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteOffer(o.id)}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-snug">{o.notes}</p>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Showroom: {o.dealer?.business_name || o.dealer_id}</span>
                  <span className="text-emerald-400 font-semibold">Active Voucher</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Showroom Modal */}
      {dealerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 text-white my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">
                {editingDealerId ? 'Edit Showroom Details' : 'Add Partner Showroom'}
              </h3>
              <button onClick={() => setDealerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDealer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Showroom Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advaith Hyundai Coastal"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">City / Hub</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Mangalore">Mangalore</option>
                    <option value="Puttur">Puttur</option>
                    <option value="BC Road">BC Road</option>
                    <option value="Uppinangady">Uppinangady</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">
                    Authorized Brand (Exclusive Dealership)
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {availableBrands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                    {availableBrands.length === 0 && (
                      <>
                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Tata Motors">Tata Motors</option>
                        <option value="Honda">Honda</option>
                        <option value="Mahindra">Mahindra</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Kia">Kia</option>
                        <option value="Bajaj">Bajaj</option>
                        <option value="TVS">TVS</option>
                        <option value="Royal Enfield">Royal Enfield</option>
                        <option value="Ather">Ather</option>
                        <option value="Ola Electric">Ola Electric</option>
                      </>
                    )}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Exclusive dealership: sells only {selectedBrand} vehicles.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Showroom Address</label>
                <input
                  type="text"
                  required
                  placeholder="Full street address and landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Rai (GM)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98450 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDealerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  {editingDealerId ? 'Update Showroom' : 'Add Showroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Negotiated Offer Modal */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 text-white my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">Publish Negotiated Dealership Offer</h3>
              <button onClick={() => setOfferModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Target Vehicle Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.vehicle?.name || g.vehicle_id} — {g.month_name || 'November'} ({g.current_members} buyers)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Partner Showroom Offering Discount</label>
                <select
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  {dealers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.business_name} ({d.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Group Final Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Offer Details & Inclusions</label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  placeholder="e.g. Free 3-year warranty, ₹20,000 corporate rebate..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

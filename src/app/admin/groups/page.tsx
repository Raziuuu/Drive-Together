'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { groupService, vehicleService, adminService, refundService } from '@/services';
import { Group, Vehicle, GroupStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Users,
  Plus,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  X,
  CreditCard,
  Pencil,
  Trash2,
  Calendar,
  Search,
} from 'lucide-react';

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [monthName, setMonthName] = useState('November 2026');
  const [location, setLocation] = useState('Mangalore + Puttur + BC Road + Uppinangady');
  const [minimumMembers, setMinimumMembers] = useState(30);
  const [currentMembers, setCurrentMembers] = useState(0);
  const [membershipFee, setMembershipFee] = useState(499);
  const [status, setStatus] = useState<GroupStatus>('Building');
  const [cycleNumber, setCycleNumber] = useState(1);

  const availableMonths = groupService.getAvailableMonths();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gList, vList] = await Promise.all([
        groupService.getGroups(),
        vehicleService.getVehicles(),
      ]);
      setGroups(gList);
      setVehicles(vList);
      if (vList.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(vList[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingGroupId(null);
    if (vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
      setMembershipFee(vehicles[0].category?.membership_fee || 499);
    }
    setMonthName('November 2026');
    setLocation('Mangalore + Puttur + BC Road + Uppinangady');
    setMinimumMembers(30);
    setCurrentMembers(0);
    setStatus('Building');
    setCycleNumber(1);
    setGroupModalOpen(true);
  };

  const openEditModal = (g: Group) => {
    setEditingGroupId(g.id);
    setSelectedVehicleId(g.vehicle_id);
    setMonthName(g.month_name || 'November 2026');
    setLocation(g.location);
    setMinimumMembers(g.minimum_members);
    setCurrentMembers(g.current_members);
    setMembershipFee(g.membership_fee);
    setStatus(g.status);
    setCycleNumber(g.cycle_number);
    setGroupModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroupId) {
        const existing = groups.find((g) => g.id === editingGroupId);
        if (!existing) throw new Error('Group not found');

        const updated: Group = {
          ...existing,
          vehicle_id: selectedVehicleId,
          month_name: monthName,
          location,
          minimum_members: Number(minimumMembers),
          current_members: Number(currentMembers),
          membership_fee: Number(membershipFee),
          status,
          cycle_number: Number(cycleNumber),
        };
        await adminService.updateGroup(updated);
        setMessage(`Group updated successfully!`);
      } else {
        const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
        const newGroup: Group = {
          id: 'grp-' + Date.now().toString(),
          vehicle_id: selectedVehicleId,
          location,
          minimum_members: Number(minimumMembers),
          current_members: Number(currentMembers),
          membership_fee: Number(membershipFee),
          month_name: monthName,
          cycle_number: Number(cycleNumber),
          cycle_start_date: new Date().toISOString(),
          cycle_end_date: new Date(Date.now() + 30 * 86400000).toISOString(),
          maximum_cycles: 3,
          status,
          created_at: new Date().toISOString(),
          vehicle,
        };
        await adminService.updateGroup(newGroup);
        setMessage(`New monthly group created!`);
      }

      setGroupModalOpen(false);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save group');
    }
  };

  const handleDeleteGroup = async (g: Group) => {
    if (!confirm(`Are you sure you want to delete this group for "${g.vehicle?.name || g.id}"?`)) {
      return;
    }
    try {
      await adminService.deleteGroup(g.id);
      setMessage('Group deleted successfully.');
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete group');
    }
  };

  const handleAdvanceCycle = async (groupId: string) => {
    try {
      const updated = await groupService.advanceGroupCycle(groupId);
      setMessage(`Group cycle updated. Status: ${updated.status}, Month #${updated.cycle_number}`);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to advance cycle');
    }
  };

  const handleTriggerRefunds = async (groupId: string) => {
    if (!confirm('Are you sure you want to trigger 100% Group Membership Fee refunds for all members in this group?')) return;
    try {
      await groupService.updateStatus(groupId, 'Refund Processing');
      await refundService.initiateGroupRefunds(groupId, 'Admin initiated 3-month protection refund for unreached group.');
      setMessage('Refunds initiated for all members. Status changed to Refund Processing.');
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to trigger refunds');
    }
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.vehicle?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.month_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Monthly Group Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Create monthly pooling groups, edit negotiation thresholds, advance 3-month cycles, and manage member capacities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Monthly Group</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Groups List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Monthly Groups ({filteredGroups.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by vehicle or month..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
            <p>No groups found.</p>
            <button
              onClick={openCreateModal}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Create your first monthly group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.map((g) => (
              <div
                key={g.id}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {g.vehicle?.image_url && (
                      <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                        <Image src={g.vehicle.image_url} alt={g.vehicle.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">{g.vehicle?.brand?.name}</span>
                      <h4 className="text-sm font-bold text-white">{g.vehicle?.name || g.vehicle_id}</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{g.month_name || 'November 2026'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={g.status} size="sm" />
                    <button
                      onClick={() => openEditModal(g)}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                      title="Edit Group"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(g)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition"
                      title="Delete Group"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] uppercase">Enrolled</span>
                    <span className="font-bold text-white">{g.current_members} Buyers</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] uppercase">Threshold</span>
                    <span className="font-bold text-white">{g.minimum_members} Min</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] uppercase">Cycle</span>
                    <span className="font-bold text-white">Month #{g.cycle_number}/3</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] uppercase">Fee</span>
                    <span className="font-bold text-emerald-400">₹{g.membership_fee}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAdvanceCycle(g.id)}
                    className="flex-1 text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition text-center"
                  >
                    Advance Cycle (+1)
                  </button>

                  <button
                    onClick={() => handleTriggerRefunds(g.id)}
                    className="text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 transition"
                  >
                    Trigger 100% Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Group Modal */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 text-white my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">
                {editingGroupId ? 'Edit Monthly Group' : 'Create New Monthly Group'}
              </h3>
              <button
                onClick={() => setGroupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Target Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    const v = vehicles.find((item) => item.id === e.target.value);
                    if (v?.category?.membership_fee) {
                      setMembershipFee(v.category.membership_fee);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.brand?.name}) — Starting ₹{(v.starting_price / 100000).toFixed(2)}L
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Group Month</label>
                  <select
                    value={monthName}
                    onChange={(e) => setMonthName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    {availableMonths.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Min Threshold</label>
                  <input
                    type="number"
                    required
                    value={minimumMembers}
                    onChange={(e) => setMinimumMembers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Current Enrolled</label>
                  <input
                    type="number"
                    value={currentMembers}
                    onChange={(e) => setCurrentMembers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GroupStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Building">Building</option>
                    <option value="Almost Full">Almost Full</option>
                    <option value="Negotiation Ready">Negotiation Ready</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Refund Processing">Refund Processing</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Membership Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={membershipFee}
                    onChange={(e) => setMembershipFee(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold uppercase mb-1">Cycle Number</label>
                  <select
                    value={cycleNumber}
                    onChange={(e) => setCycleNumber(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value={1}>Month #1</option>
                    <option value={2}>Month #2</option>
                    <option value={3}>Month #3 (Final)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Regional Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  {editingGroupId ? 'Update Group' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

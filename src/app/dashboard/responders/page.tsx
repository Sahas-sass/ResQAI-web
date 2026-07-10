"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Responder {
  id: string;
  name: string;
  contact_number: string;
  role: 'medical' | 'fire' | 'police' | 'military';
  status: 'available' | 'busy';
  created_at: string;
}

export default function RespondersPage() {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Responder Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [selectedRole, setSelectedRole] = useState<'medical' | 'fire' | 'police' | 'military'>("medical");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch initial responders
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("responders")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setResponders(data);
      }
      setLoading(false);
    };

    fetchData();

    // 2. Set up Realtime WebSockets for responders
    const respondersChannel = supabase
      .channel("realtime-responders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responders" },
        (payload) => {
          const updated = payload.new as Responder;
          const old = payload.old as { id: string };

          setResponders((current) => {
            if (payload.eventType === "INSERT") {
              return [...current, updated].sort((a, b) => a.name.localeCompare(b.name));
            }
            if (payload.eventType === "UPDATE") {
              return current.map(item => item.id === updated.id ? updated : item);
            }
            if (payload.eventType === "DELETE") {
              return current.filter(item => item.id !== old.id);
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(respondersChannel);
    };
  }, []);

  // Action: Reset responder back to 'available' once they finish their duty
  const handleMakeAvailable = async (responderId: string, name: string) => {
    // Optimistically update local state immediately to ensure instant UI responsiveness
    setResponders((current) =>
      current.map(item => item.id === responderId ? { ...item, status: 'available' as const } : item)
    );

    try {
      const { error } = await supabase
        .from("responders")
        .update({ status: "available" })
        .eq("id", responderId);

      if (error) throw error;
      console.log(`Responder ${name} is now available.`);
    } catch (err: any) {
      console.error("Failed to reset responder status:", err);
      // Revert state on database failure
      setResponders((current) =>
        current.map(item => item.id === responderId ? { ...item, status: 'busy' as const } : item)
      );
      alert(`Error freeing responder: ${err.message}`);
    }
  };

  // Action: Submit Add Responder Form
  const handleAddResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContact.trim()) {
      setFormError("Please fill out both Name and Contact Number.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const { data, error } = await supabase
        .from("responders")
        .insert([
          {
            name: newName,
            contact_number: newContact,
            role: selectedRole,
            status: "available"
          }
        ])
        .select();

      if (error) throw error;

      // Optimistically update local list immediately in case realtime socket is not active/slow
      if (data && data[0]) {
        const newResp = data[0] as Responder;
        setResponders((current) => {
          const exists = current.some(item => item.id === newResp.id);
          if (exists) return current;
          return [...current, newResp].sort((a, b) => a.name.localeCompare(b.name));
        });
      }

      // Reset form states
      setNewName("");
      setNewContact("");
      setSelectedRole("medical");
      setShowAddForm(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to create responder.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (role: Responder['role']) => {
    switch (role) {
      case "medical": return "🚑";
      case "fire": return "🚒";
      case "police": return "🚔";
      case "military": return "🚛";
      default: return "🚨";
    }
  };

  const getRoleBadge = (role: Responder['role']) => {
    const icon = getRoleIcon(role);
    switch (role) {
      case "medical": return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">{icon} Medical</span>;
      case "fire": return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">{icon} Fire Dept</span>;
      case "police": return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{icon} Police Force</span>;
      case "military": return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">{icon} Military</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: Responder['status']) => {
    if (status === "available") {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Available
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
        On Duty (Busy)
      </span>
    );
  };

  // Filter list based on search query
  const filteredResponders = responders.filter(
    (resp) => resp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             resp.contact_number.includes(searchQuery) ||
             resp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics counters
  const totalResponders = responders.length;
  const availableCount = responders.filter(r => r.status === 'available').length;
  const busyCount = responders.filter(r => r.status === 'busy').length;

  return (
    <div className="p-8 min-h-screen bg-neutral-950 text-white flex flex-col gap-8">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Active Duty Crew Directory</h1>
          <p className="text-neutral-400 mt-2">Manage emergency personnel roles, register new responders, and release them once duty is complete.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 rounded-xl transition duration-150 shadow-md shadow-red-900/10 self-start flex items-center gap-2 cursor-pointer font-sans"
        >
          ➕ Register Responder
        </button>
      </div>

      {/* KPI Cards (Glassmorphism layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Responders", value: loading ? "..." : totalResponders, color: "text-white" },
          { label: "Available Crew", value: loading ? "..." : availableCount, color: "text-green-400" },
          { label: "Crew On Duty", value: loading ? "..." : busyCount, color: "text-red-500" }
        ].map((card, idx) => (
          <div key={idx} className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col gap-1">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{card.label}</span>
            <span className={`text-3xl font-extrabold ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Main Table Directory */}
      <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        
        {/* Search Input */}
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-neutral-200">Registered Personnel</h2>
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search responders by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121316] border border-neutral-800 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-red-600 transition duration-150 text-neutral-200 placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-red-600 border-neutral-800 animate-spin"></div>
            <span className="text-sm font-medium text-neutral-400">Loading Directory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            {filteredResponders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <p className="text-lg">No crew members found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Contact Number</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponders.map((resp) => (
                    <tr key={resp.id} className="border-b border-neutral-800/40 hover:bg-neutral-800/20 transition duration-150">
                      <td className="py-4.5 px-6 font-bold text-neutral-100">{resp.name}</td>
                      <td className="py-4.5 px-6 font-mono text-sm text-neutral-400">{resp.contact_number}</td>
                      <td className="py-4.5 px-6">{getRoleBadge(resp.role)}</td>
                      <td className="py-4.5 px-6">{getStatusBadge(resp.status)}</td>
                      <td className="py-4.5 px-6 text-right">
                        {resp.status === "busy" ? (
                          <button
                            onClick={() => handleMakeAvailable(resp.id, resp.name)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-150 cursor-pointer"
                          >
                            🔄 Make Available
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-600 font-semibold px-3.5 py-1.5 select-none">- Idle -</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal Form: Register Responder */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121316] border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold">Register Active Responder</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormError(null);
                }}
                className="text-neutral-500 hover:text-white font-extrabold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddResponder} className="flex flex-col gap-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3.5 py-2.5 rounded-lg">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sgt. Jayasinghe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#1b1c20] border border-neutral-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-red-600 text-neutral-200 placeholder-neutral-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +94 77 123 4567"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full bg-[#1b1c20] border border-neutral-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-red-600 text-neutral-200 placeholder-neutral-600"
                />
              </div>

              {/* Role Dropdown Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full bg-[#1b1c20] border border-neutral-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-red-600 text-neutral-200 cursor-pointer"
                >
                  <option value="medical">🚑 Medical</option>
                  <option value="fire">🚒 Fire Dept</option>
                  <option value="police">🚔 Police Force</option>
                  <option value="military">🚛 Military</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition duration-150 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Register Responder"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError(null);
                  }}
                  className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 font-bold text-sm rounded-xl transition duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

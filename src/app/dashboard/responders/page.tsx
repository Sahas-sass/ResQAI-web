"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Ambulance {
  id: string;
  license_plate: string;
  status: 'available' | 'en_route' | 'busy' | 'maintenance';
  latitude: number;
  longitude: number;
  created_at: string;
}

interface Responder {
  id: string;
  name: string;
  contact_number: string;
  ambulance_id: string | null;
  created_at: string;
  ambulances?: Ambulance | null; // Joined table
}

export default function RespondersPage() {
  const [activeTab, setActiveTab] = useState<'ambulances' | 'responders'>('ambulances');
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. Fetch initial data
    const fetchData = async () => {
      setLoading(true);
      const { data: ambData, error: ambErr } = await supabase
        .from("ambulances")
        .select("*")
        .order("license_plate", { ascending: true });

      const { data: respData, error: respErr } = await supabase
        .from("responders")
        .select("*, ambulances:ambulances(*)")
        .order("name", { ascending: true });

      if (!ambErr && ambData) {
        setAmbulances(ambData);
      }
      if (!respErr && respData) {
        // Map the joined field correctly
        setResponders(respData.map(r => ({
          ...r,
          ambulances: Array.isArray(r.ambulances) ? r.ambulances[0] : r.ambulances
        })));
      }
      setLoading(false);
    };

    fetchData();

    // 2. Set up Realtime WebSockets
    const ambulancesChannel = supabase
      .channel("realtime-ambulances")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ambulances" },
        (payload) => {
          const updated = payload.new as Ambulance;
          const old = payload.old as { id: string };

          setAmbulances((current) => {
            if (payload.eventType === "INSERT") {
              return [...current, updated].sort((a, b) => a.license_plate.localeCompare(b.license_plate));
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

    const respondersChannel = supabase
      .channel("realtime-responders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responders" },
        async (payload) => {
          // Since real-time payload doesn't automatically join foreign keys,
          // we fetch the updated responder with its joined ambulance info.
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const { data } = await supabase
              .from("responders")
              .select("*, ambulances:ambulances(*)")
              .eq("id", payload.new.id)
              .single();
            
            if (data) {
              const mapped = {
                ...data,
                ambulances: Array.isArray(data.ambulances) ? data.ambulances[0] : data.ambulances
              };
              setResponders((current) => {
                const exists = current.some(item => item.id === mapped.id);
                if (exists) {
                  return current.map(item => item.id === mapped.id ? mapped : item);
                } else {
                  return [...current, mapped].sort((a, b) => a.name.localeCompare(b.name));
                }
              });
            }
          } else if (payload.eventType === "DELETE") {
            const old = payload.old as { id: string };
            setResponders((current) => current.filter(item => item.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ambulancesChannel);
      supabase.removeChannel(respondersChannel);
    };
  }, []);

  const getStatusBadge = (status: Ambulance['status']) => {
    switch (status) {
      case "available":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Available
          </span>
        );
      case "en_route":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            En Route
          </span>
        );
      case "busy":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Busy
          </span>
        );
      case "maintenance":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-500/10 text-neutral-400 border border-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  // Filters based on query
  const filteredAmbulances = ambulances.filter(
    (amb) => amb.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
             amb.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResponders = responders.filter(
    (resp) => resp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             resp.contact_number.includes(searchQuery) ||
             (resp.ambulances?.license_plate || "unassigned").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics counters
  const totalAmbs = ambulances.length;
  const availableAmbs = ambulances.filter(a => a.status === 'available').length;
  const activeResponders = responders.filter(r => r.ambulance_id !== null).length;
  const maintenanceAmbs = ambulances.filter(a => a.status === 'maintenance').length;

  return (
    <div className="p-8 min-h-screen bg-neutral-950 text-white flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Responders & Fleet Directory</h1>
        <p className="text-neutral-400 mt-2">Monitor emergency vehicle statuses and active duty crew members in real time.</p>
      </div>

      {/* KPI Cards (Glassmorphism layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Fleet Size", value: loading ? "..." : totalAmbs, color: "text-white" },
          { label: "Available Units", value: loading ? "..." : availableAmbs, color: "text-green-400" },
          { label: "Active Responders", value: loading ? "..." : activeResponders, color: "text-red-500" },
          { label: "In Maintenance", value: loading ? "..." : maintenanceAmbs, color: "text-neutral-400" }
        ].map((card, idx) => (
          <div key={idx} className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col gap-1">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{card.label}</span>
            <span className={`text-3xl font-extrabold ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        
        {/* Sub-header, search & toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-[#121316] border border-neutral-800 p-1.5 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('ambulances')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'ambulances'
                  ? "bg-red-950/40 text-red-500 border border-red-900/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              🚑 Fleet Vehicles
            </button>
            <button
              onClick={() => setActiveTab('responders')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'responders'
                  ? "bg-red-950/40 text-red-500 border border-red-900/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              👨‍🚒 Active Personnel
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121316] border border-neutral-800 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-red-600 transition duration-150 text-neutral-200 placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-red-600 border-neutral-800 animate-spin"></div>
            <span className="text-sm font-medium text-neutral-400">Loading directory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            {activeTab === 'ambulances' ? (
              filteredAmbulances.length === 0 ? (
                <div className="text-center py-16 text-neutral-500">
                  <p className="text-lg">No vehicles found</p>
                  <p className="text-xs text-neutral-600 mt-1">Try tweaking your search term</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      <th className="py-4 px-6">License Plate</th>
                      <th className="py-4 px-6">GPS Coordinates</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAmbulances.map((amb) => (
                      <tr key={amb.id} className="border-b border-neutral-800/40 hover:bg-neutral-800/20 transition duration-150">
                        <td className="py-4.5 px-6 font-bold text-neutral-100">{amb.license_plate}</td>
                        <td className="py-4.5 px-6 font-mono text-xs text-neutral-400">
                          {amb.latitude.toFixed(5)}, {amb.longitude.toFixed(5)}
                        </td>
                        <td className="py-4.5 px-6">{getStatusBadge(amb.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              filteredResponders.length === 0 ? (
                <div className="text-center py-16 text-neutral-500">
                  <p className="text-lg">No crew members found</p>
                  <p className="text-xs text-neutral-600 mt-1">Try tweaking your search term</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Contact Number</th>
                      <th className="py-4 px-6">Assigned Vehicle</th>
                      <th className="py-4 px-6">Vehicle Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponders.map((resp) => (
                      <tr key={resp.id} className="border-b border-neutral-800/40 hover:bg-neutral-800/20 transition duration-150">
                        <td className="py-4.5 px-6 font-bold text-neutral-100">{resp.name}</td>
                        <td className="py-4.5 px-6 font-mono text-sm text-neutral-400">{resp.contact_number}</td>
                        <td className="py-4.5 px-6">
                          {resp.ambulances ? (
                            <span className="font-semibold text-neutral-300">{resp.ambulances.license_plate}</span>
                          ) : (
                            <span className="text-neutral-600 text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4.5 px-6">
                          {resp.ambulances ? (
                            getStatusBadge(resp.ambulances.status)
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-neutral-600 uppercase">OFF DUTY</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SOSReport {
  id: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface Ambulance {
  id: string;
  license_plate: string;
  status: 'available' | 'en_route' | 'busy' | 'maintenance';
  latitude: number;
  longitude: number;
  distance?: number; // Runtime calculated distance in meters
}

export default function DispatchPage() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [selectedReport, setSelectedReport] = useState<SOSReport | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper for Haversine distance fallback (client-side proximity)
  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns distance in meters
  };

  useEffect(() => {
    // 1. Initial Fetch
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch only pending SOS reports
      const { data: sosData, error: sosErr } = await supabase
        .from("sos_reports")
        .select("*")
        .neq("status", "dispatched")
        .order("created_at", { ascending: false });

      // Fetch only available ambulances
      const { data: ambData, error: ambErr } = await supabase
        .from("ambulances")
        .select("*")
        .eq("status", "available");

      if (!sosErr && sosData) {
        setReports(sosData);
      }
      if (!ambErr && ambData) {
        setAmbulances(ambData);
      }
      setLoading(false);
    };

    fetchData();

    // 2. Realtime WebSockets Subscriptions
    const sosChannel = supabase
      .channel("dispatch-sos-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sos_reports" },
        (payload) => {
          setReports((current) => {
            const updated = payload.new as SOSReport;
            const old = payload.old as { id: string };

            if (payload.eventType === "DELETE" || (payload.eventType === "UPDATE" && updated.status === "dispatched")) {
              // Remove if deleted or marked as dispatched
              if (selectedReport?.id === old.id || selectedReport?.id === updated.id) {
                setSelectedReport(null);
                setSelectedAmbulance(null);
              }
              return current.filter(item => item.id !== old.id && item.id !== updated.id);
            }
            if (payload.eventType === "INSERT") {
              return [updated, ...current];
            }
            if (payload.eventType === "UPDATE") {
              return current.map(item => item.id === updated.id ? updated : item);
            }
            return current;
          });
        }
      )
      .subscribe();

    const ambChannel = supabase
      .channel("dispatch-amb-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ambulances" },
        (payload) => {
          setAmbulances((current) => {
            const updated = payload.new as Ambulance;
            const old = payload.old as { id: string };

            if (payload.eventType === "DELETE" || (payload.eventType === "UPDATE" && updated.status !== "available")) {
              if (selectedAmbulance?.id === old.id || selectedAmbulance?.id === updated.id) {
                setSelectedAmbulance(null);
              }
              return current.filter(item => item.id !== old.id && item.id !== updated.id);
            }
            if (payload.eventType === "INSERT") {
              return [...current, updated];
            }
            if (payload.eventType === "UPDATE") {
              // Only keep in the list if available
              if (updated.status === "available") {
                const exists = current.some(item => item.id === updated.id);
                if (exists) {
                  return current.map(item => item.id === updated.id ? updated : item);
                } else {
                  return [...current, updated];
                }
              } else {
                return current.filter(item => item.id !== updated.id);
              }
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sosChannel);
      supabase.removeChannel(ambChannel);
    };
  }, [selectedReport, selectedAmbulance]);

  // Sort available ambulances by proximity when an SOS report is selected
  const getSortedAmbulances = () => {
    if (!selectedReport || selectedReport.latitude === null || selectedReport.longitude === null || selectedReport.latitude === undefined || selectedReport.longitude === undefined) {
      return ambulances.map(a => ({ ...a, distance: undefined }));
    }

    return [...ambulances]
      .map((amb) => {
        const dist = calculateHaversineDistance(
          selectedReport.latitude!,
          selectedReport.longitude!,
          amb.latitude,
          amb.longitude
        );
        return { ...amb, distance: dist };
      })
      .sort((a, b) => a.distance - b.distance);
  };

  const sortedAmbulances = getSortedAmbulances();

  const handleConfirmDispatch = async () => {
    if (!selectedReport || !selectedAmbulance) return;
    setDispatching(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Step 4: Atomic Dispatch Transaction Engine call (RPC Postgres Function)
      const { data, error } = await supabase.rpc("dispatch_ambulance", {
        p_sos_id: selectedReport.id,
        p_ambulance_id: selectedAmbulance.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check return payload from custom JSON postgres exception handler
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      if (result && result.success === false) {
        throw new Error(result.message);
      }

      setSuccessMsg(`Successfully dispatched ${selectedAmbulance.license_plate}!`);
      setShowModal(false);
      setSelectedReport(null);
      setSelectedAmbulance(null);
    } catch (err: any) {
      console.error(err);
      
      // Informative user check for the custom RPC schema setup
      if (err.message?.includes("function public.dispatch_ambulance") || err.message?.includes("Could not find")) {
        setErrorMsg("Failed to call atomic transaction function. Did you remember to paste and run the DDL in the Supabase SQL Editor?");
      } else {
        setErrorMsg(err.message || "An unexpected error occurred during dispatch.");
      }
      setShowModal(false);
    } finally {
      setDispatching(false);
    }
  };

  const getSeverityColor = (description: string) => {
    const desc = description.toLowerCase();
    const critical = ["fire", "trapped", "unconscious", "bleeding", "explosion", "heart attack", "breathing"];
    const high = ["crash", "accident", "broken", "robbery", "assault"];

    if (critical.some(word => desc.includes(word))) return "bg-red-500/20 text-red-500 border border-red-500/40";
    if (high.some(word => desc.includes(word))) return "bg-orange-500/20 text-orange-500 border border-orange-500/40";
    return "bg-yellow-500/20 text-yellow-500 border border-yellow-500/40";
  };

  return (
    <div className="p-8 min-h-screen bg-neutral-950 text-white flex flex-col gap-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Smart Dispatch Control</h1>
        <p className="text-neutral-400 mt-2">Correlate emergency reports and dynamically route available units by proximity.</p>
      </div>

      {/* Alert Banners */}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl flex items-center justify-between shadow-lg">
          <span className="font-semibold text-sm">✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-neutral-400 hover:text-white font-bold">×</button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center justify-between shadow-lg">
          <span className="font-semibold text-sm">⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-neutral-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Main split pane content */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-red-600 border-neutral-800 animate-spin"></div>
          <span className="text-neutral-400 text-sm font-medium">Booting dispatch desk...</span>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[500px]">
          
          {/* Left Pane: Active SOS Queue */}
          <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold">Active SOS Emergency Queue</h2>
              <span className="bg-red-600/10 text-red-500 border border-red-900/40 text-xs px-2.5 py-1 rounded-full font-bold">
                {reports.length} Reports Pending
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">🎉</span>
                <p className="font-semibold">No active emergencies</p>
                <p className="text-xs text-neutral-700 mt-1">All reports are successfully dispatched or closed.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[600px] flex flex-col gap-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                {reports.map((report) => {
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report);
                        setSelectedAmbulance(null); // Clear selected ambulance to force recalculation/re-selection
                      }}
                      className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-3 ${
                        isSelected
                          ? "bg-red-950/20 border-red-600/70 shadow-[0_0_15px_rgba(230,0,0,0.1)]"
                          : "bg-[#121316] border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-500 font-mono">
                          ID: {report.id.substring(0, 8)}...
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getSeverityColor(report.description)}`}>
                          Triage Review
                        </span>
                      </div>
                      <div>
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Location</p>
                        <p className="text-neutral-200 text-sm font-bold mt-0.5">{report.location}</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Report Description</p>
                        <p className="text-neutral-300 text-sm mt-0.5 line-clamp-2">{report.description}</p>
                      </div>
                      
                      {/* Badge if location coordinates exist */}
                      {report.latitude && report.longitude && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg self-start">
                          <span>📍</span> Geolocation coordinates loaded
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Pane: Available Fleet List */}
          <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold">Available Fleet Vehicles</h2>
              <span className="bg-green-500/10 text-green-400 border border-green-950 text-xs px-2.5 py-1 rounded-full font-bold">
                {ambulances.length} Units Available
              </span>
            </div>

            {!selectedReport ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">☝️</span>
                <p className="font-semibold">Select an emergency first</p>
                <p className="text-xs text-neutral-700 mt-1">Select an active SOS from the queue to sort and display the closest ambulance units.</p>
              </div>
            ) : ambulances.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">⚠️</span>
                <p className="font-semibold">No available ambulances</p>
                <p className="text-xs text-neutral-700 mt-1">All fleet vehicles are currently busy or in maintenance.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[600px] flex flex-col gap-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                <div className="text-xs text-neutral-500 font-semibold mb-1">
                  💡 Available vehicles are sorted by distance to the active incident.
                </div>
                {sortedAmbulances.map((amb, index) => {
                  const isClosest = index === 0 && amb.distance !== undefined;
                  const isSelected = selectedAmbulance?.id === amb.id;
                  
                  return (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbulance(amb)}
                      className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-3 ${
                        isSelected
                          ? "bg-green-950/20 border-green-600/70 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                          : "bg-[#121316] border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-neutral-100">{amb.license_plate}</span>
                        <div className="flex gap-2">
                          {isClosest && (
                            <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                              ⭐ RECOMMENDED (CLOSEST)
                            </span>
                          )}
                          <span className="bg-green-500/10 text-green-400 border border-green-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            AVAILABLE
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider block">Coordinates</span>
                          <span className="text-neutral-300 text-sm font-mono">{amb.latitude.toFixed(5)}, {amb.longitude.toFixed(5)}</span>
                        </div>
                        {amb.distance !== undefined ? (
                          <div className="text-right">
                            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider block">Distance</span>
                            <span className="text-green-400 font-extrabold text-lg">
                              {(amb.distance / 1000).toFixed(2)} km
                            </span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider block">Distance</span>
                            <span className="text-neutral-600 font-semibold text-sm">Coordinates missing on SOS</span>
                          </div>
                        )}
                      </div>

                      {/* Dispatch Trigger button */}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                          }}
                          className="mt-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition duration-150 shadow-md shadow-red-900/20 hover:scale-[1.01]"
                        >
                          ⚡ DISPATCH UNIT
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Foolproof Dispatch Unit confirmation modal */}
      {showModal && selectedReport && selectedAmbulance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#121316] border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Ambulance Dispatch</h3>
              <p className="text-neutral-400 text-sm mt-1.5">Please review the emergency details before confirming deployment.</p>
            </div>

            {/* Incident Details Summary */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-4">
              <div>
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">INCIDENT DETAILS</span>
                <p className="text-neutral-200 text-sm font-semibold mt-1">📍 {selectedReport.location}</p>
                <p className="text-neutral-300 text-sm mt-1 pl-4 italic">"{selectedReport.description}"</p>
              </div>
              <div className="border-t border-neutral-800/80 pt-3 flex justify-between items-center">
                <div>
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider block">ASSIGNED VEHICLE</span>
                  <span className="text-white text-base font-extrabold">🚑 {selectedAmbulance.license_plate}</span>
                </div>
                {selectedAmbulance.distance !== undefined && (
                  <div className="text-right">
                    <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider block">DISTANCE</span>
                    <span className="text-green-400 font-extrabold text-base">
                      {(selectedAmbulance.distance / 1000).toFixed(2)} km
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Foolproof Large buttons to prevent misclicks */}
            <div className="flex flex-col gap-3">
              <button
                disabled={dispatching}
                onClick={handleConfirmDispatch}
                className="w-full py-4.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-base rounded-xl transition duration-150 shadow-lg shadow-green-950 disabled:opacity-50 tracking-wider flex items-center justify-center gap-2"
              >
                {dispatching ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-t-white border-green-800 animate-spin"></div>
                    DISPATCHING UNIT...
                  </>
                ) : (
                  "🚨 CONFIRM DISPATCH"
                )}
              </button>
              
              <button
                disabled={dispatching}
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 font-bold text-sm rounded-xl transition duration-150 disabled:opacity-50"
              >
                CANCEL & RETURN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

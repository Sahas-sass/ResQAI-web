"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SOSReport {
  id: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
}

interface Responder {
  id: string;
  name: string;
  contact_number: string;
  role: 'medical' | 'fire' | 'police' | 'military';
  status: 'available' | 'busy';
}

export default function DispatchPage() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [selectedReport, setSelectedReport] = useState<SOSReport | null>(null);
  const [selectedResponder, setSelectedResponder] = useState<Responder | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'medical' | 'fire' | 'police' | 'military'>('all');
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch SOS reports
      const { data: sosData, error: sosErr } = await supabase
        .from("sos_reports")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch available responders
      const { data: respData, error: respErr } = await supabase
        .from("responders")
        .select("*")
        .eq("status", "available")
        .order("name", { ascending: true });

      if (!sosErr && sosData) {
        // Filter out any status that contains 'dispatched'
        setReports(sosData.filter(r => !r.status.includes("dispatched")));
      }
      if (!respErr && respData) {
        setResponders(respData);
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

            if (payload.eventType === "DELETE" || (payload.eventType === "UPDATE" && updated.status.includes("dispatched"))) {
              // Remove if deleted or marked as dispatched
              if (selectedReport?.id === old.id || selectedReport?.id === updated.id) {
                setSelectedReport(null);
                setSelectedResponder(null);
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

    const responderChannel = supabase
      .channel("dispatch-responder-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responders" },
        (payload) => {
          setResponders((current) => {
            const updated = payload.new as Responder;
            const old = payload.old as { id: string };

            if (payload.eventType === "DELETE" || (payload.eventType === "UPDATE" && updated.status !== "available")) {
              if (selectedResponder?.id === old.id || selectedResponder?.id === updated.id) {
                setSelectedResponder(null);
              }
              return current.filter(item => item.id !== old.id && item.id !== updated.id);
            }
            if (payload.eventType === "INSERT") {
              return [...current, updated].sort((a, b) => a.name.localeCompare(b.name));
            }
            if (payload.eventType === "UPDATE") {
              if (updated.status === "available") {
                const exists = current.some(item => item.id === updated.id);
                if (exists) {
                  return current.map(item => item.id === updated.id ? updated : item);
                } else {
                  return [...current, updated].sort((a, b) => a.name.localeCompare(b.name));
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
      supabase.removeChannel(responderChannel);
    };
  }, [selectedReport, selectedResponder]);

  // Action: Dispatch responder using atomic RPC function
  const handleConfirmDispatch = async () => {
    if (!selectedReport || !selectedResponder) return;
    setDispatching(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Call dispatch_responder RPC transaction
      const { data, error } = await supabase.rpc("dispatch_responder", {
        p_sos_id: selectedReport.id,
        p_responder_id: selectedResponder.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      const result = typeof data === 'string' ? JSON.parse(data) : data;
      if (result && result.success === false) {
        throw new Error(result.message);
      }

      // Optimistically update local lists immediately to ensure instant UI response
      setReports((current) => current.filter(item => item.id !== selectedReport.id));
      setResponders((current) => current.filter(item => item.id !== selectedResponder.id));

      setSuccessMsg(`Successfully deployed ${selectedResponder.name}! Case status is now '${result.new_status}'.`);
      setShowModal(false);
      setSelectedReport(null);
      setSelectedResponder(null);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("dispatch_responder") || err.message?.includes("Could not find")) {
        setErrorMsg("Failed to call atomic transaction function. Did you remember to paste and run the updated DDL in the Supabase SQL Editor?");
      } else {
        setErrorMsg(err.message || "An unexpected error occurred during dispatch.");
      }
      setShowModal(false);
    } finally {
      setDispatching(false);
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

  const getRoleName = (role: Responder['role']) => {
    switch (role) {
      case "medical": return "Medical";
      case "fire": return "Fire Dept";
      case "police": return "Police Force";
      case "military": return "Military";
      default: return "";
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

  // Filter available responders based on selected role filter
  const filteredResponders = responders.filter(
    (r) => roleFilter === "all" || r.role === roleFilter
  );

  return (
    <div className="p-8 min-h-screen bg-neutral-950 text-white flex flex-col gap-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Smart Dispatch Control Desk</h1>
        <p className="text-neutral-400 mt-2">Identify the emergency case role requirements and deploy available personnel directly.</p>
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

      {/* Main content grid */}
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
              <h2 className="text-lg font-bold">Active SOS Queue</h2>
              <span className="bg-red-600/10 text-red-500 border border-red-900/40 text-xs px-2.5 py-1 rounded-full font-bold">
                {reports.length} Reports Pending
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">🎉</span>
                <p className="font-semibold">No pending emergency reports</p>
                <p className="text-xs text-neutral-700 mt-1">All cases are dispatched or resolved.</p>
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
                        setSelectedResponder(null); // Reset selected responder
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
                          Review Case
                        </span>
                      </div>
                      <div>
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Location</p>
                        <p className="text-neutral-200 text-sm font-bold mt-0.5">{report.location}</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Description</p>
                        <p className="text-neutral-300 text-sm mt-0.5 line-clamp-3">{report.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Pane: Available Personnel */}
          <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            
            {/* Right Header with Filter Tabs */}
            <div className="flex flex-col gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Deployable Personnel</h2>
                <span className="bg-green-500/10 text-green-400 border border-green-950 text-xs px-2.5 py-1 rounded-full font-bold">
                  {responders.length} Crew Available
                </span>
              </div>
              
              {/* Role Filter Tabs */}
              <div className="flex flex-wrap gap-1 bg-[#121316] border border-neutral-800 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'medical', label: '🚑 Medical' },
                  { id: 'fire', label: '🚒 Fire' },
                  { id: 'police', label: '🚔 Police' },
                  { id: 'military', label: '🚛 Military' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setRoleFilter(tab.id as any);
                      setSelectedResponder(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-155 ${
                      roleFilter === tab.id
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {!selectedReport ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">👈</span>
                <p className="font-semibold">Select an SOS report first</p>
                <p className="text-xs text-neutral-700 mt-1">Select an active SOS from the left queue to unlock the deployable crew.</p>
              </div>
            ) : filteredResponders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 text-center py-20">
                <span className="text-4xl mb-2">🚨</span>
                <p className="font-semibold">No available crew for this role</p>
                <p className="text-xs text-neutral-700 mt-1">All responders in this category are currently busy on duty.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[500px] flex flex-col gap-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                {filteredResponders.map((resp) => {
                  const isSelected = selectedResponder?.id === resp.id;
                  
                  return (
                    <div
                      key={resp.id}
                      onClick={() => setSelectedResponder(resp)}
                      className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? "bg-green-950/20 border-green-600/70 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                          : "bg-[#121316] border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-neutral-100 flex items-center gap-2">
                          <span>{getRoleIcon(resp.role)}</span>
                          {resp.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                          {getRoleName(resp.role)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs text-neutral-500 mt-1">
                        <span>Contact: <span className="font-mono text-neutral-400">{resp.contact_number}</span></span>
                      </div>

                      {/* Dispatch Trigger button */}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                          }}
                          className="mt-3 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-md shadow-red-900/20 hover:scale-[1.01] tracking-wide cursor-pointer"
                        >
                          🚨 CONFIRM DEPLOYMENT
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

      {/* Confirmation Modal */}
      {showModal && selectedReport && selectedResponder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#121316] border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Deploy Dispatch Response</h3>
              <p className="text-neutral-400 text-sm mt-1.5">Verify case details and crew assignments before deploying.</p>
            </div>

            {/* Incident Details Summary */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-4">
              <div>
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">EMERGENCY SCENE</span>
                <p className="text-neutral-200 text-sm font-semibold mt-1">📍 {selectedReport.location}</p>
                <p className="text-neutral-300 text-sm mt-1 pl-4 italic">"{selectedReport.description}"</p>
              </div>
              <div className="border-t border-neutral-800/80 pt-3">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider block">DISPATCH CREW</span>
                <span className="text-white text-base font-extrabold flex items-center gap-2 mt-1">
                  <span>{getRoleIcon(selectedResponder.role)}</span>
                  {selectedResponder.name}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-wider">
                    {getRoleName(selectedResponder.role)}
                  </span>
                </span>
              </div>
            </div>

            {/* Large buttons */}
            <div className="flex flex-col gap-3">
              <button
                disabled={dispatching}
                onClick={handleConfirmDispatch}
                className="w-full py-4.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-base rounded-xl transition duration-150 shadow-lg shadow-green-950 disabled:opacity-50 tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {dispatching ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-t-white border-green-800 animate-spin"></div>
                    DEPLOYING CREW...
                  </>
                ) : (
                  `🚨 DEPLOY ${getRoleName(selectedResponder.role).toUpperCase()}`
                )}
              </button>
              
              <button
                disabled={dispatching}
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 font-bold text-sm rounded-xl transition duration-150 cursor-pointer"
              >
                CANCEL & BACK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

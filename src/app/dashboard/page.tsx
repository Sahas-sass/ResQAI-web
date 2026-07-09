"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Define the shape of our data
interface SOSReport {
  id: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
}

export default function DashboardHome() {
  const [reports, setReports] = useState<SOSReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResponders, setTotalResponders] = useState(0);

  useEffect(() => {
    // 1. Fetch initial data on load
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("sos_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10); // Grab the 10 most recent

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    };

    const fetchRespondersCount = async () => {
      const { count, error } = await supabase
        .from("responders")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setTotalResponders(count);
      }
    };

    fetchReports();
    fetchRespondersCount();

    // 2. Set up the Realtime Subscription for SOS reports
    const subscription = supabase
      .channel("sos_reports_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sos_reports" },
        (payload) => {
          console.log("New SOS Received!", payload);
          // Add the new report to the top of the list instantly
          setReports((currentReports) => [
            payload.new as SOSReport,
            ...currentReports,
          ]);
        }
      )
      .subscribe();

    // Realtime subscription for responders count updates
    const respondersSub = supabase
      .channel("responders_count_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responders" },
        () => {
          fetchRespondersCount();
        }
      )
      .subscribe();

    // Cleanup subscriptions when leaving the page
    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(respondersSub);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Emergencies", value: reports.length.toString(), color: "text-resq-red" },
          { title: "Total Responders", value: loading ? "..." : totalResponders.toString(), color: "text-green-600" },
          { title: "High Severity", value: "3", color: "text-orange-500" },
          { title: "Avg Response Time", value: "8m 42s", color: "text-blue-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-gray-500 mb-2">{stat.title}</span>
            <span className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Map & Live Feed Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        
        {/* Left Side: Live Map Area (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Live Incident Map</h2>
          <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-400 font-medium">[ Google Maps Component Goes Here ]</span>
          </div>
        </div>

        {/* Right Side: Live SOS Feed (1/3 width) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Live Incoming SOS</h2>
            <span className="flex items-center gap-2 text-xs font-bold text-resq-red">
              <span className="w-2 h-2 rounded-full bg-resq-red animate-pulse"></span>
              LIVE
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500 text-center mt-10">Loading communications...</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-10">No active emergencies.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 border border-resq-red/20 bg-red-50/50 rounded-lg flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2 py-1 bg-resq-red text-white rounded uppercase">
                      New Alert
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {new Date(report.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-1">📍 {report.location}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{report.description}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 bg-gray-900 text-white text-xs font-bold py-2 rounded hover:bg-gray-800 transition">
                      Dispatch
                    </button>
                    <button className="px-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded hover:bg-gray-50 transition">
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}